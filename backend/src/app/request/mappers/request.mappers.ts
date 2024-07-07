import {CreateRequestDto} from "../dto/create-request.dto";
import {UpdateRequestDto} from "../dto/update-request.dto";

enum Statuses {
    "Принята" = "ACPT",
    "Заявка опубликована" = "PUBL",
    "Отклонена" = "DCLN",
}

export namespace RequestMappers {
    /**
     * Маппинг данных из реста в Dto для создания заявки.
     * @param request
     */
    export function toCreateDto(request): CreateRequestDto {
        return {
            id: request.id,
            uid: request.uid,
            name: request.name,
            goal: request.goal,
            result: request.result,
            description: request.description,
            criteria: request.criteria,
            max_copies: request.max_copies,
            period_id: request.semester,
            status: request.statuses[0].text,
            date: request.date,
            customer_user_id: request.manager.id
        };
    }

    /**
     * Маппинг данных из реста в Dto для обновления заявки.
     * @param request
     */
    export function toUpdateDto(request): UpdateRequestDto {
        return {
            uid: request.uid,
            name: request.name,
            goal: request.goal,
            result: request.result,
            description: request.description,
            criteria: request.criteria,
            max_copies: request.max_copies,
            period_id: request.semester,
            status: request.statuses[0].text,
            date: request.date,
            customer_user_id: request.manager.id
        };
    }
}
