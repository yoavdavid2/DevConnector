import mongoose from 'mongoose';
import config from 'config';

const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with fialure
    process.exit(1);
  }
};

export default connectDB;
