import express from 'express';
import connectToMongoDB from './connect.js';
import urlRoutes from './routes/url.js';

const MONGO_DB_URL = 'mongodb://localhost:27017/short_url_db';
const PORT = 8001;

const app = express();

app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


try{
    connectToMongoDB(MONGO_DB_URL);
    console.log('Connected to MongoDB successfully');
} catch(err) {
    console.error('Error connecting to MongoDB:', err);
}



app.use('/', urlRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);   
});