import { PartialType } from '@nestjs/mapped-types';
import { ParseTeamprojectDto } from './parse-teamproject.dto';

export class UpdateTeamprojectDto extends PartialType(ParseTeamprojectDto) {}
