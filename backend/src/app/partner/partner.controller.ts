import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { PartnerService } from "./partner.service";
import { ParsePassportsDto } from "./dto/parse-passports.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ParsePassportDto } from "./dto/parse-passport.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ParseRequestsDto } from "./dto/parse-requests.dto";
import { CreateReportDto } from "../teamproject/dto/create-report.dto";
import { CreateRequestReportDto } from "./dto/create-request-report.dto";
import { CreatePassportReportDto } from "./dto/create-passport-report.dto";

@ApiTags("partner")
@Controller("partner")
export class PartnerController {
    constructor(private readonly partnerService: PartnerService) {}

    @ApiBearerAuth()
    @Post("passport/parse")
    @UseGuards(JwtAuthGuard)
    async parsePassports(@Body() parsePassportsDto: ParsePassportsDto) {
        return this.partnerService.parsePassports(parsePassportsDto);
    }

    @ApiBearerAuth()
    @Post("passport/parse/:id")
    @UseGuards(JwtAuthGuard)
    parsePassport(@Param("id", ParseIntPipe) id: number, @Body() parsePassportDto: ParsePassportDto) {
        return this.partnerService.parseAndCreatePassport({ ...parsePassportDto, id });
    }

    @ApiBearerAuth()
    @Post("request/parse")
    @UseGuards(JwtAuthGuard)
    async parseRequests(@Body() parseRequestsDto: ParseRequestsDto) {
        return this.partnerService.parseRequests(parseRequestsDto);
    }

    @ApiBearerAuth()
    @Post("request/report")
    @UsePipes(new ValidationPipe())
    @UseGuards(JwtAuthGuard)
    createRequestReport(@Body() createRequestReportDto: CreateRequestReportDto) {
        return this.partnerService.createRequestReport(createRequestReportDto);
    }

    @ApiBearerAuth()
    @Post("passport/report")
    @UsePipes(new ValidationPipe())
    @UseGuards(JwtAuthGuard)
    createPassportReport(@Body() createPassportReportDto: CreatePassportReportDto) {
        return this.partnerService.createPassportReport(createPassportReportDto);
    }

    @ApiBearerAuth()
    @Get("token")
    @UseGuards(JwtAuthGuard)
    getTokens() {
        return this.partnerService.getTokens();
    }
}
