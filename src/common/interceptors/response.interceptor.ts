import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Response } from 'express'
import { map, Observable } from 'rxjs'

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const response = context.switchToHttp().getResponse<Response>()

		return next.handle().pipe(
			map((data) => {
				// 已经是标准响应格式，直接透传，避免双重包装
				if (data && typeof data === 'object' && 'code' in data && 'message' in data && 'data' in data) {
					return data
				}
				return {
					code: response.statusCode,
					message: 'success',
					data
				}
			})
		)
	}
}
