const mongoose = require('mongoose');
const logger = require('../utils/logger');

class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      const options = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      };

      this.connection = await mongoose.connect(process.env.MONGODB_URI, options);
      
      logger.info('✅ Database connected successfully');
      console.log('✅ Connected to MongoDB');
      
      // Handle connection events
      mongoose.connection.on('error', (err) => {
        logger.error('Database error:', err);
        console.error('❌ Database error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('Database disconnected. Attempting to reconnect...');
        console.warn('⚠️ Database disconnected');
      });

      return this.connection;
    } catch (error) {
      logger.error('❌ Database connection failed:', error);
      console.error('❌ Database connection failed:', error.message);
      throw error;
    }
  }

  async disconnect() {
    try {
      await mongoose.connection.close();
      logger.info('Database disconnected');
    } catch (error) {
      logger.error('Error disconnecting database:', error);
    }
  }

  isConnected() {
    return mongoose.connection.readyState === 1;
  }
}

module.exports = new Database();
