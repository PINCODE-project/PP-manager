import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Question} from "../../question/entities/question.entity";
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class QuestionSection {
    @ApiProperty()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string

    @OneToMany(() => Question, (question) => question.questionSection, {nullable: true})
    questions: Question[];
}
