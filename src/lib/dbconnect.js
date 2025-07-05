const { default: mongoose } = require('mongoose');

const dbConnect = async () => {
    let mongoUri = process.env.MONGODB_URI;
    try {
        let connectionstatus = await mongoose.connect(mongoUri);
        // console.log(connectionstatus);
        console.log('mongo connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        // throw new Error('Failed to connect to the database');
    }
};
export default dbConnect;
