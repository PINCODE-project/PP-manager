import { Module } from "@nestjs/common";
import { ProgramService } from "./program.service";
import { ProgramController } from "./program.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Period } from "../period/entities/period.entity";
import { Program } from "./entities/program.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Program])],
    controllers: [ProgramController],
    providers: [ProgramService],
})
export class ProgramModule {}
