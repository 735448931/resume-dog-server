import { IsEnum, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

/**
 * 面试类型枚举
 */
export enum MockInterviewType {
  SPECIAL = 'special', // 专项面试（约1小时）
  COMPREHENSIVE = 'behavior', // 行测 + HR 面试（约45分钟）
}

export class StartMockInterviewDto {

  @IsEnum(MockInterviewType, { message: '面试类型无效' })
  @IsNotEmpty({ message: '面试类型不能为空' })
  interviewType: MockInterviewType;


  @IsString()
  @IsOptional()
  @MaxLength(50, { message: '候选人姓名不能超过50个字符' })
  candidateName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100, { message: '公司名称不能超过100个字符' })
  company?: string;


  @IsString()
  @IsOptional()
  @MaxLength(100, { message: '岗位名称不能超过100个字符' })
  positionName?: string;


  @Min(0, { message: '最低薪资不能小于0' })
  @Max(9999, { message: '最低薪资不能超过9999K' })
  @IsOptional()
  minSalary?: number | string;


  @Min(0, { message: '最高薪资不能小于0' })
  @Max(9999, { message: '最高薪资不能超过9999K' })
  @IsOptional()
  maxSalary?: number | string;


  @IsString()
  @IsOptional()
  @MaxLength(5000, { message: '职位描述不能超过5000个字符' })
  jd?: string;

  @IsString()
  @IsOptional()
  resumeId?: string;


  @IsString()
  @IsOptional()
  @MaxLength(10000, { message: '简历内容不能超过10000个字符' })
  resumeContent?: string;
}


/**
 * 模拟面试事件类型
 */
export enum MockInterviewEventType {
  START = 'start', // 面试开始
  QUESTION = 'question', // 面试官提问
  WAITING = 'waiting', // 等待候选人回答
  REFERENCE_ANSWER = 'reference_answer', // 参考答案（标准答案）
  THINKING = 'thinking', // AI正在思考
  END = 'end', // 面试结束
  ERROR = 'error', // 发生错误
}



/**
 * 模拟面试 SSE 事件 DTO
 */
export class MockInterviewEventDto {

  type: MockInterviewEventType;


  sessionId?: string;


  interviewerName?: string;


  content?: string;


  questionNumber?: number;


  totalQuestions?: number;

  elapsedMinutes?: number;


  error?: string;


  resultId?: string;


  isStreaming?: boolean;

  metadata?: Record<string, any>;
}
