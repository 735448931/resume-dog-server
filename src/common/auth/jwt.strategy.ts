import { Injectable } from '@nestjs/common' // 引入NestJS的依赖注入装饰器
import { PassportStrategy } from '@nestjs/passport' // 引入PassportStrategy基类，用于扩展策略
import { Strategy, ExtractJwt } from 'passport-jwt' // 引入JWT策略和提取JWT的方法
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly configService: ConfigService) {
		const jwtSecret = configService.get<string>('JWT_SECRET')

		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtSecret
		})
	}

	// payload是解密后的JWT数据
	async validate(payload: any) {
		// 返回有效的用户信息（可以将其存储在请求的user对象中，后续中间件可以访问）
		return {
			userId: payload.userId, // 用户ID
			username: payload.username, // 用户名
			email: payload.email // 用户邮箱
		}
	}
}
