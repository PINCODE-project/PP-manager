import { Module } from "@nestjs/common";
import { RequestService } from "./request.service";
import { RequestController } from "./request.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Request } from "./entities/request.entity";
import { Tag } from "../tag/entities/tag.entity";
import { Passport } from "../passport/entities/passport.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Request, Tag, Passport])],
    controllers: [RequestController],
    providers: [RequestService],
})
export class RequestModule {}
