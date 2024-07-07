import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Period} from "./entities/period.entity";
import {CreatePeriodDto} from "./dto/create-period.dto";

@Injectable()
export class PeriodService {
    constructor(
        @InjectRepository(Period)
        private readonly periodRepository: Repository<Period>,
    ) {
    }

    async create(createPeriodDto: CreatePeriodDto) {
        const isPeriodExist = await this.periodRepository.existsBy({
            term: createPeriodDto.term,
            year: createPeriodDto.year
        })

        if (isPeriodExist)
            throw new BadRequestException("The period already exist!");

        return await this.periodRepository.save({
            term: createPeriodDto.term,
            year: createPeriodDto.year
        });
    }

    async findAll() {
        const periods = await this.periodRepository.find({order: {year: "ASC", term: "ASC"}})

        return periods
    }

    async findOne(id: number) {
        const period = await this.periodRepository.findOneBy({id})

        if (!period)
            throw new BadRequestException("The period not found!");

        return period;
    }

    async getId(year: number, term: number) {
        const period = await this.periodRepository.findOneBy({year, term})

        if (!period)
            throw new BadRequestException("The period not found!");

        return period;
    }
}
