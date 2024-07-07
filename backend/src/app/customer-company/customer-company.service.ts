import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateCustomerCompanyDto } from './dto/create-customer-company.dto';
import { UpdateCustomerCompanyDto } from './dto/update-customer-company.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Request} from "../request/entities/request.entity";
import {Repository} from "typeorm";
import {CreateRequestDto} from "../request/dto/create-request.dto";
import {CustomerCompany} from "./entities/customer-company.entity";
import {UpdateCustomerUserDto} from "../customer-user/dto/update-customer-user.dto";
import {FindAllPassportsDto} from "../passport/dto/find-all-passports.dto";

@Injectable()
export class CustomerCompanyService {
    constructor(
        @InjectRepository(CustomerCompany)
        private readonly customerCompanyRepository: Repository<CustomerCompany>,
    ) {
    }

    async isCreate(id: number) {
        const customerCompany = await this.customerCompanyRepository.findOneBy({id})
        return !!customerCompany;
    }

    async create(createCustomerCompanyDto: CreateCustomerCompanyDto) {
        const isCustomerCompanyExist = await this.customerCompanyRepository.existsBy({id: createCustomerCompanyDto.id})

        if (isCustomerCompanyExist)
            throw new BadRequestException("The customer company already exist!");

        const newCustomerCompany = {
            id: createCustomerCompanyDto.id,
            name: createCustomerCompanyDto.name,
            short_name: createCustomerCompanyDto.short_name,
            law_address: createCustomerCompanyDto.law_address,
            post_address: createCustomerCompanyDto.post_address,
            inn: createCustomerCompanyDto.inn,
            ogrn: createCustomerCompanyDto.ogrn,
            phone: createCustomerCompanyDto.phone,
        };

        const res = await this.customerCompanyRepository.save(newCustomerCompany);
        return {customerCompanyID: res.id}
    }

    async update(id: number, updateCustomerCompanyDto: UpdateCustomerCompanyDto) {
        const customerCompany = await this.customerCompanyRepository.findOneBy({id})

        if (!customerCompany)
            throw new NotFoundException("Customer company not found!")

        await this.customerCompanyRepository.update(customerCompany.id, {
            name: updateCustomerCompanyDto.name,
            short_name: updateCustomerCompanyDto.short_name,
            law_address: updateCustomerCompanyDto.law_address,
            post_address: updateCustomerCompanyDto.post_address,
            inn: updateCustomerCompanyDto.inn,
            ogrn: updateCustomerCompanyDto.ogrn,
            phone: updateCustomerCompanyDto.phone,
        });

        return this.customerCompanyRepository.findOne({
            where: {id},
        })
    }


    async findAll(findAllCustomerCompanyDto: FindAllPassportsDto) {
        const customerCompany = await this.customerCompanyRepository.find({
            // where: {request: {period_id: {id: findAllCustomerCompanyDto.period_id}}},
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
                customer_users: {
                    requests: {
                        passports: true
                    },
                },
            },
        })

        return customerCompany
    }
}
