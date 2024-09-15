import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiTags } from "@nestjs/swagger";
import { FindAllProjectsDto } from "./dto/find-all-projects.dto";

@ApiTags("project")
@Controller("project")
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    findAll(@Body() findAllProjectDto: FindAllProjectsDto) {
        return this.projectService.findAll(findAllProjectDto);
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    findOne(@Param("id") id: string) {
        return this.projectService.findOne(id);
    }
}
