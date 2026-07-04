require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const startServer = async () => {

    try {

        await connectDB();
        console.log('Database connected');

        app.listen(process.env.PORT_NO, () => {
            console.log('Server is running at localhost');
        })

    } catch (err) {
        console.log('Failed to start the server due to ', err);
        process.exit(1);
    }
}

startServer();

