const asyncHandler = (requestHandler)=>{
    return (req,res, next) =>{
        Promise.resolve(requestHandler(req, res, next))
        .catch((err) => next(err)) // Pass the error to the next middleware (error handling middleware)
    }
}




/* this can be done using try catch block in every controller but this is a better way to handle async errors in express */

/* here is the code for try catch block

 const asyncHandler = (requestHandler)=>{
    return async (req,res, next) =>{
        try {
            await requestHandler(req, res, next);
        } catch (error) {
         res.status(error.code|| 500).json({
            success: false,
            message: error.message || "Internal Server Error"
         })
           
        
    }
}

/* this can be done using try catch block in every controller but this is a better way to handle async errors in express */

/* here is the code for try catch block 

*/
export default asyncHandler;









