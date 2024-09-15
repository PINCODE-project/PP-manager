import { Injectable } from "@nestjs/common";
import { CreateProgramDto } from "./dto/create-program.dto";
import { UpdateProgramDto } from "./dto/update-program.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Period } from "../period/entities/period.entity";
import { Repository } from "typeorm";
import { Program } from "./entities/program.entity";

@Injectable()
export class ProgramService {
    constructor(
        @InjectRepository(Program)
        private readonly programRepository: Repository<Program>,
    ) {}

    async isCreate(id: number) {
        const program = await this.programRepository.findOneBy({ id });
        return !!program;
    }

    async create(createProgramDto: CreateProgramDto) {
        const res = await this.programRepository.save(createProgramDto);
        return { programID: res.id };
    }

    async findAll() {
        return await this.programRepository.find();
    }

    async findOne(id: number) {
        return await this.programRepository.findOne({ where: { id } });
    }

    async update(id: number, updateProgramDto: UpdateProgramDto) {
        await this.programRepository.update(id, updateProgramDto);

        return this.programRepository.findOne({
            where: { id },
        });
    }

    remove(id: number) {
        return `This action removes a #${id} program`;
    }
}
