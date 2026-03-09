import {
	IsString,
	IsNotEmpty,
	MaxLength,
	IsOptional,
	MinLength,
	IsUUID,
	IsNumber,
	Min,
	Max
} from 'class-validator'

/**
 * 简历押题请求 DTO
 */
export class ResumeQuizDto {
	@IsString()
	@IsOptional()
	@MaxLength(100, { message: '公司名称不能超过100个字符' })
	company?: string

	@IsString()
	@IsNotEmpty({ message: '岗位名称不能为空' })
	@MaxLength(100, { message: '岗位名称不能超过100个字符' })
	positionName: string

	@IsNumber({}, { message: '最低薪资必须是数字' })
	@Min(0, { message: '最低薪资不能小于0' })
	@Max(9999, { message: '最低薪资不能超过9999K' })
	@IsOptional()
	minSalary?: number

	@IsNumber({}, { message: '最高薪资必须是数字' })
	@Min(0, { message: '最高薪资不能小于0' })
	@Max(9999, { message: '最高薪资不能超过9999K' })
	@IsOptional()
	maxSalary?: number

	@IsString()
	@IsNotEmpty({ message: '职位描述不能为空' })
	@MinLength(50, { message: '职位描述至少50个字符，请提供详细的JD' })
	@MaxLength(2000, { message: '职位描述不能超过2000个字符' })
	jd: string

	@IsString()
	@IsOptional()
	resumeId?: string

	@IsString()
	@IsOptional()
	@MaxLength(10000, { message: '简历内容不能超过10000个字符' })
	resumeContent?: string

	@IsUUID('4', { message: '请求ID格式不正确' })
	@IsOptional()
	requestId?: string

	@IsOptional()
	resumeURL?: string

	@IsString()
	@IsOptional()
	promptVersion?: string
}

/**
 * 简历押题响应 DTO（普通响应）
 */
export class ResumeQuizResponseDto {
	resultId: string

	questions: any[]

	summary?: string

	remainingCount: number

	consumptionRecordId: string
}

/**
 * 流式响应进度事件 DTO
 */
export class ProgressEventDto {
	type: 'progress' | 'complete' | 'error'

	step?: number

	label?: string

	progress?: number

	message?: string

	data?: ResumeQuizResponseDto

	error?: string
}
