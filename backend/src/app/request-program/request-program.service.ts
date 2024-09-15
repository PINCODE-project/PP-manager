import { Injectable } from "@nestjs/common";
import { CreateRequestProgramDto } from "./dto/create-request-program.dto";
import { UpdateRequestProgramDto } from "./dto/update-request-program.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RequestProgram } from "./entities/request-program.entity";

@Injectable()
export class RequestProgramService {
    constructor(
        @InjectRepository(RequestProgram)
        private readonly requestProgramRepository: Repository<RequestProgram>,
    ) {}

    async isCreate(requestId: number, programId: number) {
        const requestProgram = await this.requestProgramRepository.findOneBy({
            request: { id: requestId },
            program: { id: programId },
        });
        return !!requestProgram;
    }

    async create(createRequestProgramDto: CreateRequestProgramDto) {
        const res = await this.requestProgramRepository.save({
            request: { id: createRequestProgramDto.requestId },
            program: { id: createRequestProgramDto.programId },
        });
        return { requestProgramID: res.id };
    }

    findAll() {
        return `This action returns all requestProgram`;
    }

    findOne(id: number) {
        return `This action returns a #${id} requestProgram`;
    }

    update(id: number, updateRequestProgramDto: UpdateRequestProgramDto) {
        return `This action updates a #${id} requestProgram`;
    }

    remove(id: number) {
        return `This action removes a #${id} requestProgram`;
    }
}
