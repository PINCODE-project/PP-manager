import SideBar from "../../../../components/SideBar/SideBar";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import React, {useEffect, useState} from "react";
import {App, Button, Select, Spin} from "antd";
import styles from './PartnersRequestsPage.module.css'
import {removeProject} from "../../../../store/slices/projectSlice";
import RequestsTableSettings from "../../components/RequestsTableSettings/RequestsTableSettings";
import {useRequests} from "../../../../hooks/use-requests";
import {getAllRequests, setEditedRequests, setEditRequests, setRequests} from "../../../../store/slices/requestsSlice";
import RequestsTable from "../../components/RequestsTable/RequestsTable";
import {removePassports} from "../../../../store/slices/passportsSlice";
import {updateRequest} from "../../../../store/slices/requestSlice";
import {removeStudent} from "../../../../store/slices/studentSlice";
import {usePeriods} from "../../../../hooks/use-periods";
import {getAllPeriods} from "../../../../store/slices/periodsSlice";
import {unauthorizedHandler} from "../../../../core/utils/unauthorizedHandler";

export const initialRequestsTableColumns = [
    {
        key: 'uid',
        name: 'Номер',
    },
    {
        key: 'date',
        name: 'Дата',
    },
    {
        key: 'name',
        name: 'Название',
    },
    {
        key: 'goal',
        name: 'Цель',
    },
    {
        key: 'result',
        name: 'Результат',
    },
    {
        key: 'description',
        name: 'Описание',
    },
    {
        key: 'criteria',
        name: 'Критерии оценивания',
    },
    {
        key: 'status',
        name: 'Статус',
    },
    {
        key: 'track',
        name: 'Трек',
    },
    {
        key: 'tags',
        name: 'Теги',
    },
    {
        key: 'students_count',
        name: 'Количество студентов',
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
        key: 'max_copies',
        name: 'Максимальное количество копий',
    },
]

export function PartnersRequestsPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const {message} = App.useApp();

    const [isSettingsTableOpen, setIsSettingsTableOpen] = useState(false);
    const [requestsTable, setRequestsTable] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [requestsTableColumns, setRequestsTableColumns] = useState(
        JSON.parse(localStorage.getItem("PP-manager-requests-columns")) ||
        initialRequestsTableColumns
    )

    const [year, setYear] = useState(2023)
    const [term, setTerm] = useState(2)

    const handleChangeYear = (value) => {
        setYear(value)
    }

    const handleChangeTerm = (value) => {
        setTerm(value)
    }

    const requests = useRequests()
    const periods = usePeriods()

    useEffect(() => {
        if(!periods.isLoading) {
            dispatch(getAllRequests({period_id: periods.periods.find(period => period.year === year && period.term === term).id}))
                .catch((error) => unauthorizedHandler(error, dispatch, message))
        }
    }, [year, term, periods]);

    useEffect(() => {
        dispatch(getAllPeriods())
            .catch((error) => unauthorizedHandler(error, dispatch, message))
        dispatch(removeProject())
        dispatch(removePassports())
        dispatch(removeStudent())
    }, []);

    useEffect(() => {
        const parsedRequestsTable = requests.requests.map(request => ({
            id: request.id,
            uid: request.uid,
            name: request.name,
            goal: request.goal,
            result: request.result,
            description: request.description,
            criteria: request.criteria,
            date: new Date(Date.parse(request.date)),
            date_string: new Date(Date.parse(request.date)).toLocaleDateString(),
            max_copies: request.max_copies,
            status: request.status,
            period: request.period_id,
            tags: request.tags,
            track: request.track,
            customer_id: request.customer_user.id,
            customer_name: (request.customer_user.first_name || "") + " " + (request.customer_user.last_name || "") + " " + (request.customer_user.middle_name || ""),
            customer_first_name: request.customer_user.first_name,
            customer_last_name: request.customer_user.last_name,
            customer_middle_name: request.customer_user.middle_name,
            customer_company_name: request.customer_user.customer_company.name,
            students_count: request.students_count
        }))
        setRequestsTable(parsedRequestsTable);
        dispatch(setEditRequests(parsedRequestsTable));
    }, [requests.requests])

     const saveRequests = async () => {
        if (!isLoading) {
            setIsLoading(true);
            message.loading({content: "Сохраняю заявки...", key: 'updateRequests', duration: 0})

            for (let editedRequest of requests.editedRequests) {
                await dispatch(updateRequest({
                    id: editedRequest.id,
                    tags: editedRequest.tags,
                    track: editedRequest.track,
                    students_count: editedRequest.students_count === null ? 0 : editedRequest.students_count,
                }))
            }
            setIsLoading(false)
            message.destroy('updateRequests')
            message.success({content: "Вы успешно обновили заявки!"})
            dispatch(getAllRequests({period_id: periods.periods.find(period => period.year === year && period.term === term).id}))
            dispatch(setEditedRequests([]))

            // const editedRequests = requests.requests.map(request => {
            //     const editedRequest = requests.editRequests.find(editRequest => editRequest.is === request.id)
            //
            //     if(Object.toJSON(editedRequest) !== Object.toJSON(request))
            //         return editedRequest
            // })
            //
            // editedRequests.map(editRequest => {
            //     dispatch(updateRequest({
            //         id: editRequest.id,
            //         tags: editRequest.tags.map(tag => tag.id)
            //     })).then((response) => {
            //
            //         message.destroy('updateRequests')
            //         message.success({content: "Вы успешно обновили заявки!"})
            //         let newRequests = [...props.requests]
            //         let currentIndex = newRequests.findIndex(request => request.id === props.request.id)
            //         newRequests[currentIndex] = {...newRequests[currentIndex], tags: props.tags.filter(tag => requestTags.includes(tag.id))};
            //         dispatch(setRequests(newRequests))
            //     }, (error) => {
            //         setIsLoading(false)
            //         message.destroy('updateRequests')
            //         message.error({content: error.message})
            //     });
            // })
            // setIsLoading(false)
        }
    }

    return (
        <div className={styles.page}>
            <SideBar selectedKeys={["PartnersRequests"]}/>

            <h1 className={styles.title}>Заявки</h1>
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
                    <Button onClick={() => {
                        if(isEdit)
                            saveRequests()
                        setIsEdit(!isEdit)
                    }}>
                        {isEdit ? "Сохранить данные" : "Редактировать данные"}
                    </Button>
                    <Button onClick={() => setIsSettingsTableOpen(true)}>
                        Настроить таблицу
                    </Button>
                </div>
            </div>

            {
                requests.isLoading ?
                    <Spin/> :
                    <RequestsTable
                        isEdit={isEdit}
                        defaultRequests={requests}
                        requests={requestsTable}
                        editRequests={requests.editRequests}
                        columns={requestsTableColumns}
                    />
            }

            <RequestsTableSettings
                isOpen={isSettingsTableOpen}
                setIsOpen={setIsSettingsTableOpen}

                tableColumns={requestsTableColumns}
                setTableColumns={setRequestsTableColumns}
            />
        </div>
    )
}
