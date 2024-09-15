import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateStudentDto } from "./dto/create-student.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Student } from "./entities/student.entity";
import { FindOneStudentDto } from "./dto/find-one-student.dto";
import { FindAllStudentsDto } from "./dto/find-all-students.dto";
import { Project } from "../project/entities/project.entity";

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student)
        private readonly studentRepository: Repository<Student>,
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
    ) {}

    async isCreate(id: number) {
        const student = await this.studentRepository.findOneBy({ id });
        return !!student;
    }

    async create(createStudentDto: CreateStudentDto) {
        if (await this.isCreate(createStudentDto.id)) throw new BadRequestException("The student already exist!");

        const newStudent = {
            id: createStudentDto.id,
            fullname: createStudentDto.fullname,
            email: createStudentDto.email,
            phone: createStudentDto.phone,
            groupName: createStudentDto.groupName,
        };

        const res = await this.studentRepository.save(newStudent);
        return { passportID: res.id };
    }

    async findAll(findAllStudentsDto: FindAllStudentsDto) {
        const students = await this.studentRepository.find({
            where: { projects: { period: { id: findAllStudentsDto.period_id } } },
            select: {
                projects: {
                    id: true,
                    name: true,
                    curator: true,
                    isHaveReport: true,
                    isHavePresentation: true,
                    comissionScore: true,
                    status: true,
                },
            },
            relations: {
                // projects_result: true,
                projects: {
                    period: true,
                    passport: {
                        request: {
                            period_id: true,
                        },
                    },
                    students_result: true,
                },
            },
        });

        return students;
    }

    async findCountForStatistic(findAllStudentsDto: FindAllStudentsDto) {
        const studentsCount = await this.studentRepository.count({
            where: { projects: { period: { id: findAllStudentsDto.period_id } } },
            relations: {
                projects: {
                    period: true,
                },
            },
        });

        return studentsCount;
    }

    async findOne(findOneStudentDto: FindOneStudentDto) {
        if (!(await this.isCreate(findOneStudentDto.id))) throw new NotFoundException("Student not found!");

        const student = await this.studentRepository.findOne({
            where: {
                id: findOneStudentDto.id,
                projects: { students_result: { student: { id: findOneStudentDto.id } } },
            },
            select: {
                projects: {
                    id: true,
                    name: true,
                    curator: true,
                    isHaveReport: true,
                    isHavePresentation: true,
                    comissionScore: true,
                    status: true,
                    // documents: true,
                    students_result: true,
                },
            },
            relations: {
                projects: {
                    students_result: true,
                    period: true,
                    passport: {
                        request: {
                            period_id: true,
                            tags: true,
                            customer_user: {
                                customer_company: true,
                            },
                        },
                    },
                },
            },
        });

        return student;
    }

    async update(id: number, updateStudentDto: UpdateStudentDto) {
        const student = await this.studentRepository.findOneBy({ id });

        if (!student) throw new NotFoundException("Student not found!");

        if (Object.keys(updateStudentDto).length > 0)
            // @ts-ignore
            await this.studentRepository.update(student.id, updateStudentDto);

        return this.studentRepository.findOne({
            where: { id },
        });
    }

    remove(id: number) {
        return `This action removes a #${id} student`;
    }

    async removeFromProject(studentId: number, periodId: number) {
        const student = await this.studentRepository.findOne({
            where: { id: studentId },
            relations: {
                projects: {
                    period: true,
                },
                projects_result: true,
            },
        });

        if (!student) throw new NotFoundException("Student not found!");

        const project = await this.projectRepository.findOne({
            where: {
                students: { id: studentId },
                period: { id: periodId },
            },
        });

        if (!project) throw new NotFoundException("The student has no projects this semester!");

        const projects = student.projects.filter((project) => project.period.id !== periodId);
        const projectsId = projects.map((project) => project.id);

        await this.studentRepository.save({
            ...student,
            projects,
            projects_result: student.projects_result.filter((result) => projectsId.includes(result.projectId)),
        });
    }
}
