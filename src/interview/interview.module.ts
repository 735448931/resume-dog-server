import { Module } from '@nestjs/common'
import { InterviewService } from './services/interview.service'
import { InterviewAIService } from './services/interview-ai.service'
import { DocumentParserService } from './services/document-parser.service'
import { InterviewController } from './interview.controller'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { ConsumptionRecord, ConsumptionRecordSchema } from './schemas/consumption-record.schema'
import { ResumeQuizResult, ResumeQuizResultSchema } from './schemas/interview-quiz-result.schema'
import { User, UserSchema } from 'src/user/schemas/user.schema'
import { AIModule } from 'src/ai/ai.module'

@Module({
	imports: [
		ConfigModule,
		AIModule,
		MongooseModule.forFeature([
			{ name: ConsumptionRecord.name, schema: ConsumptionRecordSchema },
			{ name: ResumeQuizResult.name, schema: ResumeQuizResultSchema },
			{ name: User.name, schema: UserSchema }
		])
	],
	controllers: [InterviewController],
	providers: [InterviewService, InterviewAIService, DocumentParserService]
})
export class InterviewModule {}
