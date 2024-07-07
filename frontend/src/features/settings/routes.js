import React from 'react';
import MainLayout from "../../components/MainLayout/MainLayout";
import {SettingsPage} from "./pages/SettingsPage/SettingsPage";

export const settingsRoutes = [
    {
        element: <MainLayout/>,
        children: [
            {
                path: 'settings',
                element: <SettingsPage/>
            }
        ]
    },
]
