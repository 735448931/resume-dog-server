import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'

import { RegisterDto } from './dto/register.dto'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from './schemas/user.schema'
import { Model } from 'mongoose'
import { LoginDto } from './dto/login.dto'
import { JwtService } from '@nestjs/jwt'
import { UpdateDto } from './dto/update.dto'

@Injectable()
export class UserService {
	constructor() {}

	@InjectModel(User.name)
	private userModel: Model<UserDocument>

	private jwtService: JwtService

	async register(registerDto: RegisterDto) {
		const { username, email, password } = registerDto

		// 检查用户名是否已存在
		const existingUser = await this.userModel.findOne({
			$or: [{ username }, { email }]
		})
		if (existingUser) {
			throw new BadRequestException('用户名或邮箱已存在')
		}

		const newUser = new this.userModel({
			username,
			email,
			password
		})

		await newUser.save()
		const result = newUser.toObject()
		delete result.password
		return result
	}

	async login(loginDto: LoginDto) {
		const { email, password } = loginDto

		const user = await this.userModel.findOne({ email })
		if (!user) {
			throw new UnauthorizedException('邮箱或密码不正确')
		}

		if (password !== user.password) {
			throw new UnauthorizedException('邮箱或密码不正确')
		}

		const token = this.jwtService.sign({
			userId: user._id.toString(),
			username: user.username,
			email: user.email
		})

		const userInfo = user.toObject()
		delete userInfo.password
		return {
			token,
			user: userInfo
		}
	}

	async getUserInfo(userId: string) {
		const user = await this.userModel.findById(userId).lean()
		if (!user) {
			throw new NotFoundException('用户不存在')
		}
		// 不返回密码
		delete user.password

		return user
	}

	  async updateUser(userId: string, updateDto: UpdateDto) {
    // 如果更新邮箱，检查邮箱是否已被使用
    if (updateDto.email) {
      const existingUser = await this.userModel.findOne({
        email: updateDto.email,
        _id: { $ne: userId }, // 排除当前用户
      });

      if (existingUser) {
        throw new BadRequestException('邮箱已被使用');
      }
    }

    const user = await this.userModel.findByIdAndUpdate(userId, updateDto, {
      new: true,
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    delete user.password;
    return user;
  }


}
