import {Module} from '@nestjs/common';
import {QuestionSectionService} from './question-section.service';
import {QuestionSectionController} from './question-section.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {QuestionSection} from "./entities/question-section.entity";

@Module({
  imports: [TypeOrmModule.forFeature([QuestionSection])],
  controllers: [QuestionSectionController],
  providers: [QuestionSectionService],
})
export class QuestionSectionModule {}
