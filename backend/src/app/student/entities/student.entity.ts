import {Column, Entity, JoinColumn, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {Request} from "../../request/entities/request.entity";
import {Project} from "../../project/entities/project.entity";
import {StudentProjectResult} from "../../student-project-results/entities/student-project-result.entity";
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class Student {
    @ApiProperty()
    @PrimaryColumn()
    id: number;

    @Column()
    fullname: string;

    @Column({nullable: true})
    phone: string;

    @Column({nullable: true})
    email: string;

    @Column()
    groupName: string;

    @ManyToMany(() => Project, (project) => project.students, {onDelete: "CASCADE"})
    projects: Project[]

    @OneToMany(() => StudentProjectResult, (studentProjectResult) => studentProjectResult.student, {nullable: true})
    projects_result: StudentProjectResult[]
}
