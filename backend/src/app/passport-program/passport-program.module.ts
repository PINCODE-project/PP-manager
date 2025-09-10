import { Module } from "@nestjs/common";
import { PassportProgramService } from "./passport-program.service";
import { PassportProgramController } from "./passport-program.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportProgram } from "./entities/passport-program.entity";

@Module({
    imports: [TypeOrmModule.forFeature([PassportProgram])],
    controllers: [PassportProgramController],
    providers: [PassportProgramService],
})
export class PassportProgramModule {}
