declare module 'pdf-parse' {
  export interface TextResult {
    text: string;
    pages: Array<{
      pageNumber: number;
      text: string;
    }>;
  }

  export interface LoadParameters {
    data: Buffer | Uint8Array;
    password?: string;
    stopAtErrors?: boolean;
  }

  export interface ParseParameters {
    parsePageInfo?: boolean;
  }

  export class PDFParse {
    constructor(options: LoadParameters);
    getText(params?: ParseParameters): Promise<TextResult>;
    destroy(): Promise<void>;
  }

  export class InvalidPDFException extends Error {}
  export class PasswordException extends Error {}
  export class AbortException extends Error {}
}
