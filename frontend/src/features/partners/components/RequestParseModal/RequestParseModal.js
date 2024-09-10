import React, { useEffect, useState } from 'react';
import { App, Button, Form, Input, Modal, Progress, Select, Spin } from "antd";
import { useDispatch } from "react-redux";
import styles from "./PassportParseModal.module.css"
import useSse from "../../../../hooks/use-sse";
import { usePeriods } from "../../../../hooks/use-periods";
import { parseRequests } from "../../../../store/slices/requestsSlice";

const {TextArea} = Input;

export default function RequestParseModal(props) {
    const {message} = App.useApp();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("PP-analyze-bearer") || "")
    const [year, setYear] = useState(2024)
    const [term, setTerm] = useState(1)
    const [percent, setPercent] = useState(0)

    const periods = usePeriods()

    const handleChangeYear = (value) => {
        setYear(value)
    }

    const handleChangeTerm = (value) => {
        setTerm(value)
    }

    const sseMessage = useSse("parse-partners", isLoading)

    useEffect(() => {
        if (!sseMessage) return;
        const parts = sseMessage.split("/")
        setPercent((+parts[0]) / (+parts[1]) * 100)
    }, [sseMessage]);

    const parse = (payload) => {
        if (!isLoading && !periods.isLoading) {
            setIsLoading(true);

            const data = {
                period_id: periods.periods.find(period => period.year === year && period.term === term).id
            }

            dispatch(parseRequests(data)).then((response) => {
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
            title="Загрузка заявок из Partners"
            open={ props.isOpen }
            footer={ () => undefined }
            closeIcon={ false }
        >
            <Form autoComplete="off" disabled={ isLoading } layout={ 'horizontal' } >
                <Form.Item
                    label="Год"
                >
                    <Select
                        defaultValue={ 2024 }
                        className={ styles.select }
                        onChange={ handleChangeYear }
                        options={
                            [...new Set(periods.periods.map(period => period.year))].map(year => ({
                                value: year, label: `${ year }/${ year + 1 }`
                            }))
                        }
                    />
                </Form.Item >

                <Form.Item
                    label="Семестр"
                >
                    <Select
                        defaultValue={ 1 }
                        className={ styles.select }
                        onChange={ handleChangeTerm }
                        options={ [
                            {value: 1, label: 'Осенний'},
                            {value: 2, label: 'Весенний'},
                        ] }
                    />
                </Form.Item >

                {
                    isLoading ?
                        <>
                            <p className={ styles.loading } ><Spin /> Не закрывайте страницу! Загружаю данные...</p >
                            <Progress percent={ parseInt(percent) } status="active" />
                        </> :
                        <div className={ styles.buttons } >
                            <Button onClick={ () => props.setIsOpen(false) } disabled={ isLoading } >
                                Отмена
                            </Button >
                            <Button disabled={ isLoading } onClick={ () => parse() } type="primary" >
                                Начать
                            </Button >
                        </div >
                }
            </Form >
        </Modal >
    );
};
