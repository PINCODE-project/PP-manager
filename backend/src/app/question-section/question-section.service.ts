import {Injectable} from '@nestjs/common';
import {CreateQuestionSectionDto} from './dto/create-question-section.dto';
import {UpdateQuestionSectionDto} from './dto/update-question-section.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Question} from "../question/entities/question.entity";
import {Repository} from "typeorm";
import {QuestionSection} from "./entities/question-section.entity";

@Injectable()
export class QuestionSectionService {
    constructor(
        @InjectRepository(QuestionSection)
        private readonly questionSectionRepository: Repository<QuestionSection>,
    ) {
    }


    create(createQuestionSectionDto: CreateQuestionSectionDto) {
        return 'This action adds a new questionSection';
    }

    async findAll() {
        return await this.questionSectionRepository.find()
    }

    findOne(id: number) {
        return `This action returns a #${id} questionSection`;
    }

    update(id: number, updateQuestionSectionDto: UpdateQuestionSectionDto) {
        return `This action updates a #${id} questionSection`;
    }

    remove(id: number) {
        return `This action removes a #${id} questionSection`;
    }
}
