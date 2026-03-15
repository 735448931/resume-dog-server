import { Module } from '@nestjs/common'
import { InterviewService } from './services/interview.service'
import { InterviewController } from './interview.controller'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { ConsumptionRecord } from './schemas/consumption-record.schema'
import { ResumeQuizResult, ResumeQuizResultSchema } from './schemas/interview-quiz-result.schema'
import { User, UserSchema } from 'src/user/schemas/user.schema'

@Module({
	imports: [
		ConfigModule,
		MongooseModule.forFeature([
			{ name: ConsumptionRecord.name, schema: ConsumptionRecord },
			{ name: ResumeQuizResult.name, schema: ResumeQuizResultSchema },
			{ name: User.name, schema: UserSchema }
		])
	],
	controllers: [InterviewController],
	providers: [InterviewService]
})
export class InterviewModule {}
