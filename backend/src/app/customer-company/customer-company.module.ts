import {Module} from '@nestjs/common';
import {CustomerCompanyService} from './customer-company.service';
import {CustomerCompanyController} from './customer-company.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {CustomerCompany} from "./entities/customer-company.entity";

@Module({
    imports: [TypeOrmModule.forFeature([CustomerCompany])],
    controllers: [CustomerCompanyController],
    providers: [CustomerCompanyService],
})
export class CustomerCompanyModule {
}
