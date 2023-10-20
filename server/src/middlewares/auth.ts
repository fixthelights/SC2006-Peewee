import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { AppError } from '../config/AppError';


// To decode the jwt token, we need a secret key
export const SECRET_KEY: Secret = process.env.JWT_SECRET || 'default-secret-key';


interface JwtPayload {
    userId: string;
    email: string;
    [key: string]: any;
}

export interface CustomRequest extends Request {
    userId: string;
    email: string;
    token: string | JwtPayload;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get token from header - Need to create header when requesting
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new AppError ({
                type: "UnauthorisedError",
                statusCode: 401,
                description: 'Unauthorized user',
            })
        }

        const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
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

// Sign JWT token with user information
export function signToken(userId: string, email: string, isAdmin?: boolean): string {
    // Sign the token with the payload and secret key
    const token = jwt.sign({ userId: userId, email: email }, SECRET_KEY, {
        expiresIn: '2 days',
      });

    return token;
}

export const authJwt = (token : string) => {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return true;
    } catch (error : any) {
        return false;
    }
}
