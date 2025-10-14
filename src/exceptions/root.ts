//message, statusCode, errorCode

export class HttpException extends Error{
    message: string;
    errorCode: any;
    statusCode: number;
    errors: ErrorCode;

    constructor(message:string, errorCode: ErrorCode, statusCode: number, error: any){
        super(message)
        this.message = message
        this.errorCode = errorCode
        this.statusCode = statusCode
        this.errors = error
    }
}

export enum ErrorCode {
    USER_NOT_FOUND = 1001,
    USER_ALREADY_EXISTS = 1002,
    ADMIN_ALREADY_EXISTS = 1003,
    INCORRECT_PASSWORD = 1004,

    UNPROCESSABLE_ENTITY = 2001,

    INTERNAL_EXCEPTION = 3001,

    UNAUTHORIZED = 4001,

    MISSING_FIELD = 5001,

    BABY_NOT_FOUND = 6001,

    INVALID_ROLE = 7001,
    INVALID_TOKEN = 7002,
    TOKEN_EXPIRED = 7003,
    UNAUTHORIZED_ACCESS = 7004,


   
}