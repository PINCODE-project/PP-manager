import SideBar from "../../../../components/SideBar/SideBar";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import React, {useEffect, useState} from "react";
import {App, Button, Select, Spin} from "antd";
import styles from './PartnersCutomerUsersPage.module.css'
import {removeProject} from "../../../../store/slices/projectSlice";
import {getAllCustomerUsers} from "../../../../store/slices/customerUsersSlice";
import {useCustomerUsers} from "../../../../hooks/use-customer-users";
import CustomerUsersTableSettings from "../../components/CustomerUsersTableSettings/CustomerUsersTableSettings";
import CustomerUsersTable from "../../components/CustomerUsersTable/CustomerUsersTable";
import {removeStudent} from "../../../../store/slices/studentSlice";
import {unauthorizedHandler} from "../../../../core/utils/unauthorizedHandler";
import { usePeriods } from "../../../../hooks/use-periods";
import { getAllPassports } from "../../../../store/slices/passportsSlice";
import { removePassport } from "../../../../store/slices/passportSlice";
import { getAllPeriods } from "../../../../store/slices/periodsSlice";

export const initialCustomerUsersTableColumns = [
    {
        key: 'name',
        name: 'ФИО',
    },
    {
        key: 'customer_company_name',
        name: 'Организация',
    },
    {
        key: 'email',
        name: 'Почта',
    },
    {
        key: 'phone',
        name: 'Телефон',
    },
    {
        key: 'qualification',
        name: 'Квалификация',
    },
    {
        key: 'requests_count',
        name: 'Количество заявок',
    },
]

export function PartnersCustomerUsersPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const {message} = App.useApp();

    const [isParseModalOpen, setIsParseModalOpen] = useState(false);
    const [isSettingsTableOpen, setIsSettingsTableOpen] = useState(false);
    const [customerUsersTable, setCustomerUsersTable] = useState([])
    const [customerUsersTableColumns, setCustomerUsersTableColumns] = useState(
        JSON.parse(localStorage.getItem("PP-manager-customer-users-columns")) ||
        initialCustomerUsersTableColumns
    )

    const [year, setYear] = useState(2024)
    const [term, setTerm] = useState(1)

    const periods = usePeriods()

    const handleChangeYear = (value) => {
        setYear(value)
    }

    const handleChangeTerm = (value) => {
        setTerm(value)
    }

    const customerUsers = useCustomerUsers()

    useEffect(() => {
        if (!periods.isLoading) {
            dispatch(getAllCustomerUsers({period_id: periods.periods.find(period => period.year === year && period.term === term).id}))
                .catch((error) => unauthorizedHandler(error, dispatch, message))
        }
    }, [periods, year, term]);

    useEffect(() => {
        dispatch(getAllPeriods())
            .catch((error) => unauthorizedHandler(error, dispatch, message))
        dispatch(removeProject())
        dispatch(removeStudent())
    }, []);

    useEffect(() => {
        setCustomerUsersTable(customerUsers.customerUsers.map(customerUser => ({
            id: customerUser.id,
            name: (customerUser.last_name || "") + " " + (customerUser.first_name || "") + " " + (customerUser.middle_name || ""),
            email: customerUser.email,
            phone: customerUser.phone,
            qualification: customerUser.qualification,
            requests_count: customerUser.requests.length,
            customer_company_name: customerUser.customer_company?.name ?? ""
        })))
    }, [customerUsers.customerUsers])

    return (
        <div className={styles.page}>
            <SideBar selectedKeys={["PartnersCustomerUsers"]}/>

            <h1 className={styles.title}>Представители заказчиков</h1>
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
                    <Button onClick={() => setIsSettingsTableOpen(true)} >
                        Настроить таблицу
                    </Button>
                </div>
            </div>

            {
                customerUsers.isLoading ?
                    <Spin/> :
                    <CustomerUsersTable customerUsers={customerUsersTable} columns={customerUsersTableColumns}/>
            }

            <CustomerUsersTableSettings
                isOpen={isSettingsTableOpen}
                setIsOpen={setIsSettingsTableOpen}

                tableColumns={customerUsersTableColumns}
                setTableColumns={setCustomerUsersTableColumns}
            />
        </div>
    )
}
