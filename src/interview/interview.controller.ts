import { Body, Controller, Post, Request, Res } from '@nestjs/common'
import { InterviewService } from './services/interview.service'
import { ResumeQuizDto } from './dto/resume-quiz.dto'
import type { Response } from 'express'
import { StartMockInterviewDto } from './dto/mock-interview.dto'

@Controller('interview')
export class InterviewController {
	constructor(private readonly interviewService: InterviewService) { }

	// 接口 1: 简历押题
	@Post('/resume/quiz/stream')
	async resumeQuizStream(@Body() dto: ResumeQuizDto, @Request() req: any, @Res() res: Response) {
		const userId = req?.user?.userId || '69baa1cd8fd40c6d3a65340a'
		res.setHeader('Content-Type', 'text/event-stream')
		res.setHeader('Cache-Control', 'no-cache')
		res.setHeader('Connection', 'keep-alive')
		res.setHeader('X-Accel-Buffering', 'no') // 禁用 Nginx 缓冲

		const subscription = this.interviewService.generateResumeQuizWithProgress(userId, dto).subscribe({
			next: (event) => {
				res.write(`data: ${JSON.stringify(event)}\n\n`)
			},
			error: (error) => {
				res.write(
					`data: ${JSON.stringify({
						type: 'error',
						error: error.message
					})}\n\n`
				)
				res.end()
			},
			complete: () => {
				res.end()
			}
		})

		// 客户端断开连接时取消订阅
		req.on('close', () => {
			subscription.unsubscribe()
		})
	}
	// 接口 2: 开始模拟面试
	@Post('mock/start')
	async startMockInterview(@Body() dto: StartMockInterviewDto,
		@Request() req: any,
		@Res() res: Response) {
		const userId = req.user.userId;
		// 设置 SSE 响应头
		res.status(200);
		res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
		res.setHeader('Cache-Control', 'no-cache, no-transform');
		res.setHeader('Connection', 'keep-alive');
		res.setHeader('X-Accel-Buffering', 'no'); // 禁用 Nginx 缓冲
		res.setHeader('Access-Control-Allow-Origin', '*'); // 如果需要CORS


		// 发送初始注释，保持连接活跃
		res.write(': connected\n\n');
		// flush 数据（如果可用）
		if (typeof (res as any).flush === 'function') {
			(res as any).flush();
		}

		// 订阅进度事件
		const subscription = this.interviewService.startMockInterviewWithStream(userId, dto)
			.subscribe({
				next: (event) => {
					res.write(`data: ${JSON.stringify(event)}\n\n`);
					// flush 数据（如果可用）
					if (typeof (res as any).flush === 'function') {
						(res as any).flush();
					}
				},
				error: (error) => {
					res.write(
						`data: ${JSON.stringify({
							type: 'error',
							error: error.message,
						})}\n\n`,
					);
					if (typeof (res as any).flush === 'function') {
						(res as any).flush();
					}
					res.end();
				},
				complete: () => {
					res.end();
				},
			})

		// 客户端断开连接时取消订阅
		req.on('close', () => {
			subscription.unsubscribe();
		});



	}
	// 接口 3: 回答面试问题
	// 接口 4: 结束面试
}
