import { Module } from "@nestjs/common";
import { RequestProgramService } from "./request-program.service";
import { RequestProgramController } from "./request-program.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RequestProgram } from "./entities/request-program.entity";

@Module({
    imports: [TypeOrmModule.forFeature([RequestProgram])],
    controllers: [RequestProgramController],
    providers: [RequestProgramService],
})
export class RequestProgramModule {}
