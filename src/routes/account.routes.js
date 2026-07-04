const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const accountController = require('../controllers/account.controller');
/**
 *  - POST /api/account/
 *  - Create a new account
 *  - Protected route
*/

router.post('/', authMiddleware.authMiddleware, accountController.createAccountController);

/**
  *  - GET /api/account/
  *  - Get all accounts of the logged-in user
  *  - Protected route
*/

router.get('/', authMiddleware.authMiddleware, accountController.getUserAccountsController);

/**
  * - GET /api/account/balance/:accountId
*/

router.get('/balance/:accountId', authMiddleware.authMiddleware, accountController.getAccountBalanceController);


module.exports = router;