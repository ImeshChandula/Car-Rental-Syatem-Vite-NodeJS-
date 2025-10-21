import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

export interface Response<T> {
    success: boolean;
    statusCode: number;
    message: string;
    count: number;
    data: T;
    timestamp: string
}

export class TransformInterception<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        return next.handle().pipe(
            map((data) => ({
                success: true,
                statusCode: context.switchToHttp().getResponse().statusCode,
                message: data?.message || 'Request successful',
                count: Array.isArray(data) ? data.length : 0,
                data: data?.message ? data : data,
                timestamp: new Date().toISOString(),
            })),
        );
    }
}