// what ever req it should pass through middleware
//sample application middleware created 
const appMiddleware = (res, req, next) => {
    console.log("inside app middle ware !!!");
    next();
}
module.exports = appMiddleware;