import React from 'react';
import MainLayout from "../../components/MainLayout/MainLayout";
import {AnalyticPage} from "./pages/AnalyticPage";

export const analyticRoutes = [
    {
        element: <MainLayout/>,
        children: [
            {
                path: 'analytic',
                element: <AnalyticPage/>
            }
        ]
    },
]
