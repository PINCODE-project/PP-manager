import { Controller } from '@nestjs/common';
import { SheduleManagerService } from './shedule-manager.service';

@Controller('shedule-manager')
export class SheduleManagerController {
  constructor(private readonly sheduleManagerService: SheduleManagerService) {}
}
