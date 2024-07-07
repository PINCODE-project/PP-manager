import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateTagDto} from './dto/create-tag.dto';
import {UpdateTagDto} from './dto/update-tag.dto';
import {CreatePassportDto} from "../passport/dto/create-passport.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Passport} from "../passport/entities/passport.entity";
import {Repository} from "typeorm";
import {Course} from "../course/entities/course.entity";
import {Tag} from "./entities/tag.entity";
import {FindAllPassportsDto} from "../passport/dto/find-all-passports.dto";

@Injectable()
export class TagService {
    constructor(
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,
    ) {
    }

    async isCreate(id: string) {
        const tag = await this.tagRepository.findOneBy({id})
        return !!tag;
    }

    async create(createTagDto: CreateTagDto) {
        const isTagExist = await this.tagRepository.existsBy({text: createTagDto.text})

        if (isTagExist)
            throw new BadRequestException("The tag already exist!");

        const newTag = {
            text: createTagDto.text,
            color: createTagDto.color,
            is_track: createTagDto.isTrack
        };

        const res = await this.tagRepository.save(newTag);
        return {tagID: res.id}
    }

    async findAll() {
        const tags = await this.tagRepository.find({
            relations: {
                requests: true
            },
        })

        return tags
    }
}
