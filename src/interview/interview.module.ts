import { Module } from '@nestjs/common'
import { InterviewService } from './services/interview.service'
import { InterviewController } from './interview.controller'
import { ConfigModule } from '@nestjs/config'

@Module({
	imports: [ConfigModule],
	controllers: [InterviewController],
	providers: [InterviewService]
})
export class InterviewModule {}
