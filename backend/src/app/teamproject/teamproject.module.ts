import {Module} from '@nestjs/common';
import {TeamprojectService} from './teamproject.service';
import {TeamprojectController} from './teamproject.controller';
import {Project} from "../project/entities/project.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProjectService} from "../project/project.service";
import {StudentService} from "../student/student.service";
import {Student} from "../student/entities/student.entity";
import {Passport} from "../passport/entities/passport.entity";
import {PeriodService} from "../period/period.service";
import {Period} from "../period/entities/period.entity";
import {StudentProjectResult} from "../student-project-results/entities/student-project-result.entity";
import {StudentProjectResultService} from "../student-project-results/student-project-result.service";
import {SSEService} from "../sse/sse.service";
import {SSEModule} from "../sse/sse.module";

@Module({
    imports: [TypeOrmModule.forFeature([Project, Student, Passport, Period, StudentProjectResult]), SSEModule],
    controllers: [TeamprojectController],
    providers: [TeamprojectService, ProjectService, StudentService, PeriodService, StudentProjectResultService],
})
export class TeamprojectModule {
}
