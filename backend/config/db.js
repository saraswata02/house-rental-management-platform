const mongoose = require('mongoose');
const dns = require('dns');
const seedData = require('./seed');

dns.setServers(['8.8.8.8', '8.8.4.4']);

let mongodInstance = null;

const getConfiguredUri = () => {
    const uri = process.env.MONGO_URI;
    if (!uri) return null;

    const databaseName = process.env.MONGO_DB_NAME || 'smartrentai';
    const queryStart = uri.indexOf('?');
    const baseUri = queryStart === -1 ? uri : uri.slice(0, queryStart);
    const query = queryStart === -1 ? '' : uri.slice(queryStart);
    const hasDatabase = baseUri.slice(baseUri.lastIndexOf('/') + 1).length > 0;

    return hasDatabase ? uri : `${baseUri}${databaseName}${query}`;
};

const connectDB = async () => {
    const configuredUri = getConfiguredUri();
    const defaultUri = configuredUri || 'mongodb://localhost:27017/smartrentai';
    let connected = false;

    // Use the configured persistent database when available.
    try {
        const safeUri = defaultUri.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:***@');
        console.log(`🔌 Attempting connection to MongoDB at ${safeUri}...`);
        const conn = await mongoose.connect(defaultUri, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        connected = true;
    } catch (localErr) {
        if (configuredUri) {
            throw new Error(`Configured MongoDB connection failed: ${localErr.message}`);
        }
        console.warn(`⚠️ Local MongoDB connection failed (${localErr.message}).`);
    }

    // Only use an embedded database when no persistent database was configured.
    if (!connected && !configuredUri) {
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
