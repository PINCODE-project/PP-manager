import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateCourseDto} from './dto/create-course.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Course} from "./entities/course.entity";

@Injectable()
export class CourseService {
  constructor(
      @InjectRepository(Course)
      private readonly courseRepository: Repository<Course>,
  ) {
  }

  async create(createCourseDto: CreateCourseDto) {
    const isCourseExist = await this.courseRepository.existsBy({id: createCourseDto.id})

    if (isCourseExist)
      throw new BadRequestException("The course already exist!");

    await this.courseRepository.save(createCourseDto);
  }
}
