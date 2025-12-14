import { connect } from 'mongoose';


export default async function connectToMongoDB(url) {
    await connect(url);
}

