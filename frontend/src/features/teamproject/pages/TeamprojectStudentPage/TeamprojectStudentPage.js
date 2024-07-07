import SideBar from "../../../../components/SideBar/SideBar";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {App, Breadcrumb, Spin, Tag, Typography} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";
import styles from "./TeamprojectStudentPage.module.css"
import React, {useEffect} from "react";
import {getStudent} from "../../../../store/slices/studentSlice";
import {useStudent} from "../../../../hooks/use-student";
import ProjectDescription from "../../components/ProjectDescription/ProjectDescription";

const {Title} = Typography;


export function TeamprojectStudentPage() {
    const {id} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const {message} = App.useApp();
    const student = useStudent()

    useEffect(() => {
        dispatch(getStudent(id))
    }, []);

    if (student.isLoading)
        return (
            <div>
                <SideBar selectedKeys={["TeamprojectStudents"]}/>
                <Spin/>
            </div>
        )

    return (
        <div className={styles.page}>
            <SideBar selectedKeys={["TeamprojectStudents"]}/>
            <Breadcrumb items={[
                {
                    title: <a onClick={() => navigate(-1) || navigate("/teamproject/students")}><ArrowLeftOutlined/> Назад</a>//<Link to={"/teamproject/students"}><ArrowLeftOutlined/> Назад</Link>,
                }
            ]}/>

            <div className={styles.title__container}>
                <Title className={styles.title} level={3}>
                    {student.student.fullname}
                </Title>

                <div className={styles.tags}>
                    {
                        student.student.groupName &&
                        <Tag color="#108ee9">
                            {student.student.groupName}
                        </Tag>
                    }
                    {
                        student.student.phone &&
                        <Tag color="#b37feb">
                            {student.student.phone}
                        </Tag>
                    }
                    {
                        student.student.email &&
                        <Tag color="#b37feb">
                            {student.student.email}
                        </Tag>
                    }
                </div>
            </div>

            <div className={styles.projects}>
                {
                    student.student.projects.toSorted((a, b) => {
                        if(a.period.year < b.period.year)
                            return 1
                        if(a.period.year > b.period.year)
                            return -1
                        if(a.period.term < b.period.term)
                            return 1
                        if(a.period.term > b.period.term)
                            return -1
                        return 0
                    }).map(project => {
                        return <ProjectDescription project={project} type="student"/>
                    })
                }
            </div>
        </div>
    )
}
