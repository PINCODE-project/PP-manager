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
import { RequestService } from "./request.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UpdateRequestDto } from "./dto/update-request.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { FindAllRequestsDto } from "./dto/find-all-requests.dto";

@ApiTags("request")
@Controller("request")
export class RequestController {
    constructor(private readonly requestService: RequestService) {}

    @ApiBearerAuth()
    @Post("/")
    @UseGuards(JwtAuthGuard)
    findAll(@Body() findAllRequestsDto: FindAllRequestsDto) {
        return this.requestService.findAll(findAllRequestsDto);
    }

    @ApiBearerAuth()
    @Patch(":id")
    @UseGuards(JwtAuthGuard)
    update(@Param("id", ParseIntPipe) id: number, @Body() updateRequestDto: UpdateRequestDto) {
        return this.requestService.update(id, updateRequestDto);
    }
}
