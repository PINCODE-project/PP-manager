import {Module} from '@nestjs/common';
import {CustomerUserService} from './customer-user.service';
import {CustomerUserController} from './customer-user.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {CustomerUser} from "./entities/customer-user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([CustomerUser])],
    controllers: [CustomerUserController],
    providers: [CustomerUserService],
})
export class CustomerUserModule {
}
