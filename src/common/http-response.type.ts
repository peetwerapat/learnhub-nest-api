import { HttpStatus } from '@nestjs/common';

interface MetaData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Message {
  th: string;
  en: string;
}

export interface HttpResponseType<T> {
  statusCode: HttpStatus;
  message: Message;
  data?: T;
  meta?: MetaData;
}

export class BaseHttpResponse {
  readonly message: Message;
  readonly statusCode: HttpStatus;

  constructor({ statusCode, message }: HttpResponseType<any>) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

export class HttpResponse<T> extends BaseHttpResponse {
  private readonly data: T;
  private readonly meta: MetaData;

  constructor({ statusCode, message, data, meta }: HttpResponseType<T>) {
    super({ statusCode, message });
    this.data = data ?? ({} as T);

    if (meta) {
      this.meta = meta;
    }
  }
}
