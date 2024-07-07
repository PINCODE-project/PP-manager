import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Logo from '../../../../assets/images/Logo.svg'
import styles from './LoginPage.module.css'
import {LoginForm} from '../../components/LoginForm/LoginForm';

export function LoginPage() {
    const navigate = useNavigate()

    return (
        <div className={styles.loginPage}>
            <img src={Logo} alt='Логотип сервиса' className={styles.loginPage__logo} onClick={() => navigate("/")}/>
            <div className={styles.loginPage__titleContainer}>
                <h1 className={styles.loginPage__title}>С возвращением!</h1>
                <p className={styles.loginPage__description}>Сервис для аналитики курса "Проектный практикум"</p>
            </div>
            <LoginForm/>
        </div>
    )
}
