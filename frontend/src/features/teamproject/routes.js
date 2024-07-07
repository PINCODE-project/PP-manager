import React from 'react';
import MainLayout from "../../components/MainLayout/MainLayout";
import {TeamprojectProjectsPage} from "./pages/TeamprojectProjectsPage";
import {TeamprojectProjectPage} from "./pages/TeamprojectProjectPage";
import {TeamprojectStudentsPage} from "./pages/TeamprojectStudentsPage";
import {TeamprojectStudentPage} from "./pages/TeamprojectStudentPage";

export const teamprojectRoutes = [
    {
        element: <MainLayout/>,
        children: [
            {
                path: 'teamproject/projects',
                element: <TeamprojectProjectsPage/>
            },
            {
                path: 'teamproject/projects/:id',
                element: <TeamprojectProjectPage/>
            },

            {
                path: 'teamproject/students',
                element: <TeamprojectStudentsPage/>
            },
            {
                path: 'teamproject/students/:id',
                element: <TeamprojectStudentPage/>
            },
        ]
    },
]
