import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpCode } from '@nestjs/common'
import { UserService } from './user.service'
import { RegisterDto } from './dto/register.dto'
import { ResponseUtil } from 'src/common/utils/respomse.util'
import { Public } from 'src/common/auth/public.decorator'
import { JwtAuthGuard } from 'src/common/auth/jwt-auth.guard'
import { LoginDto } from './dto/login.dto'
import { UpdateDto } from './dto/update.dto'

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('register')
	@Public()
	async register(@Body() registerDto: RegisterDto) {
		const result = await this.userService.register(registerDto)
		return ResponseUtil.success(result)
	}

	@Post('login')
	@Public()
	@HttpCode(200)
	async login(@Body() loginDto: LoginDto) {
		const result = await this.userService.login(loginDto)
		return ResponseUtil.success(result, '登录成功')
	}

	@Get('info')
	async getUserInfo(@Request() req: any) {
		const { userId } = req.user
		const userInfo = await this.userService.getUserInfo(userId)
		return ResponseUtil.success(userInfo)
	}

	@Post('profile')
	async updateUserProfile(@Request() req: any, @Body() updateDto: UpdateDto) {
		const { userId } = req.user
		const user = await this.userService.updateUser(userId, updateDto)
		return ResponseUtil.success(user, '更新成功')
	}
}
