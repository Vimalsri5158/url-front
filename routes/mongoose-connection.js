import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const username =process.env.DB_USERNAME || '';
const password =process.env.DB_PASSWORD || '';
const clusterName =process.env.DB_CLUSTER || '';
const dbName =process.env.DB_NAME || '';


const cloudMongoUrl=`mongodb+srv://${username}:${password}@${clusterName}/${dbName}?retryWrites=true&w=majority`;

const localMongoUrl ='mongodb://27017/backend'



const connectToDb = async () => {
    try {
        await mongoose.connect(cloudMongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('DB connection Successful');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
}


export default connectToDb;