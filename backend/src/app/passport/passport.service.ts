import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CreatePassportDto} from "./dto/create-passport.dto";
import {Passport} from "./entities/passport.entity";
import {UpdatePassportDto} from "./dto/update-passport.dto";
import {FindAllPassportsDto} from "./dto/find-all-passports.dto";
import {Course} from "../course/entities/course.entity";
import {FindOnePassportDto} from "./dto/find-one-passport.dto";

@Injectable()
export class PassportService {
    constructor(
        @InjectRepository(Passport)
        private readonly passportRepository: Repository<Passport>,
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,
    ) {
    }

    async isCreate(id: number) {
        const passport = await this.passportRepository.findOneBy({id})
        return !!passport;
    }

    async create(createPassportDto: CreatePassportDto) {
        if (await this.isCreate(createPassportDto.id))
            throw new BadRequestException("The passport " + createPassportDto.id + " already exist!");

        const newPassport = {
            id: createPassportDto.id,
            uid: createPassportDto.uid,
            short_name: createPassportDto.short_name,
            diploma_name: createPassportDto.diploma_name,
            date: createPassportDto.date,
            team_count: createPassportDto.team_count,
            students_count: createPassportDto.students_count,
            request: {id: createPassportDto.request_id},
            course: createPassportDto.course.map(course => ({id: course})),
            kind: createPassportDto.kind,
            status: createPassportDto.status
        };

        const res = await this.passportRepository.save(newPassport);
        return {passportID: res.id}
    }

    async update(id: number, updatePassportDto: UpdatePassportDto) {
        const passport = await this.passportRepository.findOneBy({id})

        if (!passport)
            throw new NotFoundException("Passport not found!")

        if ("course" in updatePassportDto) {
            const courseExists = await this.courseRepository.countBy(
                updatePassportDto.course.map(course => ({id: course}))
            )

            if (updatePassportDto.course.length !== 0 && courseExists !== updatePassportDto.course.length)
                throw new BadRequestException("The course does not exist!");

            await this.passportRepository.save({
                ...passport,
                course: updatePassportDto.course.map(course => ({id: course}))
            })
            delete updatePassportDto["course"];
        }

        if ("request_id" in updatePassportDto) {
            await this.passportRepository.update(passport.id, {
                request: {id: updatePassportDto.request_id},
            });
            delete updatePassportDto["request_id"];
        }

        if (Object.keys(updatePassportDto).length > 0)
            // @ts-ignore
            await this.passportRepository.update(passport.id, updatePassportDto);

        return this.passportRepository.findOne({
            where: {id},
        })
    }

    async findAll(findAllPassportsDto: FindAllPassportsDto) {
        const passports = await this.passportRepository.find({
            where: {request: {period_id: {id: findAllPassportsDto.period_id}}},
            // select: {
            //     id: true,
            //     passport: true,
            //     name: true,
            //     students: true,
            //     curator: true,
            //     year: true,
            //     term: true,
            //     isHaveReport: true,
            //     isHavePresentation: true,
            //     comissionScore: true,
            //     status: true,
            //     updated_at: true
            // },
            relations: {
                request: {
                    track: true,
                    tags: true,
                    period_id: true,
                    customer_user: {
                        customer_company: true
                    }
                },
                course: true,
            },
        })

        return passports
    }

    async findAllForStudents(findAllPassportsDto: FindAllPassportsDto) {
        const passports = await this.passportRepository.find({
            where: {request: {period_id: {id: findAllPassportsDto.period_id}}, is_visible: true},
            select: {
                id: true,
                short_name: true,
                diploma_name: true,
                team_count: true,
                students_count: true,
                kind: true,
                request: {
                    id: true,
                    name: true,
                    goal: true,
                    result: true,
                    description: true,
                    criteria: true,
                    max_copies: true,
                    tags: true,
                    customer_user: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        middle_name: true,
                        customer_company: {
                            id: true,
                            name: true
                        }
                    }
                },
            },
            relations: {
                request: {
                    tags: true,
                    period_id: true,
                    customer_user: {
                        customer_company: true
                    }
                },
                course: true,
            },
        })

        return passports
    }

    async findOne(findOnePassportDto: FindOnePassportDto) {
        if (!await this.isCreate(findOnePassportDto.id))
            throw new NotFoundException("Passport not found!")

        const passport = await this.passportRepository.findOne({
            where: {id: findOnePassportDto.id},
            relations: {
                request: {
                    period_id: true,
                    tags: true,
                    customer_user: {
                        customer_company: true
                    }
                },
                course: true,
            },
        })

        return passport
    }

}
