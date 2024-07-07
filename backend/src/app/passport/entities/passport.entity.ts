import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    PrimaryGeneratedColumn
} from "typeorm";
import {Course} from "../../course/entities/course.entity";
import {Request} from "../../request/entities/request.entity";
import {Project} from "../../project/entities/project.entity";
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class Passport {
    @ApiProperty()
    @PrimaryColumn()
    id: number;

    @ApiProperty()
    @Column({unique: true})
    uid: string;

    @ApiProperty()
    @Column({nullable: true})
    short_name: string;

    @ApiProperty()
    @Column({nullable: true})
    diploma_name: string;

    @ApiProperty()
    @Column({nullable: true})
    date: Date;

    @ApiProperty()
    @Column({nullable: true})
    team_count: number;

    @ApiProperty()
    @Column({nullable: true})
    students_count: number;

    @ApiProperty()
    @Column({nullable: true})
    status: string;

    @ApiProperty()
    @Column({nullable: true})
    kind: string;

    @ApiProperty()
    @Column({default: true})
    is_visible: boolean;

    @ManyToOne(() => Request, (request) => request.id, {nullable: true})
    @JoinColumn({name: 'request'})
    request: Request;

    @OneToMany(() => Project, (project) => project.passport, {nullable: true})
    projects: Project[];

    @ManyToMany(() => Course, (course) => course.passports, {onDelete: "CASCADE"})
    @JoinTable({
        name: "passport_course", joinColumn: {
            name: 'passport_id',
            referencedColumnName: 'id',
        }, inverseJoinColumn: {
            name: 'course_id',
            referencedColumnName: 'id',
        },
    })
    course: Course[]
}
