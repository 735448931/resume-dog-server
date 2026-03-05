import { Controller } from '@nestjs/common'
import { InterviewService } from './interview.service'

@Controller('interview')
export class InterviewController {
	constructor(private readonly interviewService: InterviewService) {}

	// 接口 1: 简历押题
	// 接口 2: 开始模拟面试
	// 接口 3: 回答面试问题
	// 接口 4: 结束面试
}
