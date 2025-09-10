import { Injectable } from "@nestjs/common";
import { CreatePassportProgramDto } from "./dto/create-passport-program.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PassportProgram } from "./entities/passport-program.entity";

@Injectable()
export class PassportProgramService {
    constructor(
        @InjectRepository(PassportProgram)
        private readonly passportProgramRepository: Repository<PassportProgram>,
    ) {}

    async isCreate(passportId: number, programId: number) {
        const requestProgram = await this.passportProgramRepository.findOneBy({
            passport: { id: passportId },
            program: { id: programId },
        });
        return !!requestProgram;
    }

    async create(dto: CreatePassportProgramDto) {
        const res = await this.passportProgramRepository.save({
            passport: { id: dto.passportId },
            program: { id: dto.programId },
        });
        return { passportProgramID: res.id };
    }

    async findAllPrograms() {
        const programs = await this.passportProgramRepository
            .createQueryBuilder("passport_program")
            .select("passport_program.program", "program_id")
            .distinct(true)
            .leftJoinAndSelect("program", "program", "passport_program.program = program.id")
            .getRawMany();
        return programs;
    }
}
