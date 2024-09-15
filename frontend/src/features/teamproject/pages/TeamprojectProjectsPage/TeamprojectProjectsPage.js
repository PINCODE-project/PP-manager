import SideBar from "../../../../components/SideBar/SideBar";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { App, Button, Select, Spin, Tag } from "antd";
import ParseModal from "../../components/ParseModal/ParseModal";
import ProjectsTable from "../../components/ProjectsTable/ProjectsTable";
import styles from "./TeamprojectProjectsPage.module.css";
import { useProjects } from "../../../../hooks/use-projects";
import { getAllProjects } from "../../../../store/slices/projectsSlice";
import { removeProject } from "../../../../store/slices/projectSlice";
import ProjectsTableSettings from "../../components/ProjectsTableSettings/ProjectsTableSettings";
import { removeStudent } from "../../../../store/slices/studentSlice";
import { usePeriods } from "../../../../hooks/use-periods";
import { getAllPeriods } from "../../../../store/slices/periodsSlice";
import { unauthorizedHandler } from "../../../../core/utils/unauthorizedHandler";
import ExportButton from "../../components/ExportButton/ExportButton";
import { usePrograms } from "../../../../hooks/use-programs";
import { useDebouncedState } from "@mantine/hooks";
import { getAllPrograms } from "../../../../store/slices/programsSlice";

export const initialProjectsTableColumns = [
    {
        key: "passport_uid",
        name: "Паспорт",
    },
    {
        key: "name",
        name: "Название",
    },
    {
        key: "students",
        name: "Студенты",
    },
    {
        key: "curator",
        name: "Куратор",
    },
    {
        key: "isHaveReport",
        name: "Отчет",
    },
    {
        key: "isHavePresentation",
        name: "Презентация",
    },
    {
        key: "comissionScore",
        name: "Оценка комиссии",
    },
    {
        key: "status",
        name: "Статус",
    },
    {
        key: "programs",
        name: "Образовательные программы",
    },
];

export function TeamprojectProjectsPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { message } = App.useApp();
    // const teamproject = useTeamproject()

    const [isSettingsTableOpen, setIsSettingsTableOpen] = useState(false);
    const [isParseModalOpen, setIsParseModalOpen] = useState(false);

    const [year, setYear] = useState(2024);
    const [term, setTerm] = useState(1);
    const [selectedPrograms, setPrograms] = useState([]);
    const [debSelectedPrograms, setDebPrograms] = useDebouncedState([], 2000);

    const [projectsTable, setProjectsTable] = useState([]);
    const [projectsTableColumns, setProjectsTableColumns] = useState(
        JSON.parse(localStorage.getItem("PP-manager-projects-columns")) ||
        initialProjectsTableColumns,
    );

    const handleChangeYear = (value) => {
        setYear(value);
    };

    const handleChangeTerm = (value) => {
        setTerm(value);
    };

    const handleChangePrograms = (value) => {
        setPrograms(value);
        setDebPrograms(value);
    };

    const projects = useProjects();
    const periods = usePeriods();
    const programs = usePrograms();

    useEffect(() => {
        if (!periods.isLoading && !programs.isLoading) {
            dispatch(getAllProjects({
                period_id: periods.periods.find(period => period.year === year && period.term === term).id,
                programs: debSelectedPrograms,
            })).catch((error) => unauthorizedHandler(error, dispatch, message));
        }
    }, [year, term, periods, programs, debSelectedPrograms]);

    useEffect(() => {
        dispatch(getAllPeriods())
            .catch((error) => unauthorizedHandler(error, dispatch, message));
        dispatch(getAllPrograms()).then((resp) => {
            const bak = resp.payload.filter(program => program.program_level === "LBAK").map(program => program.program_id);
            setDebPrograms(bak);
            setPrograms(bak);
        }).catch((error) =>
            unauthorizedHandler(error, dispatch, message),
        );
        dispatch(removeProject());
        dispatch(removeStudent());
    }, []);

    useEffect(() => {
        setProjectsTable(projects.projects.map(project => ({
            id: project.id,
            name: project.name,
            passport_id: project.passport?.id,
            passport_uid: project.passport?.uid,
            students: project.students,
            students_name: project.students.map(student => student.fullname),
            curator: project.curator,
            isHaveReport: project.isHaveReport,
            isHavePresentation: project.isHavePresentation,
            comissionScore: project.comissionScore,
            status: project.status,
            programs: project.passport.request.programs.map((program) => program.program),
            programs_search: project.passport.request.programs.map((program) => `${program.program.uid} ${program.program.name}`).join(" "),
        })));
    }, [projects]);

    return (
        <div className={ styles.page } >
            <SideBar selectedKeys={ ["TeamprojectProjects"] } />

            <h1 className={ styles.title } >Проекты</h1 >
            <div className={ styles.header } >
                <div className={ styles.filters } >
                    <Select
                        defaultValue={ 2024 }
                        onChange={ handleChangeYear }
                        options={
                            [...new Set(periods.periods.map(period => period.year))].map(year => ({
                                value: year, label: `${ year }/${ year + 1 }`,
                            }))
                        }
                    />

                    <Select
                        defaultValue={ 1 }
                        onChange={ handleChangeTerm }
                        options={ [
                            { value: 1, label: "Осенний" },
                            { value: 2, label: "Весенний" },
                        ] }
                    />

                    <Select
                        mode="multiple"
                        style={ { width: "300px" } }
                        onChange={ handleChangePrograms }
                        disabled={ programs.isLoading }
                        value={ selectedPrograms }
                        options={ [
                            {
                                label: <span >Бакалавриат</span >,
                                title: "Бакалавриат",
                                options: programs.isLoading ? [] : programs.programs.filter(program => program.program_level === "LBAK").map((program) => (
                                    {
                                        value: program.program_id,
                                        label: `${ program.program_uid } ${ program.program_name }`,
                                    }
                                )),
                            },
                            {
                                label: <span >Магистратура</span >,
                                title: "Магистратура",
                                options: programs.isLoading ? [] : programs.programs.filter(program => program.program_level === "LMAG").map((program) => (
                                    {
                                        value: program.program_id,
                                        label: `${ program.program_uid } ${ program.program_name }`,
                                    }
                                )),
                            },
                        ] }
                        maxTagCount={ 1 }
                        placeholder="Образовательные программы"
                        tagRender={ () => <Tag >Образовательные программы</Tag > }
                        optionFilterProp="label"
                        allowClear
                    />
                </div >

                <div className={ styles.buttons } >
                    <Button
                        onClick={ () => setIsParseModalOpen(true) }
                    >
                        Обновить данные
                    </Button >
                    {
                        periods.isLoading ?
                            <Spin /> :
                            <ExportButton
                                periodId={ periods.periods.find(period => period.year === year && period.term === term).id } />
                    }
                    <Button
                        onClick={ () => setIsSettingsTableOpen(true) }
                    >
                        Настроить таблицу
                    </Button >
                </div >
            </div >

            {
                projects.isLoading ?
                    <Spin /> :
                    <ProjectsTable projects={ projectsTable } columns={ projectsTableColumns } />
            }

            <ProjectsTableSettings
                isOpen={ isSettingsTableOpen }
                setIsOpen={ setIsSettingsTableOpen }

                tableColumns={ projectsTableColumns }
                setTableColumns={ setProjectsTableColumns }
            />
            <ParseModal isOpen={ isParseModalOpen } setIsOpen={ setIsParseModalOpen } />
        </div >
    );
}
