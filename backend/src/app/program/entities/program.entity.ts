import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { RequestProgram } from "../../request-program/entities/request-program.entity";

@Entity()
export class Program {
    @ApiProperty()
    @PrimaryColumn()
    id: number;

    @Column()
    uid: string;

    @Column()
    uuid: string;

    @Column()
    name: string;

    @Column()
    level: string;

    @Column()
    ugn: number;

    @Column()
    institute_id: number;

    @Column()
    institute_name: string;

    @Column()
    area_id: number;

    @Column()
    area_uid: string;

    @Column()
    area_name: string;

    @Column({ nullable: true })
    head_id: number;

    @OneToMany(() => RequestProgram, (requestProgram) => requestProgram.request, { nullable: true })
    @JoinColumn({ name: "request_program" })
    requests: RequestProgram[];
}
