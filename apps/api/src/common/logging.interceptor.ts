import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;
    const requestId = `req-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    
    // Agregar requestId al request para uso posterior
    request.requestId = requestId;

    const startTime = Date.now();

    this.logger.log(JSON.stringify({
      level: 'info',
      msg: 'Request received',
      requestId,
      method,
      url,
      body: method === 'POST' || method === 'PUT' ? body : undefined,
    }));

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;
          this.logger.log(JSON.stringify({
            level: 'info',
            msg: 'Request completed',
            requestId,
            method,
            url,
            statusCode: context.switchToHttp().getResponse().statusCode,
            durationMs: duration,
          }));
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logger.error(JSON.stringify({
            level: 'error',
            msg: 'Request failed',
            requestId,
            method,
            url,
            error: error.message,
            stack: error.stack,
            durationMs: duration,
          }));
        },
      }),
    );
  }
}

