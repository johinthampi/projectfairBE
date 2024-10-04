//const appMiddleware = require('./Middlewares/appMiddleware')
const router = require('./Router/router')
// import dotenv module
require('dotenv').config()
// import express module
const express = require('express')
require('./DB/connection')
// import cors module
const cors = require("cors");
//creating server using express
const pfserver = express()
//inject cors into pfserver
pfserver.use(cors());
//use middle ware to convert json data to js object
pfserver.use(express.json())
//apply application middleware here
//pfserver.use(appMiddleware);
pfserver.use(router)
//pfserver should expose the upload folder
pfserver.use('/uploads', express.static('./uploads'))
//port provider
const PORT = 4000;
pfserver.listen(PORT, () => {
    console.log(`pfserver is running in Port ${PORT}`);
    
})
//run the server
pfserver.get('/',(req,res)=> {
    res.send("server is running on waiting for client!!!")
})
