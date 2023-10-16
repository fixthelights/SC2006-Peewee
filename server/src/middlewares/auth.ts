import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { AppError } from '../config/AppError';


// To decode the jwt token, we need a secret key
export const SECRET_KEY: Secret = 'your-secret-key-here';

interface JwtPayload {
    [key: string]: any;
}

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header("Authorisation")?.replace("Bearer ", "");
        
        if (!token) {
            throw new AppError ({
                type: "UnauthorisedError",
                statusCode: 401,
                description: 'Unauthorized user',
            })
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        (req as CustomRequest).token = decoded;

        next();
    } catch (error : any) {
        if (error instanceof AppError) throw error;
        throw new AppError({
            type: "AuthError",
            statusCode: 500,
            description: 'Error authenticating user.',
            error: error
        });
    }

}
