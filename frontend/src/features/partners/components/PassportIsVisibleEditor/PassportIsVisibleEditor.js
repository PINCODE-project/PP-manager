import React, {useEffect, useState} from 'react';
import {App, Button, Checkbox, Input, Select, Table, Tag} from "antd";
import {useDispatch} from "react-redux";
import styles from "./PassportIsVisibleEditor.module.css"
import {updatePassport, updatePassportTag} from "../../../../store/slices/passportSlice";
import {CheckCircleOutlined, EditOutlined} from "@ant-design/icons";
import {setPassports} from "../../../../store/slices/passportsSlice";
import {updateRequestTag} from "../../../../store/slices/requestSlice";

const {TextArea} = Input;
const {Column, ColumnGroup} = Table;


export default function PassportIsVisibleEditor(props) {
    const {message} = App.useApp();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const savePassport = (value) => {
        if (!isLoading) {
            setIsLoading(true);
            message.loading({content: "Сохраняю паспорт...", key: 'updatePassportVisible', duration: 0})

            dispatch(updatePassport({
                id: props.passport.id,
                is_visible: value
            })).then((response) => {
                setIsLoading(false)
                message.destroy('updatePassportVisible')
                message.success({content: "Вы успешно обновили паспорт"})
                let newPassports = [...props.passports]
                let currentIndex = newPassports.findIndex(passport => passport.id === props.passport.id)
                newPassports[currentIndex] = {...newPassports[currentIndex], is_visible: value};
                dispatch(setPassports(newPassports))
            }, (error) => {
                setIsLoading(false)
                message.destroy('updatePassportVisible')
                message.error({content: error.message})
            });
        }
    }

    return (
        <div className={styles.tags__container}>
            <Checkbox checked={props.value}
                      onChange={(e) => savePassport(e.target.checked)}
            />
        </div>
    );
};
