import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { RequestProgramService } from "./request-program.service";
import { CreateRequestProgramDto } from "./dto/create-request-program.dto";
import { UpdateRequestProgramDto } from "./dto/update-request-program.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("request-program")
@Controller("request-program")
export class RequestProgramController {
    constructor(private readonly requestProgramService: RequestProgramService) {}

    @Post()
    create(@Body() createRequestProgramDto: CreateRequestProgramDto) {
        return this.requestProgramService.create(createRequestProgramDto);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get("/programs")
    findAllPrograms() {
        return this.requestProgramService.findAllPrograms();
    }

    // @Get()
    // findAll() {
    //     return this.requestProgramService.findAll();
    // }
    //
    // @Get(":id")
    // findOne(@Param("id") id: string) {
    //     return this.requestProgramService.findOne(+id);
    // }
    //
    // @Patch(":id")
    // update(@Param("id") id: string, @Body() updateRequestProgramDto: UpdateRequestProgramDto) {
    //     return this.requestProgramService.update(+id, updateRequestProgramDto);
    // }
    //
    // @Delete(":id")
    // remove(@Param("id") id: string) {
    //     return this.requestProgramService.remove(+id);
    // }
}
