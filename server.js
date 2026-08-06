require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const startServer = async () => {

    try {

        await connectDB();
        console.log('Database connected');

        const PORT = process.env.PORT || process.env.PORT_NO || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })

    } catch (err) {
        console.log('Failed to start the server due to ', err);
        process.exit(1);
    }
}

startServer();

