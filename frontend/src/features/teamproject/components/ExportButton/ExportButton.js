import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {App, Button, Input, Table} from "antd";
import {useDispatch} from "react-redux";
import {createReport} from "../../../../store/slices/teamprojectSlice";
import {useTeamproject} from "../../../../hooks/use-teamproject";
import API from "../../../../api/API";

const {Column, ColumnGroup} = Table;
const {TextArea} = Input;

export default function ExportButton(props) {
    const navigate = useNavigate()
    const {message} = App.useApp();
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);

    const getReport = (payload) => {
        if (!isLoading) {
            setIsLoading(true);

            dispatch(createReport({
                periodId: props.periodId
            })).then((response) => {
                console.log(response)
                setIsLoading(false)
                message.success({content: "Отчёт успешно сформирован!"})
                window.open(`${API.GET_REPORT}${response.payload.reportFile}`, 'rel=noopener noreferrer')
            }, (error) => {
                setIsLoading(false)
                message.error({content: error.message})
            });
        }
    }

    return (
        <Button onClick={getReport}>
            Экспортировать
        </Button>
    );
};
