import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/notesdb';
        const conn = await mongoose.connect(mongoUri);
        console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`[Database] Error: ${(error as Error).message}`);
        process.exit(1);
    }
};