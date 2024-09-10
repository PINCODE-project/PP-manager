import { Injectable } from '@nestjs/common';
import { CreateRequestProgramDto } from './dto/create-request-program.dto';
import { UpdateRequestProgramDto } from './dto/update-request-program.dto';

@Injectable()
export class RequestProgramService {
  create(createRequestProgramDto: CreateRequestProgramDto) {
    return 'This action adds a new requestProgram';
  }

  findAll() {
    return `This action returns all requestProgram`;
  }

  findOne(id: number) {
    return `This action returns a #${id} requestProgram`;
  }

  update(id: number, updateRequestProgramDto: UpdateRequestProgramDto) {
    return `This action updates a #${id} requestProgram`;
  }

  remove(id: number) {
    return `This action removes a #${id} requestProgram`;
  }
}
