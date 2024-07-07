import SideBar from "../../../../components/SideBar/SideBar";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import React from "react";
import {App} from "antd";
import styles from './SettingsPage.module.css'
import TagsEditor from "../../components/TagsEditor/TagsEditor";

export function SettingsPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const {message} = App.useApp();

    return (
        <div className={styles.page}>
            <SideBar selectedKeys={["PartnersRequests"]}/>

            <h1 className={styles.title}>Настройки</h1>
            <TagsEditor/>
        </div>
    )
}
