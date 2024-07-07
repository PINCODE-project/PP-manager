import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerCompanyDto } from './create-customer-company.dto';

export class UpdateCustomerCompanyDto extends PartialType(CreateCustomerCompanyDto) {}
