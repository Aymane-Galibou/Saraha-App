
export const asyncHandler=(fn)=>{
  return (req,res,next)=>{
   Promise.resolve(fn(req,res,next)).catch(next)}
  }



export const errorHandler=(err,req,res,next)=>{

      res.status(err["cause"] || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.MODE_WORK === "development" ? err.stack : undefined,
  });

}