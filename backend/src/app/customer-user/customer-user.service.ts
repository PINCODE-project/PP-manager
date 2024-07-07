import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CustomerUser} from "./entities/customer-user.entity";
import {CreateCustomerUserDto} from "./dto/create-customer-user.dto";
import {UpdateProjectDto} from "../project/dto/update-project.dto";
import {UpdateCustomerUserDto} from "./dto/update-customer-user.dto";
import {FindAllPassportsDto} from "../passport/dto/find-all-passports.dto";

@Injectable()
export class CustomerUserService {
    constructor(
        @InjectRepository(CustomerUser)
        private readonly customerUserRepository: Repository<CustomerUser>,
    ) {
    }

    async isCreate(id: number) {
        const customerUser = await this.customerUserRepository.findOneBy({id})
        return !!customerUser;
    }

    async create(createCustomerUserDto: CreateCustomerUserDto) {
        const isCustomerUserExist = await this.customerUserRepository.existsBy({id: createCustomerUserDto.id})

        if (isCustomerUserExist)
            throw new BadRequestException("The customer company already exist!");

        const newCustomerUser = {
            id: createCustomerUserDto.id,
            username: createCustomerUserDto.username,
            email: createCustomerUserDto.email,
            first_name: createCustomerUserDto.first_name,
            last_name: createCustomerUserDto.last_name,
            middle_name: createCustomerUserDto.middle_name,
            phone: createCustomerUserDto.phone,
            qualification: createCustomerUserDto.qualification,
            customer_company: {id: createCustomerUserDto.customer_company_id}
        };

        try {
            const res = await this.customerUserRepository.save(newCustomerUser);
            return {customerUserID: res.id}
        } catch {
            delete newCustomerUser["customer_company"]
            const res = await this.customerUserRepository.save(newCustomerUser);
            return {customerUserID: res.id}
        }
    }

    async update(id: number, updateCustomerUserDto: UpdateCustomerUserDto) {
        const customerUser = await this.customerUserRepository.findOneBy({id})

        if (!customerUser)
            throw new NotFoundException("Customer user not found!")

        const updateCustomerUser = {
            id: updateCustomerUserDto.id,
            username: updateCustomerUserDto.username,
            email: updateCustomerUserDto.email,
            first_name: updateCustomerUserDto.first_name,
            last_name: updateCustomerUserDto.last_name,
            middle_name: updateCustomerUserDto.middle_name,
            phone: updateCustomerUserDto.phone,
            qualification: updateCustomerUserDto.qualification,
            customer_company: {id: updateCustomerUserDto.customer_company_id}
        };

        try {
            await this.customerUserRepository.update(customerUser.id, updateCustomerUser);
        } catch {
            delete updateCustomerUser["customer_company"]
            await this.customerUserRepository.update(customerUser.id, updateCustomerUser);
        }

        return this.customerUserRepository.findOne({
            where: {id},
        })
    }

    async findAll(findAllCustomerCompanyDto: FindAllPassportsDto) {
        const customerUsers = await this.customerUserRepository.find({
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
                requests: {
                    passports: true
                },
                customer_company: true
            },
        })

        return customerUsers
    }
}
