import {ForbiddenException, Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import {ParseTeamprojectDto} from './dto/parse-teamproject.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Project} from "../project/entities/project.entity";
import {Repository} from "typeorm";
import {ProjectService} from "../project/project.service";
import {StudentService} from "../student/student.service";
import {PeriodService} from "../period/period.service";
import {ParseProjectDto} from "./dto/parse-project.dto";
import {StudentProjectResultService} from "../student-project-results/student-project-result.service";
import {SSEService} from "../sse/sse.service";
import {SSEEnum} from "../sse/interfaces/sse-service.interface";
import { v4 as uuidv4 } from 'uuid';
import {CreateReportDto} from "./dto/create-report.dto";

const XLSX = require('xlsx');
const JS_XLSX = require('js-xlsx');

@Injectable()
export class TeamprojectService {
    private readonly logger = new Logger(TeamprojectService.name);

    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        private readonly projectService: ProjectService,
        private readonly studentService: StudentService,
        private readonly studentProjectResultService: StudentProjectResultService,
        private readonly periodService: PeriodService,
        private readonly sseService: SSEService
    ) {
    }

    async parse(parseProjectsDto: ParseTeamprojectDto) {
        if (this.sseService.isEventActive(SSEEnum.PARSE_PROJECTS)) {
            throw new ForbiddenException(
                'Only one parsing process can be run!',
            );
        }


        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + parseProjectsDto.token);

        let requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        let projects = []

        let period = await this.periodService.findOne(parseProjectsDto.period_id)

        let localProjects = await fetch(
            "https://teamproject.urfu.ru/api/v2/workspaces?status=any&year=" + period.year + "&semester=" + period.term + "&size=10000&page=1", requestOptions)
            .then(response => response.json())
            .then(result => result)
            .catch(error => {
                throw new UnauthorizedException()
            })
        projects.push(...localProjects.items)

        this.sseService.emitEvent(SSEEnum.PARSE_PROJECTS, { data: `0/${projects.length}` });

        this.logger.log("Start parse projects from Teamproject {")
        this.logger.log("\tPeriod: " + period.year + " " + period.term + "(id: " + period.id + ")")
        this.logger.log("\tProjects count: " + projects.length)
        this.logger.log("}")

        let i = 0
        for (const project of projects) {
            this.logger.log(i + "/" + projects.length)
            i += 1;
            if (i % 10 === 0) {
                this.sseService.emitEvent(SSEEnum.PARSE_PROJECTS, { data: `${i}/${projects.length}` });
            }
            await this.parseProject({token: parseProjectsDto.token, id: project.id, project})
        }
        this.sseService.emitEvent(SSEEnum.PARSE_PROJECTS, { data: `${i}/${projects.length}` });
        this.logger.log("End of parse projects")
        this.sseService.clearEvent(SSEEnum.PARSE_PROJECTS);
        return;
    }


    async parseProject(parseProjectDto: ParseProjectDto) {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + parseProjectDto.token);

        let requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        this.logger.log("Parse project " + parseProjectDto.id + " {")
        let details = {}
        let results = {
            thematicGroups: undefined,
            expertsScore: undefined
        }
        let documents = {}
        let team = {}


        await fetch("https://teamproject.urfu.ru/api/v2/workspaces/" + parseProjectDto.id + "/documents/results", requestOptions)
            .then(response => response.json())
            .then(result => documents = result)
            .catch(error => console.log('error', error));

        await fetch("https://teamproject.urfu.ru/api/v2/workspaces/" + parseProjectDto.id + "/details", requestOptions)
            .then(response => response.json())
            .then(result => details = result)
            .catch(error => console.log('error', error));

        await fetch("https://teamproject.urfu.ru/api/v2/workspaces/" + parseProjectDto.id + "/result", requestOptions)
            .then(response => response.json())
            .then(result => results = result)
            .catch(error => console.log('error', error));

        await fetch("https://teamproject.urfu.ru/api/v2/workspaces/" + parseProjectDto.id + "/team", requestOptions)
            .then(response => response.json())
            .then(result => team = result)
            .catch(error => console.log('error', error));

        // @ts-ignore
        let period = await this.periodService.getId(details.period.year, details.period.term)


        let students = []
        let studentsResults = []
        // @ts-ignore
        for (const thematicGroup of team.thematicGroups) {
            for (const student of thematicGroup.students) {
                if (student) {
                    if (!await this.studentService.isCreate(student.userId)) {
                        await this.studentService.create(
                            {
                                id: student.userId,
                                fullname: student.fullname,
                                phone: student.contacts.phone,
                                email: student.contacts.email,
                                groupName: student.groupName,
                            }
                        )
                        this.logger.log("\tCreate student: (id:" + student.userId + ")")
                    } else {
                        await this.studentService.update(
                            student.userId,
                            {
                                id: student.userId,
                                fullname: student.fullname,
                                phone: student.contacts.phone,
                                email: student.contacts.email,
                                groupName: student.groupName,
                            }
                        )

                        try {
                            await this.studentService.removeFromProject(student.userId, period.id)
                        } catch (error) {}

                        this.logger.log("\tUpdate student: (id:" + student.userId + ")")
                    }

                    students.push(student.userId)
                    let studentResults;
                    for (const resultsThematicGroup of results.thematicGroups) {
                        for (const resultsStudent of resultsThematicGroup.students) {
                            if (resultsStudent.fullname === student.fullname) {
                                studentResults = resultsStudent
                            }
                        }
                    }

                    studentsResults.push({
                        student,
                        studentResults
                    })
                } else {
                    this.logger.error("Student not found")
                }
            }
        }


        const projectBD = await this.projectRepository.findOneBy({id: parseProjectDto.id})

        if (!projectBD) {
            this.logger.log("\tCreate project: " + parseProjectDto.id)

            await this.projectService.create({
                // @ts-ignore
                passport: details.passportNumber,
                project: parseProjectDto.project,
                period_id: period.id,
                details,
                team,
                documents,
                results,
                students
            })
        } else {
            this.logger.log("\tUpdate project: " + parseProjectDto.id)
            await this.projectService.update(parseProjectDto.id, {
                // @ts-ignore
                passport: details.passportNumber,
                project: parseProjectDto.project,
                period_id: period.id,
                details,
                team,
                documents,
                results,
                students
            })
        }

        for (let studentResult of studentsResults) {
            if (await this.studentProjectResultService.isCreateByIds(studentResult.student.userId, parseProjectDto.id)) {
                await this.studentProjectResultService.update(
                    studentResult.student.userId,
                    parseProjectDto.id,
                    {
                        totalScore: studentResult.studentResults?.totalScore ?? undefined,
                        expertsScore: studentResult.studentResults?.expertsScore ?? results.expertsScore ?? undefined,
                        finalScore: studentResult.studentResults?.finalScore ?? undefined,
                        retakedScore: studentResult.studentResults?.retakedScore ?? undefined,
                        brsScore: studentResult.studentResults?.brsScore ?? undefined,
                        coefficient: studentResult.studentResults?.coefficient ?? undefined,
                    }
                )
                this.logger.log("\tUpdate student project result: (student:" + studentResult.student.userId + ", project: " + parseProjectDto.id + ")")
            } else {
                await this.studentProjectResultService.create({
                    student_id: studentResult.student.userId,
                    project_id: parseProjectDto.id,
                    totalScore: studentResult.studentResults?.totalScore ?? undefined,
                    expertsScore: studentResult.studentResults?.expertsScore ?? results.expertsScore ?? undefined,
                    finalScore: studentResult.studentResults?.finalScore ?? undefined,
                    retakedScore: studentResult.studentResults?.retakedScore ?? undefined,
                    brsScore: studentResult.studentResults?.brsScore ?? undefined,
                    coefficient: studentResult.studentResults?.coefficient ?? undefined,
                })

                this.logger.log("\tCreate student project result: (student:" + studentResult.student.userId + ", project: " + parseProjectDto.id + ")")
            }
        }
        this.logger.log("}")
    }

    async createReport(createReportDto: CreateReportDto) {
        let projects = await this.projectRepository.find({
            where: {
                period: {id: createReportDto.periodId}
            },
            relations: {
                period: true,
                passport: {
                    request: {
                        track: true,
                        period_id: true,
                        tags: true,
                        customer_user: {
                            customer_company: true
                        }
                    }
                },
                students: true
            }
        })

        let workbook = XLSX.utils.book_new();

        let projectsSheet = {
            '!ref': 'A1:L' + (projects.length + 1),
            'A1': {
                t: 's',
                v: 'Паспорт',
            },
            'B1': {
                t: 's',
                v: 'Короткое название',
            },
            'C1': {
                t: 's',
                v: 'Название для диплома',
            },
            'D1': {
                t: 's',
                v: 'Участники',
            }
            ,
            'E1': {
                t: 's',
                v: 'Количество студентов',
            },
            'F1': {
                t: 's',
                v: 'Куратор',
            },
            'G1': {
                t: 's',
                v: 'Заказчик',
            },
            'H1': {
                t: 's',
                v: 'Отчёт',
            },
            'I1': {
                t: 's',
                v: 'Презентация',
            },
            'J1': {
                t: 's',
                v: 'Оценка комиссии',
            },
            'K1': {
                t: 's',
                v: 'Статус',
            },
            'L1': {
                t: 's',
                v: 'Ссылка на проект',
            }
        };

        projects.forEach((project, index) => {
            let students = []
            JSON.parse(project.team).thematicGroups.forEach((group, groupIndex) => {
                group.students.forEach((student, studentIndex) => {
                    if (!students.find(s => s.key === student.userId))
                        students.push(student.fullname)
                })
            })

            projectsSheet["A" + (index + 2)] = {t: 's', v: project.passport?.uid || ""}
            projectsSheet["B" + (index + 2)] = {t: 's', v: project.passport?.short_name}
            projectsSheet["С" + (index + 2)] = {t: 's', v: project.passport?.diploma_name}
            projectsSheet["D" + (index + 2)] = {t: 's', v: students.join('\n')}
            projectsSheet["E" + (index + 2)] = {t: 's', v: project.students.length}
            projectsSheet["F" + (index + 2)] = {t: 's', v: project.curator}
            projectsSheet["G" + (index + 2)] = {t: 's', v: project.passport?.request?.customer_user?.customer_company?.name}
            projectsSheet["H" + (index + 2)] = {t: 's', v: project.isHaveReport ? "Да" : "Нет"}
            projectsSheet["I" + (index + 2)] = {t: 's', v: project.isHavePresentation ? "Да" : "Нет"}
            projectsSheet["J" + (index + 2)] = {
                t: project.comissionScore ? 'n' : 's',
                v: project.comissionScore || "Нет оценки"
            }
            projectsSheet["K" + (index + 2)] = {t: 's', v: project.status}
            projectsSheet["L" + (index + 2)] = {t: 's', v: "https://teamproject.urfu.ru/#/" + project.id + "/about"}
        })

        let students = []

        projects.forEach(project => {
            JSON.parse(project.team).thematicGroups.forEach((group, groupIndex) => {
                group.students.forEach((student, studentIndex) => {
                    if (!students.find(s => s.key === student.userId))
                        students.push(
                            {
                                key: student.userId,
                                fullname: student.fullname,
                                group: student.groupName,
                                projectName: project.name,
                                projectKey: project.id,
                                curator: group.curator?.fullname || "",
                                expertsScore: JSON.parse(project.results).expertsScore || "Нет оценки",
                                finalScore: JSON.parse(project.results)?.thematicGroups?.[groupIndex]?.students[studentIndex]?.finalScore || "Нет оценки",
                                retakedScore: JSON.parse(project.results)?.thematicGroups?.[groupIndex]?.students[studentIndex]?.retakedScore || "Не пересдавал",
                            }
                        )
                })
            })
        })

        let usersSheet = {
            '!ref': 'A1:H' + (students.length + 1), // Sheet Range (Which cells will be included in the output)
            'A1': {
                t: 's',
                v: 'ФИО',
            },
            'B1': {
                t: 's',
                v: 'Группа',
            },
            'C1': {
                t: 's',
                v: 'Название проекта',
            },
            'D1': {
                t: 's',
                v: 'Куратор',
            },
            'E1': {
                t: 's',
                v: 'Оценка комиссии',
            },
            'F1': {
                t: 's',
                v: 'Оценка студента',
            },
            'G1': {
                t: 's',
                v: 'Пересдача',
            },
            'H1': {
                t: 's',
                v: 'Ссылка на проект',
            }
        };


        students.forEach((student, index) => {
            usersSheet["A" + (index + 2)] = {t: 's', v: student.fullname}
            usersSheet["B" + (index + 2)] = {t: 's', v: student.group}
            usersSheet["C" + (index + 2)] = {t: 's', v: student.projectName}
            usersSheet["D" + (index + 2)] = {t: 's', v: student.curator}
            usersSheet["E" + (index + 2)] = {
                t: student.expertsScore === "Нет оценки" ? 's' : 'n',
                v: student.expertsScore
            }
            usersSheet["F" + (index + 2)] = {t: student.finalScore === "Нет оценки" ? 's' : 'n', v: student.finalScore}
            usersSheet["G" + (index + 2)] = {
                t: student.retakedScore === "Не пересдавал" ? 's' : 'n',
                v: student.retakedScore
            }
            usersSheet["H" + (index + 2)] = {
                t: 's',
                v: "https://teamproject.urfu.ru/#/" + student.projectKey + "/about"
            }
        })

        XLSX.utils.book_append_sheet(workbook, projectsSheet, 'Проекты');
        XLSX.utils.book_append_sheet(workbook, usersSheet, 'Студенты');
        const bookId = uuidv4()
        JS_XLSX.writeFile(workbook, `static/${bookId}.xlsx`);
        return {reportFile: `${bookId}.xlsx`}
    }
}
