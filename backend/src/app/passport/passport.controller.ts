import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { PassportService } from "./passport.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UpdatePassportDto } from "./dto/update-passport.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { FindAllPassportsDto } from "./dto/find-all-passports.dto";
import { FindPassportsForStudentsDto } from "./dto/find-passports-for-students.dto";

@ApiTags("passport")
@Controller("passport")
export class PassportController {
    constructor(private readonly passportService: PassportService) {}

    @ApiBearerAuth()
    @Post("/")
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    findAll(@Body() findAllPassportsDto: FindAllPassportsDto) {
        return this.passportService.findAll(findAllPassportsDto);
    }

    @Get("/all/for-students/:period_id")
    @UsePipes(new ValidationPipe())
    findAllForStudents(@Param() findPassportsForStudentsDto: FindPassportsForStudentsDto) {
        return this.passportService.findAllForStudents(findPassportsForStudentsDto);
    }

    @ApiBearerAuth()
    @Get(":id")
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    findOne(@Param("id", ParseIntPipe) id: number) {
        return this.passportService.findOne({ id });
    }

    @ApiBearerAuth()
    @Patch(":id")
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    update(@Param("id", ParseIntPipe) id: number, @Body() updatePassportDto: UpdatePassportDto) {
        return this.passportService.update(id, updatePassportDto);
    }
}
