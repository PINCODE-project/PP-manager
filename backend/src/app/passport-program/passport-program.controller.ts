import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { PassportProgramService } from "./passport-program.service";
import { CreatePassportProgramDto } from "./dto/create-passport-program.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("passport-program")
@Controller("passport-program")
export class PassportProgramController {
    constructor(private readonly passportProgramService: PassportProgramService) {}

    @Post()
    create(@Body() dto: CreatePassportProgramDto) {
        return this.passportProgramService.create(dto);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get("/programs")
    findAllPrograms() {
        return this.passportProgramService.findAllPrograms();
    }
}
