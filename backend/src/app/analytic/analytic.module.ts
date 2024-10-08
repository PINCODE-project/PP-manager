import { Module } from "@nestjs/common";
import { AnalyticService } from "./analytic.service";
import { AnalyticController } from "./analytic.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Passport } from "../passport/entities/passport.entity";
import { Request } from "../request/entities/request.entity";
import { CustomerCompany } from "../customer-company/entities/customer-company.entity";
import { CustomerUser } from "../customer-user/entities/customer-user.entity";
import { PartnerService } from "../partner/partner.service";
import { PassportService } from "../passport/passport.service";
import { RequestService } from "../request/request.service";
import { CustomerCompanyService } from "../customer-company/customer-company.service";
import { CustomerUserService } from "../customer-user/customer-user.service";
import { Course } from "../course/entities/course.entity";
import { Tag } from "../tag/entities/tag.entity";
import { Period } from "../period/entities/period.entity";
import { PeriodService } from "../period/period.service";
import { SSEModule } from "../sse/sse.module";
import { ProjectService } from "../project/project.service";
import { Project } from "../project/entities/project.entity";
import { Student } from "../student/entities/student.entity";
import { StudentService } from "../student/student.service";
import { ProgramService } from "../program/program.service";
import { Program } from "../program/entities/program.entity";
import { RequestProgramService } from "../request-program/request-program.service";
import { RequestProgram } from "../request-program/entities/request-program.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Passport,
            Request,
            Project,
            CustomerCompany,
            CustomerUser,
            Course,
            Tag,
            Period,
            Student,
            Program,
            RequestProgram,
        ]),
        SSEModule,
    ],
    controllers: [AnalyticController],
    providers: [
        AnalyticService,
        PartnerService,
        PassportService,
        ProjectService,
        ProgramService,
        RequestService,
        CustomerCompanyService,
        CustomerUserService,
        PeriodService,
        StudentService,
        RequestProgramService,
    ],
})
export class AnalyticModule {}
