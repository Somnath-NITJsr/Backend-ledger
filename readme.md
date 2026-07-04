The flow starts (src - major codes) from the app.js
        1. initialize the server.
        2. config the server.
        3. routes handling.
        4. middlewares are also the part.
        5. export the app into the server.js

server.js -
    we start the start the server here 
    the database function is also fired from here



next part is to get the database (config it)
        we are using the MongoDB Atlas

        -> view projects -> create project -> rest you know
        username : somnathnitpatna_db_user
        password : e8QzGq8F3HBbxoCq

        process.exit(1); --> stops the server smoothly , if the database is not connected then there is no use of the server, can consume the resources

BASIC SERVER IS NOW FIRED.



Next part is to create models , authentication 
        -- create the schema of the userModel
                -- models
                        -- user.models.js
                              --  select: false, // by default the password will not be display, if the logic wants the password then it can display otherwise not

                        -- userSchema.pre('save',async function(next)) { 
                                .....
                        }

                        -- userSchema.methods.comparePassword = (password) = >{

                                // bcyrpt for comparing the password
                        }

        -- endpoints - registerUser, loginUser, logoutUser,


after the model is created , we moved towards the creation of routes
        -- auth.routes.js
                -- invoke the express.Router();

                -- write the endpoints


                -- export the router and import it in the app.js



        -- app.js
                -- app.use('/api/auth', authRouter);


        --- create the controllers (logics for the endpoints)
                auth.controller.js

                1. extract the name, email, password from the req.body
                2. check if the user already exists (422)
                3. hash the password (if not hashed during the model creation)
                4. create the user (await)
                5. assign a token to the user - (to mark that the user is currently logged in) -> jwt.sign
                6. res.cookie('token', token);
                7. status(201) - created

        Symptom: Cannot destructure property 'email' of 'req.body' as it is undefined.

        Root Cause: Postman body type was set to Text instead of JSON. Express ignored the payload.

        Fix: Set Postman Body to raw -> JSON.


        for login: 
        same as everything like logincontrollers

        // from the userModel part we used the comparePassword method
        const isValidPassword = await user.comparePassword(password);


        nodemailer -
        https://github.com/ankurdotio/Difference-Backend-video/tree/main/026-nodemailer
         - dont close the window where you can get the clientID and clientSecret
         - add test user from the audience section : same email must be provided
         - after you are authorized then you can come to the page where you will get the refresh token 

         -- the third party services are created under a service folder 


        -- encountered an error of connecting to mongodb, 
                -- entered the website and selected the project and changed the ip address :  0.0.0.0/0 and it got connected when i again tried to do it and its working fine now


-- created an model for the accounts part
        - one user can have multiple accounts or we can say to create an account there must be an user to operate it

        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
        index: true,  // B+ Tree


        // 🚀 Highly optimized Compound Index.
        // Speeds up queries searching for:
        //   - A specific user's active accounts: find({ user: id, status: 'ACTIVE' })
        //   - All accounts belonging to a user: find({ user: id })

        - created a compound index, for faster searching of the account
        - concept of B+ tree is used 
        - accountSchema.index({user: 1, status: 1});

        NExt is to create the endpoints for the creation


        -- created the authMiddlware for the router protection, so that unauthorised user cant create any account
        -- create the controllers

-- we then created the transaction model 
-- next to create the ledger model , here the things that are created once cant be modified at any cost
        -- very important part is the ledger creation

-- create the controller - transaction controller
        -- its has some of the steps inside it 
        -- like extract the toAccount, fromAccount, amount, idempotency Key- req.body
        
        
        
        -- get the balance of the fromAccount, so that the transaction begins
                -- we created a method ,
                        -- acccount.model.js , here async function is created getBalance
                        -- aggregate pipeline (feature of MongoDB) is used
                        -- ${match: account: this._id}
                                - it means that this( toAccount or fromAccount)
                        -- this method is used in the transaction.controller
                                -- again we are heading towards the getBalance method in the account.model.js, 
                                -- $group : for the credit and debit part
