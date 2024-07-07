import SideBar from "../../../../components/SideBar/SideBar";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import React, {useEffect, useState} from "react";
import {App, Button, Select, Spin} from "antd";
import styles from './PartnersCutomerCompaniesPage.module.css'
import {removeProject} from "../../../../store/slices/projectSlice";
import {getAllPassports} from "../../../../store/slices/passportsSlice";
import {usePassports} from "../../../../hooks/use-passports";
import PassportsTable from "../../components/PassportsTable/PassportsTable";
import PassportsTableSettings from "../../components/PassportsTableSettings/PassportsTableSettings";
import {useCustomerCompanies} from "../../../../hooks/use-customer-companies";
import {getAllCustomerCompanies} from "../../../../store/slices/customerCompaniesSlice";
import CustomerCompaniesTable from "../../components/CustomerCompaniesTable/CustomerCompaniesTable";
import CustomerCompaniesTableSettings
    from "../../components/CustomerCompaniesTableSettings/CustomerCompaniesTableSettings";
import {removeStudent} from "../../../../store/slices/studentSlice";
import {unauthorizedHandler} from "../../../../core/utils/unauthorizedHandler";

export const initialCustomerCompaniesTableColumns = [
    {
        key: 'name',
        name: 'Заказчик',
    },
    {
        key: 'law_address',
        name: 'Адрес',
    },
    {
        key: 'inn',
        name: 'ИНН',
    },
    {
        key: 'ogrn',
        name: 'ОГРН',
    },
    {
        key: 'phone',
        name: 'Телефон',
    },
    {
        key: 'customer_users_count',
        name: 'Количество представителей',
    },
    {
        key: 'requests_count',
        name: 'Количество заявок',
    },
]

export function PartnersCustomerCompaniesPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const {message} = App.useApp();

    const [isParseModalOpen, setIsParseModalOpen] = useState(false);
    const [isSettingsTableOpen, setIsSettingsTableOpen] = useState(false);
    const [customerCompaniesTable, setCustomerCompaniesTable] = useState([])
    const [customerCompaniesTableColumns, setCustomerCompaniesTableColumns] = useState(
        JSON.parse(localStorage.getItem("PP-manager-customer-companies-columns")) ||
        initialCustomerCompaniesTableColumns
    )

    const [year, setYear] = useState(2023)
    const [term, setTerm] = useState(1)

    const handleChangeYear = (value) => {
        setYear(value)
    }

    const handleChangeTerm = (value) => {
        setTerm(value)
    }

    const customerCompanies = useCustomerCompanies()

    useEffect(() => {
        dispatch(getAllCustomerCompanies({period_id: 8}))
            .catch((error) => unauthorizedHandler(error, dispatch, message))

    }, [year, term]);

    useEffect(() => {
        dispatch(removeProject())
        dispatch(removeStudent())
    }, []);

    useEffect(() => {
        setCustomerCompaniesTable(customerCompanies.customerCompanies.map(customerCompany => ({
            id: customerCompany.id,
            name: customerCompany.name,
            law_address: customerCompany.law_address,
            inn: customerCompany.inn,
            ogrn: customerCompany.ogrn,
            phone: customerCompany.phone,
            customer_users_count: customerCompany.customer_users.length,
            requests_count: customerCompany.customer_users.reduce((accumulator, currentValue) => accumulator + currentValue.requests.length, 0)
        })))
    }, [customerCompanies.customerCompanies])

    return (
        <div className={styles.page}>
            <SideBar selectedKeys={["PartnersCustomerCompanies"]}/>

            <h1 className={styles.title}>Заказчики</h1>
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
                customerCompanies.isLoading ?
                    <Spin/> :
                    <CustomerCompaniesTable customerCompanies={customerCompaniesTable} columns={customerCompaniesTableColumns}/>
            }

            <CustomerCompaniesTableSettings
                isOpen={isSettingsTableOpen}
                setIsOpen={setIsSettingsTableOpen}

                tableColumns={customerCompaniesTableColumns}
                setTableColumns={setCustomerCompaniesTableColumns}
            />
        </div>
    )
}
