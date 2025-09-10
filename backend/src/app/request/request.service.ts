import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateRequestDto } from "./dto/create-request.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Request } from "./entities/request.entity";
import { UpdateRequestDto } from "./dto/update-request.dto";
import { Tag } from "../tag/entities/tag.entity";
import { FindAllRequestsDto } from "./dto/find-all-requests.dto";
import { Passport } from "../passport/entities/passport.entity";

@Injectable()
export class RequestService {
    constructor(
        @InjectRepository(Request)
        private readonly requestRepository: Repository<Request>,
        @InjectRepository(Passport)
        private readonly passportRepository: Repository<Passport>,
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,
    ) {}

    async isCreate(id: number) {
        const request = await this.requestRepository.findOneBy({ id });
        return !!request;
    }

    async create(createRequestDto: CreateRequestDto) {
        const isRequestExist = await this.requestRepository.existsBy({ id: createRequestDto.id });

        if (isRequestExist) throw new BadRequestException("The request already exist!");

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
            period_id: { id: createRequestDto.period_id },
            customer_user: { id: createRequestDto.customer_user_id },
        };

        const res = await this.requestRepository.save(newRequest);
        return { requestID: res.id };
    }

    async update(id: number, updateRequestDto: UpdateRequestDto) {
        const request = await this.requestRepository.findOneBy({ id });

        if (!request) throw new NotFoundException("Request not found!");

        if ("tags" in updateRequestDto) {
            const tagsExists = await this.tagRepository.countBy(updateRequestDto.tags.map((tag) => ({ id: tag })));

            if (updateRequestDto.tags.length !== 0 && tagsExists !== updateRequestDto.tags.length)
                throw new BadRequestException("The tag does not exist!");

            await this.requestRepository.save({
                ...request,
                tags: updateRequestDto.tags.map((tag) => ({ id: tag })),
            });
            delete updateRequestDto["tags"];
        }

        if ("period_id" in updateRequestDto) {
            await this.requestRepository.update(request.id, {
                period_id: { id: updateRequestDto.period_id },
            });
            delete updateRequestDto["period_id"];
        }

        if ("track" in updateRequestDto) {
            await this.requestRepository.update(request.id, {
                track: { id: updateRequestDto.track },
            });
            delete updateRequestDto["track"];
        }

        if ("customer_user_id" in updateRequestDto) {
            await this.requestRepository.update(request.id, {
                customer_user: { id: updateRequestDto.customer_user_id },
            });
            delete updateRequestDto["customer_user_id"];
        }

        if (Object.keys(updateRequestDto).length > 0)
            // @ts-ignore
            await this.requestRepository.update(request.id, updateRequestDto);

        return this.requestRepository.findOne({
            where: { id },
        });
    }

    async findConflicts(dto: FindAllRequestsDto) {
        const requests = await this.requestRepository.find({
            where: {
                period_id: { id: dto.period_id },
            },
            relations: {
                track: true,
                tags: true,
                period_id: true,
                customer_user: {
                    customer_company: true,
                },
                programs: {
                    program: true,
                },
                passports: {
                    programs: {
                        program: true,
                    },
                },
            },
        });

        const shesterovIds = [20, 24, 26];

        const requestsWithoutShesterov: typeof requests = [];
        const requestsWithMixed: typeof requests = [];

        for (const request of requests) {
            let pushToWithout = false;
            let pushToMixed = false;

            const newPassports = request.passports
                .map((passport) => {
                    const programs = passport.programs;

                    const hasShesterov = programs.some((p) => shesterovIds.includes(p.program.id));
                    const hasOther = programs.some((p) => !shesterovIds.includes(p.program.id));

                    if (hasOther && !hasShesterov) {
                        // только НЕ шестерова → попадёт в "without"
                        pushToWithout = true;
                        return {
                            ...passport,
                            programs: programs.filter((p) => !shesterovIds.includes(p.program.id)),
                        };
                    }

                    if (hasShesterov && hasOther) {
                        // смешанные → попадут в "mixed"
                        pushToMixed = true;
                        return { ...passport, programs };
                    }

                    // если только шестерова → не добавляем в оба массива
                    return null;
                })
                .filter(Boolean);

            if (pushToWithout) {
                requestsWithoutShesterov.push({
                    ...request,
                    passports: newPassports,
                });
            }

            if (pushToMixed) {
                requestsWithMixed.push({
                    ...request,
                    passports: newPassports,
                });
            }
        }

        return { requestsWithoutShesterov, requestsWithMixed };
    }

    async findAll(findAllRequestsDto: FindAllRequestsDto) {
        const requests = await this.requestRepository.find({
            where: {
                period_id: { id: findAllRequestsDto.period_id },
                programs: { program: { id: In(findAllRequestsDto.programs) } },
            },
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
                    customer_company: true,
                },
                programs: {
                    program: true,
                },
            },
        });

        return requests;
    }
}
