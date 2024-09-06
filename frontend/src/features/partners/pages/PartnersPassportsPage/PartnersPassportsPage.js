import SideBar from "../../../../components/SideBar/SideBar";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import React, {useEffect, useState} from "react";
import {App, Button, Select, Spin} from "antd";
import styles from './PartnersPassportsPage.module.css'
import {removeProject} from "../../../../store/slices/projectSlice";
import {getAllPassports} from "../../../../store/slices/passportsSlice";
import {usePassports} from "../../../../hooks/use-passports";
import PassportsTable from "../../components/PassportsTable/PassportsTable";
import PassportsTableSettings from "../../components/PassportsTableSettings/PassportsTableSettings";
import {removePassport} from "../../../../store/slices/passportSlice";
import {removeRequests} from "../../../../store/slices/requestsSlice";
import {removeStudent} from "../../../../store/slices/studentSlice";
import {getAllPeriods} from "../../../../store/slices/periodsSlice";
import {usePeriods} from "../../../../hooks/use-periods";
import {unauthorizedHandler} from "../../../../core/utils/unauthorizedHandler";
import PassportParseModal from "../../components/PassportParseModal/PassportParseModal";

export const initialPassportsTableColumns = [
    {
        key: 'uid',
        name: 'Номер паспорта',
    },
    {
        key: 'date',
        name: 'Дата паспорта',
    },
    {
        key: 'request_uid',
        name: 'Номер заявки',
    },
    {
        key: 'request_date',
        name: 'Дата заявки',
    },
    {
        key: 'short_name',
        name: 'Название',
    },
    {
        key: 'tags',
        name: 'Теги',
    },
    {
        key: 'kind',
        name: 'Тип проекта',
    },
    {
        key: 'request_goal',
        name: 'Цель',
    },
    {
        key: 'request_result',
        name: 'Результат',
    },
    {
        key: 'request_description',
        name: 'Описание',
    },
    {
        key: 'request_criteria',
        name: 'Критерии оценивания',
    },
    {
        key: 'status',
        name: 'Статус',
    },
    {
        key: 'course',
        name: 'Курсы',
    },
    {
        key: 'customer_company_name',
        name: 'Заказчик',
    },
    {
        key: 'customer_name',
        name: 'Представитель заказчика',
    },
    {
        key: 'available_seats_number',
        name: 'Количество мест',
    },
    {
        key: 'is_visible',
        name: 'Виден студентам',
    },
]

export function PartnersPassportsPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const {message} = App.useApp();

    const [isParseModalOpen, setIsParseModalOpen] = useState(false);
    const [isSettingsTableOpen, setIsSettingsTableOpen] = useState(false);
    const [isPassportEditOpen, setIsPassportEditOpen] = useState(false);
    const [editPassportId, setEditPassportId] = useState(null);
    const [passportsTable, setPassportsTable] = useState([])
    const [passportsTableColumns, setPassportsTableColumns] = useState(
        JSON.parse(localStorage.getItem("PP-manager-passport-columns")) ||
        initialPassportsTableColumns
    )

    const [year, setYear] = useState(2024)
    const [term, setTerm] = useState(1)

    const handleChangeYear = (value) => {
        setYear(value)
    }

    const handleChangeTerm = (value) => {
        setTerm(value)
    }

    const passports = usePassports()
    const periods = usePeriods()

    useEffect(() => {
        if (!isPassportEditOpen && !periods.isLoading) {
            dispatch(getAllPassports({period_id: periods.periods.find(period => period.year === year && period.term === term).id}))
                .catch((error) => unauthorizedHandler(error, dispatch, message))
            dispatch(removePassport())
        }
    }, [year, term, isPassportEditOpen, periods]);

    useEffect(() => {
        dispatch(getAllPeriods())
            .catch((error) => unauthorizedHandler(error, dispatch, message))
        dispatch(removeProject())
        dispatch(removeRequests())
        dispatch(removeStudent())
    }, []);

    useEffect(() => {
        setPassportsTable(passports.passports.map(passport => ({
            id: passport.id,
            uid: passport.uid,
            short_name: passport.short_name || passport.request.name,
            is_name_from_request: !!!passport.short_name,
            diploma_name: passport.diploma_name,
            date: new Date(Date.parse(passport.date)),
            date_string: new Date(Date.parse(passport.date)).toLocaleDateString(),
            kind: passport.kind,
            status: passport.status,
            available_seats_number: passport.team_count * passport.students_count,
            team_count: passport.team_count,
            students_count: passport.students_count,
            request_id: passport.request.id,
            request_uid: passport.request.uid,
            request_date: new Date(Date.parse(passport.request.date)),
            request_date_string: new Date(Date.parse(passport.request.date)).toLocaleDateString(),
            request_goal: passport.request.goal,
            request_result: passport.request.result,
            request_description: passport.request.description,
            request_criteria: passport.request.criteria,
            course: passport.course,
            period: passport.request.period_id,
            customer_id: passport.request.customer_user.id,
            customer_name: (passport.request.customer_user.last_name || "") + " " + (passport.request.customer_user.first_name || "") + " " + (passport.request.customer_user.middle_name || ""),
            customer_first_name: passport.request.customer_user.first_name,
            customer_last_name: passport.request.customer_user.last_name,
            customer_middle_name: passport.request.customer_user.middle_name,
            customer_company_name: passport.request.customer_user.customer_company.name,
            tags: passport.request.tags,
            is_visible: passport.is_visible
        })))
    }, [passports])

    return (
        <div className={styles.page}>
            <SideBar selectedKeys={["PartnersPassports"]}/>

            <h1 className={styles.title}>Паспорта</h1>
            <div className={styles.header}>
                <div className={styles.filters}>
                    <Select
                        defaultValue={2024}
                        onChange={handleChangeYear}
                        options={
                            [...new Set(periods.periods.map(period => period.year))].map(year => ({
                                value: year, label: `${year}/${year + 1}`
                            }))
                        }
                    />

                    <Select
                        defaultValue={1}
                        onChange={handleChangeTerm}
                        options={[
                            {value: 1, label: 'Осенний'},
                            {value: 2, label: 'Весенний'},
                        ]}
                    />
                </div>


                <div className={styles.buttons}>
                    <Button onClick={() => setIsParseModalOpen(true)}>
                        Обновить информацию
                    </Button>
                    <Button onClick={() => setIsSettingsTableOpen(true)}>
                        Настроить таблицу
                    </Button>
                </div>
            </div>

            {
                passports.isLoading ?
                    <Spin/> :
                    <PassportsTable
                        defaultPassports={passports}
                        passports={passportsTable}
                        columns={passportsTableColumns}
                        setIsPassportEditOpen={setIsPassportEditOpen}
                        setEditPassportId={setEditPassportId}
                    />
            }

            <PassportsTableSettings
                isOpen={isSettingsTableOpen}
                setIsOpen={setIsSettingsTableOpen}

                tableColumns={passportsTableColumns}
                setTableColumns={setPassportsTableColumns}
            />
            <PassportParseModal isOpen={isParseModalOpen} setIsOpen={setIsParseModalOpen}/>
        </div>
    )
}
