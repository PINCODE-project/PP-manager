import React, {useEffect, useState} from 'react';
import {App, Button, Input, Modal, Select, Form, Spin, Progress} from "antd";
import {parseProjects} from "../../../../store/slices/teamprojectSlice";
import {useDispatch} from "react-redux";
import styles from "./ParseModal.module.css"
import useSse from "../../../../hooks/use-sse";
import {usePeriods} from "../../../../hooks/use-periods";
import {getAllProjects} from "../../../../store/slices/projectsSlice";
import {unauthorizedHandler} from "../../../../core/utils/unauthorizedHandler";

const {TextArea} = Input;

export default function ParseModal(props) {
    const {message} = App.useApp();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("PP-analyze-bearer") || "")
    const [year, setYear] = useState(2023)
    const [term, setTerm] = useState(1)
    const [percent, setPercent] = useState(0)

    const periods = usePeriods()

    const handleChangeYear = (value) => {
        setYear(value)
    }

    const handleChangeTerm = (value) => {
        setTerm(value)
    }

    const sseMessage = useSse("parse-projects", isLoading)

    useEffect(() => {
        if(!sseMessage) return;
        const parts = sseMessage.split("/")
        setPercent((+parts[0])/(+parts[1])*100)
    }, [ sseMessage ]);

    const parse = (payload) => {
        if (!isLoading && !periods.isLoading) {
            setIsLoading(true);

            const data = {
                token: token,
                period_id: periods.periods.find(period => period.year === year && period.term === term).id
            }

            dispatch(parseProjects(data)).then((response) => {
                setIsLoading(false)
                message.success({content: "Информация успешно собрана!"})
            }, (error) => {
                setIsLoading(false)
                message.error({content: error.message})
            });
        }
    }

    return (
        <Modal
            title="Загрузка данных из Teamproject"
            open={props.isOpen}
            footer={() => undefined}
            closeIcon={false}
        >
            <Form autoComplete="off" disabled={isLoading} layout={'horizontal'}>
                <Form.Item>
                    <Input
                        addonBefore="Bearer"
                        value={token}
                        onChange={(e) => {
                            localStorage.setItem("PP-analyze-bearer", e.target.value)
                            setToken(e.target.value);
                        }}
                        placeholder="Введите токен"
                        autoSize={{minRows: 3, maxRows: 5}}
                    />
                </Form.Item>
                <Form.Item
                    label="Год"
                >
                    <Select
                        defaultValue={2023}
                        className={styles.select}
                        onChange={handleChangeYear}
                        options={[
                            {value: 2024, label: '2024/2025'},
                            {value: 2023, label: '2023/2024'},
                            {value: 2022, label: '2022/2023'},
                            {value: 2021, label: '2021/2022'},
                            {value: 2020, label: '2020/2021'},
                            {value: 2019, label: '2019/2020'},
                            {value: 2018, label: '2018/2019'},
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    label="Семестр"
                >
                    <Select
                        defaultValue={1}
                        className={styles.select}
                        onChange={handleChangeTerm}
                        options={[
                            {value: 1, label: 'Осенний'},
                            {value: 2, label: 'Весенний'},
                        ]}
                    />
                </Form.Item>

                {
                    isLoading ?
                        <>
                            <p className={styles.loading}><Spin/> Не закрывайте страницу! Загружаю данные...</p>
                            <Progress percent={parseInt(percent)} status="active" />
                        </> :
                        <div className={styles.buttons}>
                            <Button onClick={() => props.setIsOpen(false)} disabled={isLoading}>
                                Отмена
                            </Button>
                            <Button disabled={isLoading} onClick={() => parse()} type="primary">
                                Начать
                            </Button>
                        </div>
                }
            </Form>
        </Modal>
    );
};
