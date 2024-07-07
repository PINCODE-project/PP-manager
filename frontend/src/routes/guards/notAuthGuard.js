import React from 'react';
import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {useAuth} from '../../hooks/use-auth';

export default function NotAuthGuard() {
    const user = useAuth();
    const location = useLocation();

    if (user.isAuth) {
        const redirect = {
            pathname: '/teamproject/projects',
        };

        return <>
            <Navigate to={redirect} replace/>
        </>
    }

    return <Outlet/>;
};
