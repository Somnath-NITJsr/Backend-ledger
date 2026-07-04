const { Router } = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const transactionController = require('../controllers/transaction.controller');
const authSystemUserMiddleware = require('../middlewares/auth.middleware');
const transactionRoutes = Router();

/**
 *  - POST /api/transaction
 *  - Create new transaction
 */

transactionRoutes.post('/', authMiddleware.authMiddleware, transactionController.createTransactionController);


/**
  *  - POST /api/transaction/system/initial-funds
  *  - Create initial funds transactions from system user
 */

transactionRoutes.post('/system/initial-funds', authMiddleware.authSystemUserMiddleware, transactionController.createInitialFundsTransactions);


module.exports = transactionRoutes;