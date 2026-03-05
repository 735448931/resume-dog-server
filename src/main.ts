import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as dotenv from 'dotenv'
import { AllExceptionsFilter } from './common/filters/http-exception.filter'
import { ValidationPipe } from '@nestjs/common'
import { FormatResponseInterceptor } from './common/interceptors/response.interceptor'

dotenv.config()

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	// 允许跨域
	app.enableCors()

	// 设置全局路由前缀
	app.setGlobalPrefix('api')

	// 设置全局异常过滤器
	app.useGlobalFilters(new AllExceptionsFilter())

	// 设置响应拦截器 统一返回格式
	app.useGlobalInterceptors(new FormatResponseInterceptor())

	// 全局验证管道
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true, // 自动移除 DTO 中没有声明的字段
			transform: true // 自动类型转换
		})
	)
	await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
