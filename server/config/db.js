import mongoose from 'mongoose';

export const ConnectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.warn('Warning: MONGO_URI is not set in environment.');
            return;
        }
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        console.warn('Express server is running in offline/safe mode without database.');
    }
}