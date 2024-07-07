import React from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import {FileAddOutlined} from "@ant-design/icons";
import {MantineProvider} from '@mantine/core';
import styles from "./MainLayout.module.css"

export default function MainLayout() {
    const navigate = useNavigate()

    let actions = [
        {
            title: 'Создать статью',
            description: 'Создать новую статью',
            onTrigger: () => navigate("/notes/0?createnote=1"),
            icon: <FileAddOutlined/>,
        },
        {
            title: 'Создать серию статей',
            description: 'Создать новую серию статей',
            onTrigger: () => navigate("/notes/0?creategroup=1"),
            icon: <FileAddOutlined/>,
        }
    ];

    return (
        <div>
            <MantineProvider theme={{colorScheme: 'dark'}}>
                <div className={styles.mainLayout}>
                    <div className={styles.mainLayout__app}>
                        <Outlet/>
                    </div>
                </div>
            </MantineProvider>
        </div>
    );
};
