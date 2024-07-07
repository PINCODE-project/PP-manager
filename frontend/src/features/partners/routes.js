import React from 'react';
import MainLayout from "../../components/MainLayout/MainLayout";
import {PartnersPassportsPage} from "./pages/PartnersPassportsPage";
import {PartnersRequestsPage} from "./pages/PartnersRequestsPage";
import {PartnersCustomerCompaniesPage} from "./pages/PartnersCusomerCompaniesPage";
import {PartnersCustomerUsersPage} from "./pages/PartnersCusomerUsersPage";

export const partnersRoutes = [
    {
        element: <MainLayout/>,
        children: [
            {
                path: 'partners/requests',
                element: <PartnersRequestsPage/>
            },
            {
                path: 'partners/passports',
                element: <PartnersPassportsPage/>
            },
            {
                path: 'partners/customer-companies',
                element: <PartnersCustomerCompaniesPage/>
            },
            {
                path: 'partners/customer-users',
                element: <PartnersCustomerUsersPage/>
            },
        ]
    },
]
