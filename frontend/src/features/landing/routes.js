import React from 'react';
import { Navigate } from "react-router-dom";

export const landingRoutes = [
    {
        path: '/',
        element: <Navigate to={ "/teamproject/projects" } replace />,
    },
]
