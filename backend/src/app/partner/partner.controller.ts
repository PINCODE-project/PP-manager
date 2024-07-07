import {Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import {PartnerService} from './partner.service';
import {ParsePassportsDto} from "./dto/parse-passports.dto";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {ParsePassportDto} from "./dto/parse-passport.dto";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {ParseRequestsDto} from "./dto/parse-requests.dto";

@ApiTags('partner')
@Controller('partner')
export class PartnerController {
    constructor(private readonly partnerService: PartnerService) {
    }

    @ApiBearerAuth()
    @Post("passport/parse")
    @UseGuards(JwtAuthGuard)
    async parsePassports(@Body() parsePassportsDto: ParsePassportsDto) {
        const tokens = await this.partnerService.getTokens();
        return this.partnerService.parsePassports({...tokens, ...parsePassportsDto});
    }

    @ApiBearerAuth()
    @Post("passport/parse/:id")
    @UseGuards(JwtAuthGuard)
    parsePassport(@Param('id', ParseIntPipe) id: number, @Body() parsePassportDto: ParsePassportDto) {
        return this.partnerService.parseAndCreatePassport({...parsePassportDto, id});
    }

    @ApiBearerAuth()
    @Post("request/parse")
    @UseGuards(JwtAuthGuard)
    async parseRequest(@Body() parseRequestsDto: ParseRequestsDto) {
        const tokens = await this.partnerService.getTokens();
        return this.partnerService.parseRequests({...tokens, ...parseRequestsDto});
    }

    @ApiBearerAuth()
    @Post("request/report")
    @UsePipes(new ValidationPipe())
    @UseGuards(JwtAuthGuard)
    createRequestReport() {
        return this.partnerService.createRequestReport();
    }

    @ApiBearerAuth()
    @Post("passport/report")
    @UsePipes(new ValidationPipe())
    @UseGuards(JwtAuthGuard)
    createPassportReport() {
        return this.partnerService.createPassportReport();
    }

    @ApiBearerAuth()
    @Get("token")
    @UseGuards(JwtAuthGuard)
    getTokens() {
        return this.partnerService.getTokens();
    }
}
