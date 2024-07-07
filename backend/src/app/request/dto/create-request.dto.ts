export class CreateRequestDto {
    id: number;
    uid: string;
    name: string;
    goal: string;
    result: string;
    description: string;
    criteria: string;
    max_copies: number;
    period_id: number;
    status: string;
    date: Date;
    customer_user_id: number;
}
