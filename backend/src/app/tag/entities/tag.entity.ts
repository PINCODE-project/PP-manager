import {Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Request} from "../../request/entities/request.entity";
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class Tag {
    @ApiProperty()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    text: string;

    @Column()
    color: string;

    @Column({default: true})
    is_track: boolean;

    @ManyToMany(() => Request, (request) => request.tags, {onDelete: "CASCADE"})
    requests: Request[]

    @OneToMany(() => Request, (request) => request.track, {nullable: true})
    requests_track: Request[];
}
