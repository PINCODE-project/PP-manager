import React from 'react';
import {App, Card, Collapse, Descriptions, Dropdown, Input, Statistic, Tag} from "antd";
import {useDispatch} from "react-redux";
import styles from "./ProjectDescription.module.css"
import {Link} from "react-router-dom";

const {TextArea} = Input;

export default function ProjectDescription(props) {
    const {message} = App.useApp();
    const dispatch = useDispatch();

    const getProjectRequestDropdown = (value, record) => [
        {
            key: '0',
            label: (
                <a target="_blank" href={"https://teamproject.urfu.ru/#/" + record.id + "/about"}>
                    Перейти к проекту в Teamproject
                </a>
            ),
        },
        {
            key: '1',
            label: (
                <Link to={record.id}>
                    Перейти к проекту в PP-manager
                </Link>
            ),
        },
    ]

    const getProjectNameDropdown = (projectId) => [
        {
            key: '0',
            label: (
                <a target="_blank" href={"https://teamproject.urfu.ru/#/" + projectId + "/about"}>
                    Перейти к проекту в Teamproject
                </a>
            ),
        },
        props.type === 'student' ? {
            key: '1',
            label: (
                <Link to={"/teamproject/projects/" + projectId}>
                    Перейти к проекту в PP-manager
                </Link>
            ),
        } : undefined
    ]

    const getPassportUidDropdown = (passportId) => [
        {
            key: '0',
            label: (
                <a target="_blank" href={"https://partner.urfu.ru/ptraining/services/learning/#/passport/" + passportId}>
                    Перейти к паспорту в ЛКП
                </a>
            ),
        },
    ]

    const getRequestUidDropdown = (requestId) => [
        {
            key: '0',
            label: (
                <a target="_blank"
                   href={"https://partner.urfu.ru/ptraining/services/learning/#/requests/" + requestId}>
                    Перейти к заявке в ЛКП
                </a>
            ),
        },
    ]

    return (
        <Card
            title={(
                <div className={styles.title}>
                    <Dropdown
                        trigger={['click']}
                        menu={{
                            items: getProjectNameDropdown(props.project.id),
                        }}
                    >
                        <a onClick={(e) => e.preventDefault()} className={styles.title__name}>
                            {props.project.name}
                        </a>
                    </Dropdown>
                    <p className={styles.title__period}>{props.project.period.term === 1 ? "Осенний" : "Весенний"} семестр {props.project.period.year}/{props.project.period.year + 1}</p>
                </div>
            )}
            bordered={false}
            className={styles.project}
        >
            <div className={styles.project__content}>
                <div className={styles.project__content__left}>
                    <div className={styles.project__content__info__row}>
                        <p >
                            <p className={styles.project__content__info__title}>Заявка</p>
                            <Dropdown
                                trigger={['click']}
                                menu={{
                                    items: getRequestUidDropdown(props.project.passport.request.id),
                                }}
                            >
                                <a onClick={(e) => e.preventDefault()}>
                                    {props.project.passport.request.uid}
                                </a>
                            </Dropdown>
                            <br/>
                            от {new Date(Date.parse(props.project.passport.request.date)).toLocaleDateString()}
                        </p>
                        <p >
                            <p className={styles.project__content__info__title}>Паспорт</p>
                            <Dropdown
                                trigger={['click']}
                                menu={{
                                    items: getPassportUidDropdown(props.project.passport.id),
                                }}
                            >
                                <a onClick={(e) => e.preventDefault()}>
                                    {props.project.passport.uid}
                                </a>
                            </Dropdown>
                            <br/>
                            от {new Date(Date.parse(props.project.passport.date)).toLocaleDateString()}
                        </p>
                        <p >
                            <p className={styles.project__content__info__title}>Тип проекта</p>
                            {props.project.passport.kind === "KERN" ? "Ядерный проект" : props.project.passport.kind === "MONO" ? "Монопроект" : "Межпрограммный"}
                        </p>
                    </div>
                    <div>
                        <p className={styles.project__content__row}>
                            <p className={styles.project__content__info__title}>Краткое название:</p>
                            {props.project.passport.short_name}
                        </p>
                        <p className={styles.project__content__row}>
                            <p className={styles.project__content__info__title}>Название для диплома:</p>
                            {props.project.passport.diploma_name}
                        </p>
                    </div>

                    <div className={styles.project__content__info}>
                        <p className={styles.project__content__info__title}>Описание</p>
                        <div dangerouslySetInnerHTML={{__html: props.project.passport.request.description}}/>
                    </div>
                    <div className={styles.project__content__info}>
                        <p className={styles.project__content__info__title}>Цель</p>
                        <div dangerouslySetInnerHTML={{__html: props.project.passport.request.goal}}/>
                    </div>
                    <div className={styles.project__content__info}>
                        <p className={styles.project__content__info__title}>Требуемый результат</p>
                        <div dangerouslySetInnerHTML={{__html: props.project.passport.request.result}}/>
                    </div>
                    <div className={styles.project__content__info}>
                        <p className={styles.project__content__info__title}>Критерии оценки</p>
                        <div dangerouslySetInnerHTML={{__html: props.project.passport.request.criteria}}/>
                    </div>
                    <div className={styles.project__content__info__row}>
                        <div className={styles.project__content__info}>
                            <p className={styles.project__content__info__title}>Организация заказчика</p>
                            <div>{props.project.passport.request.customer_user.customer_company.name}</div>
                        </div>
                        <div className={styles.project__content__info}>
                            <p className={styles.project__content__info__title}>ФИО заказчика</p>
                            <div>{(props.project.passport.request.customer_user.last_name || "") + " " + (props.project.passport.request.customer_user.first_name || "") + " " + (props.project.passport.request.customer_user.middle_name || "")}</div>
                        </div>
                        <div className={styles.project__content__info}>
                            <p className={styles.project__content__info__title}>Куратор</p>
                            <div>{props.project.curator || ""}</div>
                        </div>
                    </div>
                </div>
                <div className={styles.project__content__right}>
                    <div className={styles.project__content__right__badges}>
                        <Tag color={props.project.status === "Завершённый" ? "gray" : "green"} style={{margin: 0}}>
                            {props.project.status}
                        </Tag>
                        <Tag color={props.project.isHaveReport ? "green" : "red"} style={{margin: 0}}>
                            {props.project.isHaveReport ? "Есть отчёт" : "Нет отчёта"}
                        </Tag>
                        <Tag color={props.project.isHavePresentation ? "green" : "red"} style={{margin: 0}}>
                            {props.project.isHavePresentation ? "Есть презентация" : "Нет презентации"}
                        </Tag>
                        <Tag color={props.project.comissionScore !== null ? "green" : "red"} style={{margin: 0}}>
                            {props.project.comissionScore !== null ? "Есть оценка комиссии" : "Нет оценки комиссии"}
                        </Tag>
                    </div>
                    {
                        props.project.passport.request.tags.length !== 0 &&
                        <div className={styles.project__content__right__tags}>
                            {
                                props.project.passport.request.tags.map(tag => {
                                    return <Tag style={{margin: 0}} color={tag.color}>{tag.text}</Tag>
                                })
                            }
                        </div>
                    }
                    {
                        props.type === "student" && props.project.students_result?.[0]?.expertsScore &&
                        <Statistic
                            title="Сводная оценка экспертной комиссии"
                            value={
                                `${props.project.students_result?.[0]?.expertsScore} * ${props.project.students_result?.[0]?.coefficient} = ${props.project.students_result?.[0]?.brsScore}`
                            }
                        />
                    }
                    {
                        props.type === "student" && props.project.students_result?.[0]?.retakedScore &&
                        <Statistic
                            title="Пересдача"
                            value={props.project.students_result?.[0]?.retakedScore}
                        />
                    }
                </div>
            </div>
        </Card>
    );
};
