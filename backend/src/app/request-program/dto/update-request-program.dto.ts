import { PartialType } from "@nestjs/swagger";
import { CreateRequestProgramDto } from "./create-request-program.dto";

export class UpdateRequestProgramDto extends PartialType(CreateRequestProgramDto) {}
