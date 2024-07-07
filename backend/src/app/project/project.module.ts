import {Module} from '@nestjs/common';
import {ProjectService} from './project.service';
import {ProjectController} from './project.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Project} from "./entities/project.entity";
import {Student} from "../student/entities/student.entity";
import {Passport} from "../passport/entities/passport.entity";
import {Period} from "../period/entities/period.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Project, Student, Passport, Period])],
    controllers: [ProjectController],
    providers: [ProjectService],
})
export class ProjectModule {
}
