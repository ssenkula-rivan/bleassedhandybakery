const mongoose = require('mongoose');
const logger = require('../utils/logger');

class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      };

      this.connection = await mongoose.connect(process.env.MONGODB_URI, options);
      
      logger.info('✅ Database connected successfully');
      
      // Handle connection events
      mongoose.connection.on('error', (err) => {
        logger.error('Database error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('Database disconnected. Attempting to reconnect...');
        setTimeout(() => this.connect(), 5000);
      });

      return this.connection;
    } catch (error) {
      logger.error('❌ Database connection failed:', error);
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
