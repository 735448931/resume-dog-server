import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { UserSchema, User } from './schemas/user.schema'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from 'src/common/auth/jwt.strategy'

@Module({
	imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), PassportModule],
	controllers: [UserController],
	providers: [UserService, JwtStrategy],
	exports: [UserService]
})
export class UserModule {}
