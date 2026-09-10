const mongoose = require('mongoose');
const seedData = require('./seed');

let mongodInstance = null;

const connectDB = async () => {
    const defaultUri = process.env.MONGO_URI || 'mongodb://localhost:27017/smartrentai';
    let connected = false;

    // 1. Try configured / local MongoDB first (fast timeout)
    try {
        console.log(`🔌 Attempting connection to MongoDB at ${defaultUri}...`);
        const conn = await mongoose.connect(defaultUri, {
            serverSelectionTimeoutMS: 2500,
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        connected = true;
    } catch (localErr) {
        console.warn(`⚠️ Local MongoDB connection failed (${localErr.message}).`);
    }

    // 2. Fall back to embedded MongoMemoryServer if local Mongo is unavailable
    if (!connected) {
        try {
            console.log(`🚀 Starting embedded MongoMemoryServer...`);
            const { MongoMemoryServer } = require('mongodb-memory-server');
            mongodInstance = await MongoMemoryServer.create({
                binary: {
                    version: '7.0.14'
                }
            });
            const memoryUri = mongodInstance.getUri();
            const conn = await mongoose.connect(memoryUri);
            console.log(`✅ Embedded MongoMemoryServer connected at: ${memoryUri}`);
            connected = true;
        } catch (memErr) {
            console.error(`❌ MongoMemoryServer Error: ${memErr.message}`);
            process.exit(1);
        }
    }

    // 3. Seed initial demo properties & users if empty
    await seedData();
};

module.exports = connectDB;
