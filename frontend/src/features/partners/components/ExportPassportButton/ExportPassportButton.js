import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { App, Button } from "antd";
import { useDispatch } from "react-redux";
import API from "../../../../api/API";
import { createPassportReport } from "../../../../store/slices/passportSlice";

export default function ExportPassportButton(props) {
    const navigate = useNavigate();
    const { message } = App.useApp();
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);

    const getReport = (payload) => {
        if (!isLoading) {
            setIsLoading(true);
            message.open({
                key: "exportRequest",
                type: 'loading',
                content: 'Экспортирую...',
                duration: 0,
            });
            dispatch(
                createPassportReport({
                    periodId: props.periodId,
                    programs: props.programs,
                }),
            ).then(
                (response) => {
                    console.log(response);
                    setIsLoading(false);
                    message.open({
                        key: "exportRequest",
                        type: 'success',
                        content: 'Отчёт успешно сформирован!',
                    });
                    window.open(
                        `${ API.GET_REPORT }${ response.payload.reportFile }`,
                        "rel=noopener noreferrer",
                    );
                },
                (error) => {
                    setIsLoading(false);
                    message.error({ content: error.message });
                },
            );
        }
    };

    return <Button onClick={ getReport } >Экспортировать</Button >;
}
