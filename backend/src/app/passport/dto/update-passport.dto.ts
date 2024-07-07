import {PartialType} from '@nestjs/mapped-types';
import {CreatePassportDto} from "./create-passport.dto";
import {IsBoolean} from "class-validator";

export class UpdatePassportDto extends PartialType(CreatePassportDto) {
    is_visible?: boolean;
}
