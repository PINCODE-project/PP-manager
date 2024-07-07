import { Module } from '@nestjs/common';
import { StudentProjectResultService } from './student-project-result.service';
import { StudentProjectResultController } from './student-project-result.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {StudentProjectResult} from "./entities/student-project-result.entity";
import {Student} from "../student/entities/student.entity";
import {Project} from "../project/entities/project.entity";

@Module({
  imports: [TypeOrmModule.forFeature([StudentProjectResult, Student, Project])],
  controllers: [StudentProjectResultController],
  providers: [StudentProjectResultService],
})
export class StudentProjectResultModule {}
