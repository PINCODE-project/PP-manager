import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    Logger,
    UnauthorizedException,
} from "@nestjs/common";
import { ParsePassportsDto } from "./dto/parse-passports.dto";
import { PassportService } from "../passport/passport.service";
import { RequestService } from "../request/request.service";
import { ParsePassportDto } from "./dto/parse-passport.dto";
import { GetPassportsPagesCountDto } from "./dto/get-passports-pages-count.dto";
import { ParseRequestDto } from "./dto/parse-request.dto";
import { CustomerCompanyService } from "../customer-company/customer-company.service";
import { CustomerCompanyMappers } from "../customer-company/mappers/customer-company.mappers";
import { RequestMappers } from "../request/mappers/request.mappers";
import { PassportMappers } from "../passport/mappers/passport.mappers";
import { CustomerUserService } from "../customer-user/customer-user.service";
import { CustomerUserMappers } from "../customer-user/mappers/customer-user.mappers";
import { ParseRequestsDto } from "./dto/parse-requests.dto";
import { GetRequestsPagesCountDto } from "./dto/get-requests-pages-count.dto";
import { Builder, By, until } from "selenium-webdriver";
import { ConfigService } from "@nestjs/config";
import { Options } from "selenium-webdriver/chrome";
import { PeriodService } from "../period/period.service";
import { SSEEnum } from "../sse/interfaces/sse-service.interface";
import { SSEService } from "../sse/sse.service";
import { ProgramService } from "../program/program.service";
import { ProgramMappers } from "../program/mappers/program.mappers";
import { RequestProgramService } from "../request-program/request-program.service";
import { v4 as uuidv4 } from "uuid";
import { CreateRequestReportDto } from "./dto/create-request-report.dto";
import { CreatePassportReportDto } from "./dto/create-passport-report.dto";

const XLSX = require("xlsx");
const JS_XLSX = require("js-xlsx");
const { htmlToText } = require("html-to-text");

@Injectable()
export class PartnerService {
    private readonly logger = new Logger(PartnerService.name);

    constructor(
        private readonly passportService: PassportService,
        private readonly requestService: RequestService,
        private readonly customerCompanyService: CustomerCompanyService,
        private readonly customerUserService: CustomerUserService,
        private readonly configService: ConfigService,
        private readonly periodService: PeriodService,
        private readonly programService: ProgramService,
        private readonly requestProgramService: RequestProgramService,
        private readonly sseService: SSEService,
    ) {}

    async getTokens() {
        const options = new Options();
        options.addArguments("--headless", "--no-sandbox", "--disable-dev-shm-usage");
        const driver = new Builder().forBrowser("chrome").setChromeOptions(options).build();
        this.logger.log("Start parse tokens {");
        try {
            await driver.get("https://partner.urfu.ru");
            const loginButton = driver.wait(until.elementLocated(By.className("login-btn")), 10000);
            await loginButton.click();
            await driver.findElement(By.id("username")).sendKeys(this.configService.get("LOGIN"));
            await driver.findElement(By.id("password")).sendKeys(this.configService.get("PASSWORD"));
            await driver.findElement(By.id("kc-login")).click();
            await driver.sleep(5000);
            const key = await driver.manage().getCookie("key");
            const session = await driver.manage().getCookie("session-cookie");
            this.logger.log(`\ttoken: ${key.value}`);
            this.logger.log(`\tsession_cookie: ${session.value}`);
            this.logger.log(`}`);
            return {
                token: key.value,
                session_cookie: session.value,
            };
        } catch (error) {
            console.error("Failed to open website:", error);
        } finally {
            await driver.quit();
        }
    }

    async parsePrograms(requestOptions: RequestInit) {
        let programsResponse = await fetch("https://partner.urfu.ru/learning/program", requestOptions);
        this.logger.log("Start parse programs {");
        let programs = await programsResponse.json();
        console.log(programs);
        for (let program of programs) {
            if (!(await this.programService.isCreate(program.id))) {
                this.logger.log(`\tCreate program (id: ${program.id})`);
                await this.programService.create(ProgramMappers.toCreateDto(program));
            } else {
                this.logger.log(`\tUpdate program (id: ${program.id})`);
                await this.programService.update(program.id, ProgramMappers.toCreateDto(program));
            }
        }
        this.logger.log("}");
    }

    async parseRequests(parseRequestsDto: ParseRequestsDto) {
        if (this.sseService.isEventActive(SSEEnum.PARSE_PARTNERS)) {
            throw new ForbiddenException("Only one parsing process can be run!");
        }

        let tokens = await this.getTokens();

        let myHeaders = new Headers();
        myHeaders.append("Cookie", `session-cookie=${tokens.session_cookie};key=${tokens.token}`);

        let requestOptions: RequestInit = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        await this.parsePrograms(requestOptions);
        let period = await this.periodService.findOne(parseRequestsDto.period_id);

        let count = await this.getRequestsPagesCount({
            session_cookie: tokens.session_cookie,
            token: tokens.token,
            semester: period.year + "-" + (period.term - 1),
        });

        this.logger.log("Pages count: ", count.pagesCount);
        let j = 0;
        for (let i = 1; i < count.pagesCount + 1; i++) {
            this.logger.log(`${i}/${count.pagesCount} pages`);
            this.sseService.emitEvent(SSEEnum.PARSE_PARTNERS, {
                data: `${j}/${count.requestsCount}`,
            });

            try {
                let currentRequestsResponse = await fetch(
                    "https://partner.urfu.ru/learning/request/?mode=requests&semester=" +
                        period.year +
                        "-" +
                        (period.term - 1) +
                        "&own=me&page=" +
                        i,
                    requestOptions,
                );

                let currentRequests = await currentRequestsResponse.json();

                for (let request of currentRequests.results) {
                    j += 1;
                    this.logger.log(`${j}/${count.requestsCount} request`);
                    this.logger.log("Parse request " + request.id + " {");
                    let currentRequest = await this.parseRequest({
                        session_cookie: tokens.session_cookie,
                        token: tokens.token,
                        id: request.id,
                    });

                    if (!(await this.customerCompanyService.isCreate(currentRequest.partner.id))) {
                        // Компании заказчика не существует
                        this.logger.log("\tCreate customer company: (id:" + currentRequest.partner.id + ")");
                        await this.customerCompanyService.create(
                            CustomerCompanyMappers.partnerToCreateAndUpdateDto(currentRequest.partner),
                        );
                    } else {
                        this.logger.log("\tUpdate customer company: (id:" + currentRequest.partner.id + ")");
                        await this.customerCompanyService.update(
                            currentRequest.partner.id,
                            CustomerCompanyMappers.partnerToCreateAndUpdateDto(currentRequest.partner),
                        );
                    }

                    if (!(await this.customerUserService.isCreate(currentRequest.manager.id))) {
                        // Заказчика не существует
                        this.logger.log("\tCreate customer user: (id:" + currentRequest.id + ")");
                        await this.customerUserService.create(CustomerUserMappers.toCreateDto(currentRequest.manager));
                    } else {
                        this.logger.log("\tUpdate customer user: (id:" + currentRequest.manager.id + ")");
                        await this.customerUserService.update(
                            currentRequest.manager.id,
                            CustomerUserMappers.toUpdateDto(currentRequest.manager),
                        );
                    }

                    if (!(await this.requestService.isCreate(currentRequest.id))) {
                        // Заявки не существует
                        this.logger.log("\tCreate request: (id:" + currentRequest.id + ")");
                        await this.requestService.create(RequestMappers.toCreateDto(currentRequest));
                    } else {
                        this.logger.log("\tUpdate request: (id:" + currentRequest.id + ")");
                        await this.requestService.update(currentRequest.id, RequestMappers.toUpdateDto(currentRequest));
                    }

                    for (let program of currentRequest.programs) {
                        if (!(await this.requestProgramService.isCreate(currentRequest.id, program.program.id))) {
                            // Программы для заявки не существует

                            if (await this.programService.isCreate(program.program.id)) {
                                const requestProgram = await this.requestProgramService.create({
                                    requestId: currentRequest.id,
                                    programId: program.program.id,
                                });
                                this.logger.log(
                                    "\tCreate request program: (id:" + requestProgram.requestProgramID + ")",
                                );
                            }
                        }
                    }
                }
            } catch (error) {
                throw new BadRequestException(error);
            }
        }
        this.sseService.clearEvent(SSEEnum.PARSE_PARTNERS);
        console.log("End of parse requests");
    }

    async parsePassports(parsePassportsDto: ParsePassportsDto) {
        if (this.sseService.isEventActive(SSEEnum.PARSE_PARTNERS)) {
            throw new ForbiddenException("Only one parsing process can be run!");
        }

        let tokens = await this.getTokens();

        let myHeaders = new Headers();
        myHeaders.append("Cookie", "session-cookie=" + tokens.session_cookie + ";key=" + tokens.token);

        let requestOptions: RequestInit = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        await this.parsePrograms(requestOptions);
        let period = await this.periodService.findOne(parsePassportsDto.period_id);

        let { pagesCount, passportsCount } = await this.getPassportsPagesCount({
            token: tokens.token,
            session_cookie: tokens.session_cookie,
            semester: period.year + "-" + (period.term - 1),
        });

        this.logger.log("Start parse passports from Partner {");
        this.logger.log("\tPeriod: " + period.year + " " + period.term + "(id: " + period.id + ")");
        this.logger.log("\tPages count: " + pagesCount);
        this.logger.log("}");

        let j = 1;
        for (let i = 1; i < pagesCount + 1; i++) {
            try {
                this.logger.log(`${i}/${pagesCount} pages`);
                this.sseService.emitEvent(SSEEnum.PARSE_PARTNERS, {
                    data: `${j}/${passportsCount}`,
                });
                let currentPassportsResponse = await fetch(
                    "https://partner.urfu.ru/learning/request/?mode=projects&semester=" +
                        period.year +
                        "-" +
                        (period.term - 1) +
                        "&own=me&page=" +
                        i,
                    requestOptions,
                );

                let currentPassports = await currentPassportsResponse.json();

                for (let passport of currentPassports.results) {
                    let currentPassport = await this.parsePassport({
                        token: tokens.token,
                        session_cookie: tokens.session_cookie,
                        id: passport.id,
                    });
                    let currentRequest = await this.parseRequest({
                        token: tokens.token,
                        session_cookie: tokens.session_cookie,
                        id: currentPassport.source?.id || currentPassport.id,
                    });
                    this.logger.log(`${j}/${passportsCount} passports`);
                    j += 1;
                    this.logger.log("Parse passport " + passport.id + " {");

                    if (!(await this.customerCompanyService.isCreate(currentRequest.partner.id))) {
                        // Компании заказчика не существует
                        this.logger.log("\tCreate customer company: (id:" + currentRequest.partner.id + ")");
                        await this.customerCompanyService.create(
                            CustomerCompanyMappers.partnerToCreateAndUpdateDto(currentRequest.partner),
                        );
                    } else {
                        this.logger.log("\tUpdate customer company: (id:" + currentRequest.partner.id + ")");
                        await this.customerCompanyService.update(
                            currentRequest.partner.id,
                            CustomerCompanyMappers.partnerToCreateAndUpdateDto(currentRequest.partner),
                        );
                    }

                    if (!(await this.customerUserService.isCreate(currentRequest.manager.id))) {
                        // Заказчика не существует
                        this.logger.log("\tCreate customer user: (id:" + currentRequest.manager.id + ")");
                        await this.customerUserService.create(CustomerUserMappers.toCreateDto(currentRequest.manager));
                    } else {
                        this.logger.log("\tUpdate customer user: (id:" + currentRequest.manager.id + ")");
                        await this.customerUserService.update(
                            currentRequest.manager.id,
                            CustomerUserMappers.toUpdateDto(currentRequest.manager),
                        );
                    }

                    if (!(await this.requestService.isCreate(currentRequest.id))) {
                        // Заявки не существует
                        this.logger.log("\tCreate request: (id:" + currentRequest.id + ")");
                        await this.requestService.create(RequestMappers.toCreateDto(currentRequest));
                    } else {
                        this.logger.log("\tUpdate request: (id:" + currentRequest.id + ")");
                        await this.requestService.update(currentRequest.id, RequestMappers.toUpdateDto(currentRequest));
                    }

                    for (let program of currentPassport.programs) {
                        if (!(await this.requestProgramService.isCreate(currentRequest.id, program.program.id))) {
                            // Программы для заявки не существует
                            if (await this.programService.isCreate(program.program.id)) {
                                const requestProgram = await this.requestProgramService.create({
                                    requestId: currentRequest.id,
                                    programId: program.program.id,
                                });
                                this.logger.log(
                                    "\tCreate request program: (id:" + requestProgram.requestProgramID + ")",
                                );
                            }
                        }
                    }

                    if (!(await this.passportService.isCreate(passport.id))) {
                        // Паспорта не существует
                        this.logger.log("\tCreate passport: (id:" + passport.id + ")");
                        await this.passportService.create(PassportMappers.toCreateDto(currentPassport));
                    } else {
                        this.logger.log("\tUpdate passport: (id:" + currentPassport.id + ")");
                        await this.passportService.update(
                            currentPassport.id,
                            PassportMappers.toUpdateDto(currentPassport),
                        );
                    }
                }
            } catch (error) {
                throw new BadRequestException(error);
            }
        }
        this.sseService.clearEvent(SSEEnum.PARSE_PARTNERS);
        this.logger.log("End of parse passports");
    }

    async getRequestsPagesCount(getRequestsPagesCountDto: GetRequestsPagesCountDto): Promise<{
        pagesCount: number;
        requestsCount: number;
    }> {
        let myHeaders = new Headers();
        myHeaders.append(
            "Cookie",
            "session-cookie=" + getRequestsPagesCountDto.session_cookie + ";key=" + getRequestsPagesCountDto.token,
        );

        let requestOptions: RequestInit = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        try {
            let pagesCountRequest = await fetch(
                "https://partner.urfu.ru/learning/request/?mode=requests&own=me&semester=" +
                    getRequestsPagesCountDto.semester,
                requestOptions,
            );
            let pagesCountRequestJSON = await pagesCountRequest.json();

            return {
                pagesCount: pagesCountRequestJSON.pages.at(-1)[1] || 0,
                requestsCount: pagesCountRequestJSON.count,
            };
        } catch (error) {
            throw new InternalServerErrorException("Get pages count error: " + error);
        }
    }

    async getPassportsPagesCount(getPassportsPagesCountDto: GetPassportsPagesCountDto): Promise<{
        pagesCount: number;
        passportsCount: number;
    }> {
        let myHeaders = new Headers();
        myHeaders.append(
            "Cookie",
            "session-cookie=" + getPassportsPagesCountDto.session_cookie + ";key=" + getPassportsPagesCountDto.token,
        );

        let requestOptions: RequestInit = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        try {
            let pagesCountRequest = await fetch(
                "https://partner.urfu.ru/learning/request/?mode=projects&semester=" +
                    getPassportsPagesCountDto.semester +
                    "&own=me",
                requestOptions,
            );
            let pagesCountRequestJSON = await pagesCountRequest.json();

            return {
                pagesCount: pagesCountRequestJSON.pages.at(-1)[1] || 0,
                passportsCount: pagesCountRequestJSON.count,
            };
        } catch (error) {
            throw new InternalServerErrorException("Get pages count error: " + error);
        }
    }

    async parsePassport(parsePassportDto: ParsePassportDto) {
        let myHeaders = new Headers();
        myHeaders.append(
            "Cookie",
            "session-cookie=" + parsePassportDto.session_cookie + ";key=" + parsePassportDto.token,
        );

        let requestOptions: RequestInit = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        let fullPassport = await fetch(
            "https://partner.urfu.ru/learning/request/" + parsePassportDto.id + "/?comments=yes",
            requestOptions,
        )
            .then((response) => response.json())
            .then((result) => result)
            .catch((error) => {
                throw new UnauthorizedException(error);
            });

        let mainProgram = fullPassport.programs.find((program) => program.is_main);

        return {
            ...fullPassport,
            mainProgram,
        };
    }

    async parseAndCreatePassport(parsePassportDto: ParsePassportDto) {
        let myHeaders = new Headers();
        myHeaders.append(
            "Cookie",
            "session-cookie=" + parsePassportDto.session_cookie + ";key=" + parsePassportDto.token,
        );

        let requestOptions: RequestInit = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        let currentPassport = await this.parsePassport(parsePassportDto);
        let currentRequest = await this.parseRequest({
            ...parsePassportDto,
            id: currentPassport.source?.id || parsePassportDto.id,
        });

        if (!(await this.customerCompanyService.isCreate(currentRequest.partner.id))) {
            // Компании заказчика не существует
            console.log("Create customer company");
            await this.customerCompanyService.create(
                CustomerCompanyMappers.partnerToCreateAndUpdateDto(currentRequest.partner),
            );
        } else {
            console.log("Update customer company");
            await this.customerCompanyService.update(
                currentRequest.partner.id,
                CustomerCompanyMappers.partnerToCreateAndUpdateDto(currentRequest.partner),
            );
        }

        if (!(await this.customerUserService.isCreate(currentRequest.manager.id))) {
            // Заказчика не существует
            console.log("Create customer user");
            await this.customerUserService.create(CustomerUserMappers.toCreateDto(currentRequest.manager));
        } else {
            console.log("Update customer user");
            await this.customerUserService.update(
                currentRequest.manager.id,
                CustomerUserMappers.toUpdateDto(currentRequest.manager),
            );
        }

        if (!(await this.requestService.isCreate(currentRequest.id))) {
            // Заявки не существует
            console.log("Create request");
            await this.requestService.create(RequestMappers.toCreateDto(currentRequest));
        } else {
            console.log("Update request");
            await this.requestService.update(currentRequest.id, RequestMappers.toUpdateDto(currentRequest));
        }

        if (!(await this.passportService.isCreate(parsePassportDto.id))) {
            console.log("Create passport");
            // Паспорта не существует
            await this.passportService.create(PassportMappers.toCreateDto(currentPassport));
        } else {
            console.log("Update passport");
            await this.passportService.update(currentPassport.id, PassportMappers.toUpdateDto(currentPassport));
        }

        return;
    }

    async parseRequest(parseRequestDto: ParseRequestDto) {
        let myHeaders = new Headers();
        myHeaders.append(
            "Cookie",
            "session-cookie=" + parseRequestDto.session_cookie + ";key=" + parseRequestDto.token,
        );

        let requestOptions: RequestInit = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        let fullRequest = await fetch(
            "https://partner.urfu.ru/learning/request/" + parseRequestDto.id + "/?comments=yes",
            requestOptions,
        )
            .then((response) => response.json())
            .then((result) => result)
            .catch((error) => {
                throw new UnauthorizedException(error);
            });

        return fullRequest;
    }

    async createRequestReport(dto: CreateRequestReportDto) {
        let requests = await this.requestService.findAll({
            period_id: dto.periodId,
            programs: dto.programs,
        });

        let workbook = XLSX.utils.book_new();

        let requestsSheet = {
            "!ref": "A1:I" + (requests.length + 1), // Sheet Range (Which cells will be included in the output)
            A1: {
                t: "s",
                v: "Номер заявки",
            },
            B1: {
                t: "s",
                v: "Название",
            },
            C1: {
                t: "s",
                v: "Описание",
            },
            D1: {
                t: "s",
                v: "Цель",
            },
            E1: {
                t: "s",
                v: "Критерии",
            },
            F1: {
                t: "s",
                v: "Статус",
            },
            G1: {
                t: "s",
                v: "Заказчик",
            },
            H1: {
                t: "s",
                v: "Представитель заказчика",
            },
            I1: {
                t: "s",
                v: "Ссылка",
            },
        };

        requests.forEach((request, index) => {
            requestsSheet["A" + (index + 2)] = { t: "s", v: request.uid };
            requestsSheet["B" + (index + 2)] = { t: "s", v: request.name };
            requestsSheet["C" + (index + 2)] = {
                t: "s",
                v: htmlToText(request.description),
            };
            requestsSheet["D" + (index + 2)] = {
                t: "s",
                v: htmlToText(request.goal),
            };
            requestsSheet["E" + (index + 2)] = {
                t: "s",
                v: htmlToText(request.criteria),
            };
            requestsSheet["F" + (index + 2)] = {
                t: "s",
                v: htmlToText(request.status),
            };
            requestsSheet["G" + (index + 2)] = {
                t: "s",
                v: htmlToText(request.customer_user.customer_company.name),
            };
            requestsSheet["H" + (index + 2)] = {
                t: "s",
                v:
                    (request.customer_user.last_name || "") +
                    " " +
                    (request.customer_user.first_name || "") +
                    " " +
                    (request.customer_user.middle_name || ""),
            };
            requestsSheet["I" + (index + 2)] = {
                t: "s",
                v: "https://partner.urfu.ru/ptraining/services/learning/#/requests/" + request.id,
            };
        });

        XLSX.utils.book_append_sheet(workbook, requestsSheet, "Заявки");
        const bookId = uuidv4();
        JS_XLSX.writeFile(workbook, `static/${bookId}.xlsx`);
        console.log("End of create report");
        return { reportFile: `${bookId}.xlsx` };
    }

    async createPassportReport(dto: CreatePassportReportDto) {
        let passports = await this.passportService.findAll({
            period_id: dto.periodId,
            programs: dto.programs,
        });
        passports = passports.filter((passport) => passport.is_visible);

        let workbook = XLSX.utils.book_new();

        let passportsSheet = {
            "!ref": "A1:K" + (passports.length + 1), // Sheet Range (Which cells will be included in the output)
            A1: {
                t: "s",
                v: "Название",
            },
            B1: {
                t: "s",
                v: "Теги",
            },
            C1: {
                t: "s",
                v: "Курсы",
            },
            D1: {
                t: "s",
                v: "Цель",
            },
            E1: {
                t: "s",
                v: "Результат",
            },
            F1: {
                t: "s",
                v: "Описание",
            },
            G1: {
                t: "s",
                v: "Критерии оценивания",
            },
            H1: {
                t: "s",
                v: "Заказчик",
            },
            I1: {
                t: "s",
                v: "Представитель заказчика",
            },
            J1: {
                t: "s",
                v: "Максимальное количество команд",
            },
            K1: {
                t: "s",
                v: "Количество студентов в команде",
            },
        };

        passports.forEach((passport, index) => {
            passportsSheet["A" + (index + 2)] = {
                t: "s",
                v: passport.short_name || passport.request.name,
            };
            passportsSheet["B" + (index + 2)] = {
                t: "s",
                v: htmlToText(passport.request.tags.map((tag) => tag.text).join("<br/>")),
            };
            passportsSheet["C" + (index + 2)] = {
                t: "s",
                v: htmlToText(passport.course.map((course) => course.number).join(", ")),
            };
            passportsSheet["D" + (index + 2)] = {
                t: "s",
                v: htmlToText(passport.request.goal),
            };
            passportsSheet["E" + (index + 2)] = {
                t: "s",
                v: htmlToText(passport.request.result),
            };
            passportsSheet["F" + (index + 2)] = {
                t: "s",
                v: htmlToText(passport.request.description),
            };
            passportsSheet["G" + (index + 2)] = {
                t: "s",
                v: htmlToText(passport.request.criteria),
            };
            passportsSheet["H" + (index + 2)] = {
                t: "s",
                v: passport.request.customer_user.customer_company.name,
            };
            passportsSheet["I" + (index + 2)] = {
                t: "s",
                v:
                    (passport.request.customer_user.last_name || "") +
                    " " +
                    (passport.request.customer_user.first_name || "") +
                    " " +
                    (passport.request.customer_user.middle_name || ""),
            };
            passportsSheet["J" + (index + 2)] = {
                t: "s",
                v: passport.team_count,
            };
            passportsSheet["K" + (index + 2)] = {
                t: "s",
                v: passport.students_count,
            };
        });

        XLSX.utils.book_append_sheet(workbook, passportsSheet, "Паспорта");
        const bookId = uuidv4();
        JS_XLSX.writeFile(workbook, `static/${bookId}.xlsx`);
        console.log("End of create report");
        return { reportFile: `${bookId}.xlsx` };
    }
}
