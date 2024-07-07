import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerUserDto } from './create-customer-user.dto';

export class UpdateCustomerUserDto extends PartialType(CreateCustomerUserDto) {}
