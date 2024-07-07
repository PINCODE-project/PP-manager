import {Module} from '@nestjs/common';
import {PassportService} from './passport.service';
import {PassportController} from './passport.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Passport} from "./entities/passport.entity";
import {Course} from "../course/entities/course.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Passport, Course])],
    controllers: [PassportController],
    providers: [PassportService],
})
export class PassportModule {
}
