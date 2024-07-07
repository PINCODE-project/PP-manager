import {IsString, IsUUID} from "class-validator";

export class CreateQuestionDto {
    @IsString()
    question: string

    @IsString()
    answer: string

    @IsUUID()
    questionSectionId: string
}
