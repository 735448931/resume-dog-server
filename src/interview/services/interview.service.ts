import { BadRequestException, Injectable } from '@nestjs/common'
import { ResumeQuizDto } from '../dto/resume-quiz.dto'
import { Subject } from 'rxjs'
import { v4 as uuidv4 } from 'uuid'
import { ConsumptionRecord, ConsumptionRecordDocument, ConsumptionType } from '../schemas/consumption-record.schema'
import { ConsumptionStatus } from '../schemas/consumption-record.schema'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from '../../user/schemas/user.schema'
import { Model, Types } from 'mongoose'

export interface ProgressEvent {
	type: 'progress' | 'complete' | 'error' | 'timeout'
	step?: number
	label?: string
	progress: number // 0-100
	message?: string
	data?: any
	error?: string
	stage?: 'prepare' | 'generating' | 'saving' | 'done' // 当前阶段
}

import { ResumeQuizResult, ResumeQuizResultDocument } from '../schemas/interview-quiz-result.schema'
@Injectable()
export class InterviewService {
	constructor(
		@InjectModel(ConsumptionRecord.name)
		private consumptionRecordModel: Model<ConsumptionRecordDocument>,
		@InjectModel(ResumeQuizResult.name)
		private resumeQuizResultModel: Model<ResumeQuizResultDocument>,
		@InjectModel(User.name)
		private userModel: Model<UserDocument>
	) {}

	// 生成简历押题
	generateResumeQuizWithProgress(userId: string, dto: ResumeQuizDto): Subject<ProgressEvent> {
		const subject = new Subject<ProgressEvent>()

		this.executeResumeQuiz(userId, dto, subject).catch((error) => subject.error(error))

		return subject
	}

	async executeResumeQuiz(userId: string, dto: ResumeQuizDto, progressSubject: Subject<ProgressEvent>) {
		let consumptionRecord: any = null
		const recordId = uuidv4()
		const resultId = uuidv4()

		try {
			// 1.已经存在了
			if (dto.requestId) {
				const existingRecord = await this.consumptionRecordModel.findOne({
					userId,
					'metadata.requestId': dto.requestId,
					status: {
						$in: [ConsumptionStatus.SUCCESS, ConsumptionStatus.PENDING]
					}
				})

				if (existingRecord) {
					if (existingRecord.status === ConsumptionStatus.SUCCESS) {
						const existingResult = await this.resumeQuizResultModel.findOne({
							resultId: existingRecord.resultId
						})
						if (!existingResult) {
							throw new BadRequestException('结果不存在')
						}

						return {
							resultId: existingResult.resultId,
							questions: existingResult.questions,
							summary: existingResult.summary,
							remainingCount: await this.getRemainingCount(userId, 'resume'),
							consumptionRecordId: existingRecord.recordId,
							// ⭐ 重要：标记这是从缓存返回的结果
							isFromCache: true
						}
					}

					if (existingRecord.status === ConsumptionStatus.PENDING) {
						// 同一个请求还在处理中，告诉用户稍后查询
						throw new BadRequestException('请求正在处理中，请稍后查询结果')
					}
				}
			}

			// 2.检查并扣除次数
			const user = await this.userModel.findOneAndUpdate(
				{
					_id: userId,
					resumeRemainingCount: { $gt: 0 } // 条件：必须余额 > 0
				},
				{
					$inc: { resumeRemainingCount: -1 } // 原子操作：余额 - 1
				},
				{ new: false } // 返回更新前的文档，用于日志记录
			)
			// 检查扣费是否成功
			if (!user) {
				throw new BadRequestException('简历押题次数不足，请前往充值页面购买')
			}

			consumptionRecord = await this.consumptionRecordModel.create({
				recordId, // 消费记录唯一ID
				user: new Types.ObjectId(userId),
				userId,
				type: ConsumptionType.RESUME_QUIZ, // 消费类型
				status: ConsumptionStatus.PENDING, // ⭐ 关键：标记为处理中
				consumedCount: 1, // 消费次数
				description: `简历押题 - ${dto?.company} ${dto.positionName}`,
				// 记录输入参数（用于调试和重现问题）
				inputData: {
					company: dto?.company || '',
					positionName: dto.positionName,
					minSalary: dto.minSalary,
					maxSalary: dto.maxSalary,
					jd: dto.jd,
					resumeId: dto.resumeId
				},
				resultId, // 结果ID（稍后会生成）
				// 元数据（包含幂等性检查的 requestId）
				metadata: {
					requestId: dto.requestId, // ← 用于幂等性检查
					promptVersion: dto.promptVersion
				},

				startedAt: new Date() // 记录开始时间
			})

			this.emitProgress(progressSubject, 0, '📄 正在读取简历文档...', 'prepare')

			const resumeContent = await this.extractResumeContent(userId, dto)

			this.emitProgress(progressSubject, 5, '✅ 简历解析完成', 'prepare')

			this.emitProgress(progressSubject, 10, '🚀 准备就绪，即将开始 AI 生成...')
		} catch (error) {}
	}

	async getRemainingCount(userId: string, type: string) {
		const user = await this.userModel.findById(userId)
		if (!user) return 0

		switch (type) {
			case 'resume':
				return user.resumeRemainingCount
			case 'special':
				return user.specialRemainingCount
			default:
				return 0
		}
	}

	private emitProgress(
		subject: Subject<ProgressEvent> | undefined,
		progress: number,
		label: string,
		stage?: 'prepare' | 'generating' | 'saving' | 'done'
	): void {
		if (subject && !subject.closed) {
			subject.next({
				type: 'progress',
				progress: Math.min(Math.max(progress, 0), 100), // 确保在 0-100 范围内
				label,
				message: label,
				stage
			})
		}
	}

	// 提取简历内容
	private async extractResumeContent(userId: string, dto: ResumeQuizDto) {}
}
