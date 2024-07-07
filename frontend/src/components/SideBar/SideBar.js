import {useNavigate} from "react-router-dom";
import {Menu} from "antd";
import {
    AppstoreOutlined, BankOutlined,
    FileProtectOutlined,
    FundProjectionScreenOutlined,
    LineChartOutlined,
    LogoutOutlined, QuestionCircleOutlined, RobotOutlined, SettingOutlined, UserOutlined
} from "@ant-design/icons";
import styles from './SideBar.module.css';
import {useCallback} from "react";
import {removeAuth} from "../../store/slices/authSlice";
import {useDispatch} from "react-redux";


export default function SideBar(props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const getItem = useCallback((label, key, icon, children, type) => {
        return {
            key,
            icon,
            children,
            label,
            type,
        };
    }, [])

    const topMenu = [
        getItem('Заявки', 'PartnersRequests', <AppstoreOutlined />),
        getItem('Паспорта', 'PartnersPassports', <FileProtectOutlined/>),
        getItem('Проекты', 'TeamprojectProjects', <FundProjectionScreenOutlined/>),
        getItem('Студенты', 'TeamprojectStudents', <UserOutlined />),
        getItem('Заказчики', 'PartnersCustomerCompanies', <BankOutlined />),
        getItem('Представители', 'PartnersCustomerUsers', <RobotOutlined />),
        getItem('Аналитика', 'Analytic', <LineChartOutlined />),
        getItem('Q&A', 'Q&A', <QuestionCircleOutlined />),
    ];
    const bottomMenu = [
        // getItem('Настройки', 'Settings', <SettingOutlined/>),
        getItem('Выйти', 'Exit', <LogoutOutlined/>),
    ];

    const onClick = (item) => {
        switch (item.key) {
            case 'Home':
                navigate('/')
                break
            case 'PartnersPassports':
                navigate('/partners/passports')
                break
            case 'PartnersRequests':
                navigate('/partners/requests')
                break
            case 'PartnersCustomerCompanies':
                navigate('/partners/customer-companies')
                break
            case 'PartnersCustomerUsers':
                navigate('/partners/customer-users')
                break
            case 'TeamprojectProjects':
                navigate('/teamproject/projects')
                break
            case 'TeamprojectStudents':
                navigate('/teamproject/students')
                break
            case 'Analytic':
                navigate('/analytic')
                break
            case 'Q&A':
                navigate('/question')
                break
            case 'Settings':
                navigate('/settings')
                break
            case 'Exit':
                dispatch(removeAuth())
                break
            default:
                navigate('/')
                break
        }
    }

    return (
        <div className={styles.menu}>
            <Menu
                defaultSelectedKeys={['1']}
                mode="inline"
                theme="light"
                // inlineCollapsed={true}
                className={styles.menu__buttons}
                items={topMenu}
                selectedKeys={props.selectedKeys ?? []}
                onClick={onClick}
            />
            <Menu
                mode="inline"
                theme="light"
                // inlineCollapsed={true}
                className={styles.menu__buttons}
                items={bottomMenu}
                onClick={onClick}
            />
        </div>
    )
}
