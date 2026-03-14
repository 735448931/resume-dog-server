import { Body, Controller, Post, Request, Res } from '@nestjs/common'
import { InterviewService } from './services/interview.service'
import { ResumeQuizDto } from './dto/resume-quiz.dto'
import type { Response } from 'express'

@Controller('interview')
export class InterviewController {
	constructor(private readonly interviewService: InterviewService) {}

	// 接口 1: 简历押题
	// @Post('/resume/quiz/stream')
	// async resumeQuizStream(
	// 	@Body() dto: ResumeQuizDto,
	// 	@Request() req: any,
	// 	@Res() res: Response
	// ) {
	// 	const userId = req.user.userId
	// 	res.setHeader('Content-Type', 'text/event-stream')
	// 	res.setHeader('Cache-Control', 'no-cache')
	// 	res.setHeader('Connection', 'keep-alive')
	// 	res.setHeader('X-Accel-Buffering', 'no') // 禁用 Nginx 缓冲

	// 	const subscription = this.interviewService
	// 		.generateResumeQuizWithProgress(userId, dto)
	// 		.subscribe({
	// 			next: (event) => {
	// 				res.write(`data: ${JSON.stringify(event)}\n\n`)
	// 			},
	// 			error: (error) => {
	// 				res.write(
	// 					`data: ${JSON.stringify({
	// 						type: 'error',
	// 						error: error.message
	// 					})}\n\n`
	// 				)
	// 				res.end()
	// 			},
	// 			complete: () => {
	// 				res.end()
	// 			}
	// 		})

	// 	// 客户端断开连接时取消订阅
	// 	req.on('close', () => {
	// 		subscription.unsubscribe()
	// 	})
	// }
	// 接口 2: 开始模拟面试
	// 接口 3: 回答面试问题
	// 接口 4: 结束面试
}
