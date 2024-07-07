import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateStudentProjectResultDto} from './dto/create-student-project-result.dto';
import {UpdateStudentProjectResultDto} from './dto/update-student-project-result.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Student} from "../student/entities/student.entity";
import {Repository} from "typeorm";
import {StudentProjectResult} from "./entities/student-project-result.entity";
import {CreateStudentDto} from "../student/dto/create-student.dto";
import {UpdateStudentDto} from "../student/dto/update-student.dto";

@Injectable()
export class StudentProjectResultService {
    constructor(
        @InjectRepository(StudentProjectResult)
        private readonly studentProjectResultRepository: Repository<StudentProjectResult>,
    ) {
    }

    async isCreateByFullnameAndProject(studentFullname: string, projectId: string) {
        const studentProjectResult = await this.studentProjectResultRepository.findOneBy({project: {id: projectId}, student: {fullname: studentFullname}})
        console.log(studentProjectResult, !!studentProjectResult)
        return !!studentProjectResult;
    }

    async isCreateByIds(studentId: number, projectId: string) {
        const studentProjectResult = await this.studentProjectResultRepository.findOneBy({project: {id: projectId}, student: {id: studentId}})
        return !!studentProjectResult;
    }

    async create(createStudentProjectResultDto: CreateStudentProjectResultDto) {
        if (await this.isCreateByIds(createStudentProjectResultDto.student_id, createStudentProjectResultDto.project_id))
            throw new BadRequestException("The student project result already exist!");

        const newStudentProjectResult = {
            student: {id: createStudentProjectResultDto.student_id},
            project: {id: createStudentProjectResultDto.project_id},
            totalScore: createStudentProjectResultDto.totalScore,
            expertsScore: createStudentProjectResultDto.expertsScore,
            finalScore: createStudentProjectResultDto.finalScore,
            retakedScore: createStudentProjectResultDto.retakedScore,
            brsScore: createStudentProjectResultDto.brsScore,
            coefficient: createStudentProjectResultDto.coefficient,
        };

        const res = await this.studentProjectResultRepository.save(newStudentProjectResult);
        return {studentProjectResultId: res.id}
    }

    findAll() {
        return `This action returns all studentProjectResults`;
    }

    findOne(id: number) {
        return `This action returns a #${id} studentProjectResult`;
    }

    async update(studentId: number, projectId: string, updateStudentProjectResultDto: UpdateStudentProjectResultDto) {
        const studentProjectResult = await this.studentProjectResultRepository.findOneBy({student: {id: studentId}, project: {id: projectId}})

        delete updateStudentProjectResultDto["student_id"];
        delete updateStudentProjectResultDto["project_id"];

        if (!studentProjectResult)
            throw new NotFoundException("Student project result not found!")

        if (Object.keys(updateStudentProjectResultDto).length > 0)
            await this.studentProjectResultRepository.update(studentProjectResult.id, updateStudentProjectResultDto);

        return this.studentProjectResultRepository.findOne({
            where: {student: {id: studentId}, project: {id: projectId}}
        })
    }

    remove(id: number) {
        return `This action removes a #${id} studentProjectResult`;
    }
}
