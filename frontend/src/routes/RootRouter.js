import {useRoutes} from 'react-router-dom';
import {landingRoutes} from "../features/landing/routes";
import {teamprojectRoutes} from "../features/teamproject/routes";
import {authRoutes} from "../features/auth/routes";
import NotAuthGuard from "./guards/notAuthGuard";
import AuthGuard from "./guards/authGuard";
import {partnersRoutes} from "../features/partners/routes";
import {analyticRoutes} from "../features/analytics/routes";
import {settingsRoutes} from "../features/settings/routes";
import {questionsRoutes} from "../features/questions/routes";

const routes = [
    {
        element: <NotAuthGuard/>,
        children: [
            ...authRoutes,
            ...landingRoutes,
        ]
    },
    {
        element: <AuthGuard/>,
        children: [
            ...teamprojectRoutes,
            ...partnersRoutes,
            ...analyticRoutes,
            ...questionsRoutes,
            ...settingsRoutes
        ]
    }

];

export const RootRouter = () => useRoutes(routes);
