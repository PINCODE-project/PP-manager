import {Controller, Param, Sse} from '@nestjs/common';
import {SSEService} from './sse.service';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {Observable} from 'rxjs';
import {EventData} from './interfaces/event-data.interface';
import {SSEEnum} from "./interfaces/sse-service.interface";
import {GetRequestProgressDto} from "./dto/get-request-progress.dto";

@ApiTags('sse')
@Controller('sse')
export class SSEController {
    constructor(private readonly sseService: SSEService) {
    }

    @ApiBearerAuth()
    @Sse('requests-progress/:event')
    sse(@Param() getRequestProgressDto: GetRequestProgressDto): Observable<EventData> {
        return this.sseService.getObservable(getRequestProgressDto.event);
    }
}
