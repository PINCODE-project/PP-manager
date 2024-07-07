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

    const [year, setYear] = useState(2023)
    const [term, setTerm] = useState(1)

    const handleChangeYear = (value) => {
        setYear(value)
    }

    const handleChangeTerm = (value) => {
        setTerm(value)
    }

    const customerUsers = useCustomerUsers()

    useEffect(() => {
        dispatch(getAllCustomerUsers({period_id: 8}))
            .catch((error) => unauthorizedHandler(error, dispatch, message))
    }, [year, term]);

    useEffect(() => {
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
                        defaultValue={2023}
                        onChange={handleChangeYear}
                        options={[
                            {value: 2023, label: '2023/2024'},
                            {value: 2022, label: '2022/2023'},
                            {value: 2021, label: '2021/2022'},
                            {value: 2020, label: '2020/2021'},
                            {value: 2019, label: '2019/2020'},
                            {value: 2018, label: '2018/2019'},
                        ]}
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

                {/*<div className={styles.buttons}>*/}
                {/*    <Button*/}
                {/*        type="primary"*/}
                {/*        onClick={() => setIsParseModalOpen(true)}*/}
                {/*    >*/}
                {/*        Обновить информацию*/}
                {/*    </Button>*/}
                {/*</div>*/}

                <div className={styles.buttons}>
                    <Button
                        onClick={() => setIsSettingsTableOpen(true)}
                    >
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
