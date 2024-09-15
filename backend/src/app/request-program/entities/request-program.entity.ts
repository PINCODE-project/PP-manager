import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Request } from "../../request/entities/request.entity";
import { Program } from "../../program/entities/program.entity";

@Entity()
export class RequestProgram {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Request, (request) => request.id, { nullable: true })
    @JoinColumn({ name: "request" })
    request: Request;

    @ManyToOne(() => Program, (program) => program.id, { nullable: true })
    @JoinColumn({ name: "program" })
    program: Program;
}
