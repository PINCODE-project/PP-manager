import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateQuestionDto} from './dto/create-question.dto';
import {UpdateQuestionDto} from './dto/update-question.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Question} from "./entities/question.entity";

@Injectable()
export class QuestionService {
    constructor(
        @InjectRepository(Question)
        private readonly questionRepository: Repository<Question>,
    ) {
    }

    async create(createQuestionDto: CreateQuestionDto) {
        const question = await this.questionRepository.findOneBy({question: createQuestionDto.question})

        if (!!question)
            throw new BadRequestException("The question already exist!");

        const newQuestion = {
            question: createQuestionDto.question,
            answer: createQuestionDto.answer,
            questionSection: {id: createQuestionDto.questionSectionId},
        };

        const res = await this.questionRepository.save(newQuestion);
        return {questionID: res.id}
    }

    async findAll() {
        return await this.questionRepository.find({
            relations: {
                questionSection: true
            }
        })
    }

    findOne(id: number) {
        return `This action returns a #${id} question`;
    }

    update(id: number, updateQuestionDto: UpdateQuestionDto) {
        return `This action updates a #${id} question`;
    }

    async remove(id: string) {
        const question = await this.questionRepository.findOneBy({id})

        if (!question)
            throw new BadRequestException("The question doesn't exist!");

        await this.questionRepository.delete(id);
    }
}
