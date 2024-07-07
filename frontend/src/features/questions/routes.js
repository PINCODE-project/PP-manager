import React from 'react';
import MainLayout from "../../components/MainLayout/MainLayout";
import {QuestionsPage} from "./pages/QuestionsPage";

export const questionsRoutes = [
    {
        element: <MainLayout/>,
        children: [
            {
                path: 'question',
                element: <QuestionsPage/>
            }
        ]
    },
]
