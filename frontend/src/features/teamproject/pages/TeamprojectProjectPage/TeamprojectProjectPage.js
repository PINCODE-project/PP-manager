import SideBar from "../../../../components/SideBar/SideBar";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {App, Breadcrumb, Descriptions, Spin, Tag, Typography} from "antd";
import {useTeamproject} from "../../../../hooks/use-teamproject";
import {ArrowLeftOutlined, FundProjectionScreenOutlined} from "@ant-design/icons";
import styles from "./TeamprojectProjectPage.module.css"
import React, {useEffect} from "react";
import {useProject} from "../../../../hooks/use-project";
import {getProject} from "../../../../store/slices/projectSlice";
import ProjectDescription from "../../components/ProjectDescription/ProjectDescription";
import ProjectStudentsScore from "../../components/ProjectStudentsScore/ProjectStudentsScore";

const {Title} = Typography;

export function TeamprojectProjectPage() {
    const {id} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const {message} = App.useApp();
    const project = useProject()

    useEffect(() => {
        dispatch(getProject({id}))
    }, [])

    console.log(project)
    if (project.isLoading)
        return (
            <div>
                <SideBar selectedKeys={["TeamprojectProjects"]}/>
                <Spin/>
            </div>
        )

    return (
        <div className={styles.page}>
            <SideBar selectedKeys={["TeamprojectProjects"]}/>
            <Breadcrumb items={[
                {
                    title: <a onClick={() => navigate(-1) || navigate("/teamproject/projects")}><ArrowLeftOutlined/> Назад</a>//<Link to={"/teamproject/projects"}></Link>,
                }
            ]}/>

            <ProjectDescription project={project.project} type="project"/>
            <ProjectStudentsScore project={project.project}/>
        </div>
    )
}
