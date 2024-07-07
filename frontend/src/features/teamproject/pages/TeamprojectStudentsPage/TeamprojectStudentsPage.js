import SideBar from "../../../../components/SideBar/SideBar";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import React, {useEffect, useState} from "react";
import {App, Button, Select, Spin} from "antd";
import styles from './TeamprojectStudentsPage.module.css'
import {removeProject} from "../../../../store/slices/projectSlice";
import StudentsTable from "../../components/StudentsTable/StudentsTable";
import StudentsTableSettings from "../../components/StudentsTableSettings/StudentsTableSettings";
import {removePassport} from "../../../../store/slices/passportSlice";
import {removeRequests} from "../../../../store/slices/requestsSlice";
import {getAllStudents, removeStudents} from "../../../../store/slices/studentsSlice";
import {useStudents} from "../../../../hooks/use-students";
import {usePeriods} from "../../../../hooks/use-periods";
import {getAllPeriods} from "../../../../store/slices/periodsSlice";
import {removeStudent} from "../../../../store/slices/studentSlice";
import {unauthorizedHandler} from "../../../../core/utils/unauthorizedHandler";

export const initialStudentsTableColumns = [
    {
        key: 'fullname',
        name: 'ФИО студента',
    },
    {
        key: 'phone',
        name: 'Телефон',
    },
    {
        key: 'email',
        name: 'Почта',
    },
    {
        key: 'groupName',
        name: 'Академическая группа',
    },
    {
        key: 'currentProject',
        name: 'Проект семестра',
    },
    {
        key: 'currentProjectPassportUid',
        name: 'Паспорт',
    },
    {
        key: 'currentProjectRequestUid',
        name: 'Заявка',
    },
    {
        key: 'currentProjectCurator',
        name: 'Куратор',
    },
    {
        key: 'expertsScore',
        name: 'Оценка комиссии',
    },
    {
        key: 'finalScore',
        name: 'Оценка студента',
    },
    {
        key: 'retakedScore',
        name: 'Пересдача',
    },
]

export function TeamprojectStudentsPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const {message} = App.useApp();

    const [isParseModalOpen, setIsParseModalOpen] = useState(false);
    const [isSettingsTableOpen, setIsSettingsTableOpen] = useState(false);
    const [editPassportId, setEditPassportId] = useState(null);
    const [studentsTable, setStudentsTable] = useState([])
    const [studentsTableColumns, setStudentsTableColumns] = useState(
        JSON.parse(localStorage.getItem("PP-manager-students-columns")) ||
        initialStudentsTableColumns
    )

    const [year, setYear] = useState(2023)
    const [term, setTerm] = useState(2)

    const handleChangeYear = (value) => {
        setYear(value)
    }

    const handleChangeTerm = (value) => {
        setTerm(value)
    }

    const students = useStudents()
    const periods = usePeriods()
    useEffect(() => {
        dispatch(removeStudents())
        if (!periods.isLoading) {
            dispatch(getAllStudents({period_id: periods.periods.find(period => period.year === year && period.term === term).id}))
                .catch((error) => unauthorizedHandler(error, dispatch, message))
        }
    }, [year, term, periods]);

    useEffect(() => {
        dispatch(getAllPeriods())
            .catch((error) => unauthorizedHandler(error, dispatch, message))
        dispatch(removePassport())
        dispatch(removeProject())
        dispatch(removeRequests())
        dispatch(removeStudent())
    }, []);

    useEffect(() => {
        setStudentsTable(students.students.map(student => {
            const projectResults = student.projects[0]?.students_result.find(result => result.studentId === student.id)
            return {
                id: student.id,
                fullname: student.fullname,
                phone: student.phone,
                email: student.email,
                groupName: student.groupName,
                currentProject: student.projects[0],
                currentProjectId: student.projects[0]?.id || "",
                currentProjectPassportId: student.projects[0]?.passport?.id || "",
                currentProjectPassportUid: student.projects[0]?.passport?.uid || "",
                currentProjectRequestId: student.projects[0]?.passport?.request?.id || "",
                currentProjectRequestUid: student.projects[0]?.passport?.request?.uid || "",
                currentProjectName: student.projects[0]?.name || "",
                currentProjectCurator: student.projects[0]?.curator || "",
                expertsScore: projectResults?.expertsScore,
                finalScore: projectResults?.finalScore,
                retakedScore: projectResults?.retakedScore,
            }
        }))
    }, [students])

    return (
        <div className={styles.page}>
            <SideBar selectedKeys={["TeamprojectStudents"]}/>

            <h1 className={styles.title}>Студенты</h1>
            <div className={styles.header}>
                <div className={styles.filters}>
                    <Select
                        defaultValue={2023}
                        onChange={handleChangeYear}
                        options={
                            [...new Set(periods.periods.map(period => period.year))].map(year => ({
                                value: year, label: `${year}/${year + 1}`
                            }))
                        }
                    />

                    <Select
                        defaultValue={2}
                        onChange={handleChangeTerm}
                        options={[
                            {value: 1, label: 'Осенний'},
                            {value: 2, label: 'Весенний'},
                        ]}
                    />
                </div>

                <div className={styles.buttons}>
                    <Button
                        onClick={() => setIsSettingsTableOpen(true)}
                    >
                        Настроить таблицу
                    </Button>
                </div>
            </div>

            {
                students.isLoading ?
                    <Spin/> :
                    <StudentsTable
                        students={studentsTable}
                        columns={studentsTableColumns}
                    />
            }

            <StudentsTableSettings
                isOpen={isSettingsTableOpen}
                setIsOpen={setIsSettingsTableOpen}

                tableColumns={studentsTableColumns}
                setTableColumns={setStudentsTableColumns}
            />
        </div>
    )
}
