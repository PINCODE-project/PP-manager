import {Module} from '@nestjs/common';
import {PeriodService} from './period.service';
import {PeriodController} from './period.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Period} from "./entities/period.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Period])],
    controllers: [PeriodController],
    providers: [PeriodService],
})
export class PeriodModule {
}
