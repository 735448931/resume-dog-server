import { IsString, IsOptional, IsEmail } from 'class-validator'

export class UpdateDto {
	@IsString()
	@IsOptional()
	nickname?: string

	@IsString()
	@IsOptional()
	avatar?: string

	@IsEmail()
	@IsOptional()
	email?: string

	@IsString()
	@IsOptional()
	phone?: string
}
