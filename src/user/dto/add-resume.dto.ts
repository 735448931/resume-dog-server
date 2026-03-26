import { IsString } from 'class-validator'

export class AddResumeDto {
	@IsString()
	name: string

	@IsString()
	url: string
}
