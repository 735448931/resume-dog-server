import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { UserModule } from './user/user.module'
import { InterviewModule } from './interview/interview.module'
import { JwtModule } from '@nestjs/jwt'

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		// mongoose
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				uri: configService.get<string>('MONGODB_URI')
			}),
			inject: [ConfigService]
		}),

		// jwt
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => {
				return {
					secret: configService.get<string>('JWT_SECRET'),
					signOptions: {
						expiresIn: 60 * 60 * 24
					}
				}
			},
			inject: [ConfigService],
			global: true
		}),
		UserModule,
		InterviewModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
