const express = require('express');
const router = express.Router();
const database = require('../config/database');
const ErrorLog = require('../models/ErrorLog');
const logger = require('../utils/logger');

// Basic health check
router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'Blessed Handly Bakery Bot'
  });
});

// Detailed health check
router.get('/detailed', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {}
  };

  // Check database
  try {
    health.checks.database = {
      status: database.isConnected() ? 'connected' : 'disconnected',
      healthy: database.isConnected()
    };
  } catch (error) {
    health.checks.database = {
      status: 'error',
      healthy: false,
      error: error.message
    };
    health.status = 'unhealthy';
  }

  // Check recent errors
  try {
    const recentErrors = await ErrorLog.countDocuments({
      timestamp: { $gte: new Date(Date.now() - 5 * 60 * 1000) }, // Last 5 minutes
      resolved: false
    });

    health.checks.errors = {
      recentCount: recentErrors,
      healthy: recentErrors < 10 // Alert if more than 10 errors in 5 minutes
    };

    if (recentErrors >= 10) {
      health.status = 'degraded';
    }
  } catch (error) {
    health.checks.errors = {
      status: 'error',
      healthy: false,
      error: error.message
    };
  }

  // Check memory usage
  const memUsage = process.memoryUsage();
  health.checks.memory = {
    heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
    healthy: memUsage.heapUsed / memUsage.heapTotal < 0.9
  };

  if (memUsage.heapUsed / memUsage.heapTotal >= 0.9) {
    health.status = 'degraded';
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});

// Error monitoring endpoint
router.get('/errors', async (req, res) => {
  try {
    const { hours = 24, limit = 100 } = req.query;
    
    const errors = await ErrorLog.find({
      timestamp: { $gte: new Date(Date.now() - hours * 60 * 60 * 1000) }
    })
    .sort({ timestamp: -1 })
    .limit(parseInt(limit))
    .select('-stackTrace'); // Don't expose stack traces

    // Group by error code
    const errorCounts = {};
    errors.forEach(err => {
      errorCounts[err.errorCode] = (errorCounts[err.errorCode] || 0) + 1;
    });

    res.json({
      success: true,
      totalErrors: errors.length,
      errorCounts,
      recentErrors: errors.slice(0, 10)
    });
  } catch (error) {
    logger.error('Error fetching error logs:', error);
    res.status(500).json({
      success: false,
      message: 'Could not fetch error logs'
    });
  }
});

module.exports = router;
