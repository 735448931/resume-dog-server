import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ChatDeepSeek } from '@langchain/deepseek'

@Injectable()
export class AIModelFactory {
	private readonly logger = new Logger(AIModelFactory.name)

	constructor(private configService: ConfigService) {}

	createDefaultModel(): ChatDeepSeek {
		const apiKey = this.configService.get<string>('DEEPSEEK_API_KEY')
		if (!apiKey) {
			this.logger.warn('DEEPSEEK_API_KEY 不存在')
		}

		return new ChatDeepSeek({
			apiKey,
			model: 'deepseek-chat',
			temperature: 0.7,
			maxTokens: 4000
		})
	}

	/**
	 * 创建用于稳定输出的模型（评估场景）
	 *
	 * 有些场景需要 AI 的输出更稳定、更一致（比如评估答案、打分）。
	 * 这个方法创建一个 temperature 较低的模型。
	 */
	createStableModel(): ChatDeepSeek {
		const baseModel = this.createDefaultModel()
		return new ChatDeepSeek({
			apiKey: this.configService.get<string>('DEEPSEEK_API_KEY') || 'dummy-key',
			model: baseModel.model,
			temperature: 0.3, // 更低的 temperature，输出更稳定
			maxTokens: 4000
		})
	}

	/**
	 * 创建用于创意输出的模型（生成场景）
	 *
	 * 有些场景需要 AI 的输出更多样化、更有创意（比如生成题目、生成文案）。
	 * 这个方法创建一个 temperature 较高的模型。
	 */
	createCreativeModel(): ChatDeepSeek {
		const baseModel = this.createDefaultModel()
		return new ChatDeepSeek({
			apiKey: this.configService.get<string>('DEEPSEEK_API_KEY') || 'dummy-key',
			model: baseModel.model,
			temperature: 0.8, // 较高的 temperature，输出更多样化
			maxTokens: 4000
		})
	}
}
