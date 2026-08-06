const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();


/*
 * MIDDLEWARES 
 */
app.use(express.json());
app.use(cookieParser());

/*
 * ROUTES 
 */
const authRouter = require('./routes/auth.routes');
const accountRouter = require('./routes/account.routes');
const transactionRoutes = require('./routes/transaction.routes');

/* 
 * USE ROUTES 
 */

app.use('/api/auth', authRouter);
app.use('/api/account', accountRouter);
app.use('/api/transaction', transactionRoutes);

app.use('/', (req, res) => {
    res.send('Backend-Ledger is up now');
})
module.exports = app;