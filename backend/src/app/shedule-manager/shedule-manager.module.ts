import {Module} from '@nestjs/common';
import {SheduleManagerService} from './shedule-manager.service';
import {SheduleManagerController} from './shedule-manager.controller';
import {ConfigService} from "@nestjs/config";
import {PartnerService} from "../partner/partner.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Passport} from "../passport/entities/passport.entity";
import {Request} from "../request/entities/request.entity";
import {CustomerCompany} from "../customer-company/entities/customer-company.entity";
import {CustomerUser} from "../customer-user/entities/customer-user.entity";
import {Course} from "../course/entities/course.entity";
import {Tag} from "../tag/entities/tag.entity";
import {CustomerUserService} from "../customer-user/customer-user.service";
import {CustomerCompanyService} from "../customer-company/customer-company.service";
import {RequestService} from "../request/request.service";
import {PassportService} from "../passport/passport.service";
import {CourseService} from "../course/course.service";
import {Period} from "../period/entities/period.entity";
import {PeriodService} from "../period/period.service";
import {SSEModule} from "../sse/sse.module";

@Module({
  imports: [TypeOrmModule.forFeature([Passport, Request, CustomerCompany, CustomerUser, Course, Tag, Period]), SSEModule],
  controllers: [SheduleManagerController],
  providers: [SheduleManagerService, ConfigService, PartnerService, PassportService, RequestService, CourseService, CustomerCompanyService, CustomerUserService, PeriodService],
})
export class SheduleManagerModule {
}
