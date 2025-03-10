export enum ErrorType {
    ERROR = 'Error',
    WARNING = 'Warning'
  }
  
  export class ErrorDetail {
    type: ErrorType;
    message: string;
  
    constructor(type: ErrorType, message: string) {
      this.type = type;
      this.message = message || '';
    }
  }
  