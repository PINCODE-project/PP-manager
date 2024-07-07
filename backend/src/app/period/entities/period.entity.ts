import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {Passport} from "../../passport/entities/passport.entity";
import {Request} from "../../request/entities/request.entity"
import {Project} from "../../project/entities/project.entity";
import {ApiProperty} from "@nestjs/swagger";
@Entity()
export class Period {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    year: number;

    @Column()
    term: number;

    @OneToMany(() => Request, (request) => request.id, {nullable: true})
    @JoinColumn({name: 'requests'})
    requests: Request[]

    @OneToMany(() => Project, (project) => project.id, {nullable: true})
    @JoinColumn({name: 'projects'})
    projects: Project[]
}
