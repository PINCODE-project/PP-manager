import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateRequestDto} from './dto/create-request.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Request} from "./entities/request.entity"
import {UpdateCustomerUserDto} from "../customer-user/dto/update-customer-user.dto";
import {UpdateRequestDto} from "./dto/update-request.dto";
import {FindAllPassportsDto} from "../passport/dto/find-all-passports.dto";
import {Tag} from "../tag/entities/tag.entity";

@Injectable()
export class RequestService {
    constructor(
        @InjectRepository(Request)
        private readonly requestRepository: Repository<Request>,
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,
    ) {
    }

    async isCreate(id: number) {
        const request = await this.requestRepository.findOneBy({id})
        return !!request;
    }

    async create(createRequestDto: CreateRequestDto) {
        const isRequestExist = await this.requestRepository.existsBy({id: createRequestDto.id})

        if (isRequestExist)
            throw new BadRequestException("The request already exist!");

        const newRequest = {
            id: createRequestDto.id,
            uid: createRequestDto.uid,
            name: createRequestDto.name,
            date: createRequestDto.date,
            goal: createRequestDto.goal,
            result: createRequestDto.result,
            status: createRequestDto.status,
            description: createRequestDto.description,
            criteria: createRequestDto.criteria,
            max_copies: createRequestDto.max_copies,
            period_id: {id: createRequestDto.period_id},
            customer_user: {id: createRequestDto.customer_user_id}
        };

        const res = await this.requestRepository.save(newRequest);
        return {requestID: res.id}
    }

    async update(id: number, updateRequestDto: UpdateRequestDto) {
        const request = await this.requestRepository.findOneBy({id})

        if (!request)
            throw new NotFoundException("Request not found!")

        if ("tags" in updateRequestDto) {
            const tagsExists = await this.tagRepository.countBy(
                updateRequestDto.tags.map(tag => ({id: tag}))
            )

            if (updateRequestDto.tags.length !== 0 && tagsExists !== updateRequestDto.tags.length)
                throw new BadRequestException("The tag does not exist!");

            await this.requestRepository.save({
                ...request,
                tags: updateRequestDto.tags.map(tag => ({id: tag}))
            })
            delete updateRequestDto["tags"];
        }

        if ("period_id" in updateRequestDto) {
            await this.requestRepository.update(request.id, {
                period_id: {id: updateRequestDto.period_id},
            });
            delete updateRequestDto["period_id"];
        }

        if ("track" in updateRequestDto) {
            await this.requestRepository.update(request.id, {
                track: {id: updateRequestDto.track},
            });
            delete updateRequestDto["track"];
        }

        if ("customer_user_id" in updateRequestDto) {
            await this.requestRepository.update(request.id, {
                customer_user: {id: updateRequestDto.customer_user_id},
            });
            delete updateRequestDto["customer_user_id"];
        }

        if (Object.keys(updateRequestDto).length > 0)
            // @ts-ignore
            await this.requestRepository.update(request.id, updateRequestDto);

        return this.requestRepository.findOne({
            where: {id},
        })
    }

    async findAll(findAllPassportsDto: FindAllPassportsDto) {
        const requests = await this.requestRepository.find({
            where: {period_id: {id: findAllPassportsDto.period_id}},
            // select: {
            //     id: true,
            //     passport: true,
            //     name: true,
            //     students: true,
            //     curator: true,
            //     year: true,
            //     term: true,
            //     isHaveReport: true,
            //     isHavePresentation: true,
            //     comissionScore: true,
            //     status: true,
            //     updated_at: true
            // },
            relations: {
                track: true,
                tags: true,
                passports: true,
                period_id: true,
                customer_user: {
                    customer_company: true
                }
            },
        })

        return requests
    }
}
