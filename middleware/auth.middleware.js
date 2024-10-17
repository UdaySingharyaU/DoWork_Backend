
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js';
const authMiddleware = {
    auth: async (req, res, next) => {
        if (!req.cookies.jwt && !req.headers.authorization) {
            return res.status(401).json({
                status:false,
                message:"Token Must Be Present"
            })
        }
        try {
            if (
                req.headers.authorization &&
                req.headers.authorization.startsWith('Bearer ')
            ) {
                const jwtFromBearer = req.headers?.authorization?.split(' ');

                const jwtToken = jwtFromBearer[1];

                const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);
                req.currentUser = payload;
            } else if (req.cookies.jwt) {
                const payload = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
                req.currentUser = payload;
            }
        } catch (error) {
            return next(error);
        }
        return next();
    },

    checkAdminOrNot:async(req,res,next)=>{
        try{
            const user = await User.findById({_id:req.currentUser.id});
            if(user.role!='ADMIN'){
                return res.status(400).json({
                    status:false,
                    message:"Not AUthorized ! You Are Not An Admin",
                })
            }
            return next();
        }catch(error){
            return next(error);
        }
    }
}

export default authMiddleware;