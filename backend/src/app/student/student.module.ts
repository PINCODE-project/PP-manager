import {Module} from '@nestjs/common';
import {StudentService} from './student.service';
import {StudentController} from './student.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Student} from "./entities/student.entity";
import {Project} from "../project/entities/project.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Student, Project])],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
