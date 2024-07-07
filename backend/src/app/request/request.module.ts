import {Module} from '@nestjs/common';
import {RequestService} from './request.service';
import {RequestController} from './request.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Request} from "./entities/request.entity";
import {Tag} from "../tag/entities/tag.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Request, Tag])],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}
