import {Injectable} from '@nestjs/common';
import {Cron, CronExpression} from "@nestjs/schedule";
import {ConfigService} from "@nestjs/config";
import {PartnerService} from "../partner/partner.service";

@Injectable()
export class SheduleManagerService {
    constructor(
        private readonly configService: ConfigService,
        private readonly partnerService: PartnerService
    ) {
    }

    @Cron(CronExpression.EVERY_2_HOURS)
    async handleCron() {
        if(this.configService.get("NODE_ENV") === "PRODUCTION") {
            const tokens = await this.partnerService.getTokens();
            await this.partnerService.parseRequests({...tokens, period_id: 8});
            await this.partnerService.parsePassports({...tokens, period_id: 8});
        }
    }
}
