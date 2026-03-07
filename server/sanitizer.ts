import sanitizeHtml from 'sanitize-html';
import { Request, Response, NextFunction } from 'express';

function sanitizeObject(obj: any): any {
    if (typeof obj === 'string') {
        // We strip all HTML tags by default to prevent XSS. 
        // For text areas like 'message', we want pure text.
        return sanitizeHtml(obj, {
            allowedTags: [],
            allowedAttributes: {}
        });
    }
    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item));
    }
    if (obj !== null && typeof obj === 'object') {
        const sanitizedData: any = {};
        for (const [key, value] of Object.entries(obj)) {
            // Do not sanitize passwords explicitly, though this middleware
            // is intended for public facing submission forms.
            if (key === 'password' || key === 'token') {
                sanitizedData[key] = value;
            } else {
                sanitizedData[key] = sanitizeObject(value);
            }
        }
        return sanitizedData;
    }
    return obj;
}

export const xssSanitizer = (req: Request, res: Response, next: NextFunction) => {
    if (req.body) {
        req.body = sanitizeObject(req.body);
    }
    // Also sanitize query params if they exist
    if (req.query) {
        req.query = sanitizeObject(req.query) as any;
    }
    next();
};
