import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
    isOperational = true;

    constructor(public message: string, public statusCode: number) {
        super(message);

        Error.captureStackTrace(this, this.constructor);
    }
}

export const handleNotFound = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    next(new AppError(`Url: ${req.originalUrl} is not found!`, 404));
};

export const methodNotAllowed = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    next(new AppError(`Method ${req.method} is not allowed on this url`, 405));
};

export const handleError = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    console.log(err);

    err.statusCode = err.statusCode || 500;

    if(err.isOperational && err.statusCode === 422) {
        const errors = err.message.split('|');

        res.status(err.statusCode).json({message: errors});
        return;
    }

    err.isOperational
        ? res.status(err.statusCode).json({
            message: err.message,
        })
        : res.status(500).json({ message: 'Sorry, try again later.' });
};