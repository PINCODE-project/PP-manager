import SideBar from "../../../../components/SideBar/SideBar";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {App, Card, Select, Statistic, Typography} from "antd";
import styles from "./AnalyticPage.module.css"
import React, {useEffect, useState} from "react";
import {useAnalytic} from "../../../../hooks/use-analytic";
import {getMainAnalytics} from "../../../../store/slices/analyticSlice";
import {getAllPeriods} from "../../../../store/slices/periodsSlice";
import {usePeriods} from "../../../../hooks/use-periods";
import {BarChart} from "@mantine/charts";
import {Paper, Text} from "@mantine/core";
import {normalizeCountForm} from "../../../../core/utils/normalizeCountForm";

const {Title} = Typography;


function ChartTooltip({ label, payload }) {
    if (!payload) return null;

    return (
        <Paper px="md" py="sm" withBorder shadow="md" radius="md">
            <Text fw={500} mb={5}>
                {label} {normalizeCountForm(label, ["балл", 'балла', 'баллов'])}
            </Text>
            {payload.map((item) => (
                <Text key={item.name} fz="sm">
                    {item.name}: {item.value}
                </Text>
            ))}
        </Paper>
    );
}

export function AnalyticPage() {
    const {id} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const {message} = App.useApp();
    const analytic = useAnalytic()

    const [year, setYear] = useState(2023)
    const [term, setTerm] = useState(2)

    const handleChangeYear = (value) => {
        setYear(value)
    }

    const handleChangeTerm = (value) => {
        setTerm(value)
    }

    const periods = usePeriods()

    useEffect(() => {
        if (!periods.isLoading) {
            dispatch(getMainAnalytics({period_id: periods.periods.find(period => period.year === year && period.term === term).id}))
        }
    }, [year, term, periods])

    useEffect(() => {
        dispatch(getAllPeriods())
    }, []);

    if (analytic.isLoading)
        return (
            <div>
                <SideBar selectedKeys={["AlanyticPage"]}/>
            </div>
        )

    return (
        <div className={styles.page}>
            <SideBar selectedKeys={["AlanyticPage"]}/>

            <h1 className={styles.title}>Аналитика</h1>
            <div className={styles.header}>
                <div className={styles.filters}>
                    <Select
                        defaultValue={2023}
                        onChange={handleChangeYear}
                        options={
                            [...new Set(periods.periods.map(period => period.year))].map(year => ({
                                value: year, label: `${year}/${year + 1}`
                            }))
                        }
                    />

                    <Select
                        defaultValue={2}
                        onChange={handleChangeTerm}
                        options={[
                            {value: 1, label: 'Осенний'},
                            {value: 2, label: 'Весенний'},
                        ]}
                    />
                </div>
            </div>

            <div className={styles.cards}>
                <Card bordered={false}>
                    <Statistic
                        title="Количество заявок"
                        value={analytic.mainAnalytic.requests_count}
                    />
                </Card>
                <Card bordered={false}>
                    <Statistic
                        title="Количество паспортов"
                        value={analytic.mainAnalytic.passports_count}
                    />
                </Card>
                <Card bordered={false}>
                    <Statistic
                        title="Количество проектов"
                        value={analytic.mainAnalytic.projects_count}
                    />
                </Card>
                <Card bordered={false}>
                    <Statistic
                        title="Количество мест для записи"
                        value={analytic.mainAnalytic.available_seats_count}
                    />
                </Card>
                <Card bordered={false}>
                    <Statistic
                        title="Количество заказчиков"
                        value={analytic.mainAnalytic.customer_company_count}
                    />
                </Card>
                <Card bordered={false}>
                    <Statistic
                        title="Количество представителей"
                        value={analytic.mainAnalytic.customer_users_count}
                    />
                </Card>
                <Card bordered={false}>
                    <Statistic
                        title="Количество студентов"
                        value={analytic.mainAnalytic.students_count}
                    />
                </Card>
            </div>
            <div className={styles.cards}>
                <Card bordered={false}>
                    <Statistic
                        title="Есть/нет отчётов"
                        value={`${analytic.mainAnalytic.has_report_count}/${analytic.mainAnalytic.projects_count - analytic.mainAnalytic.has_report_count}`}
                    />
                </Card>
                <Card bordered={false}>
                    <Statistic
                        title="Есть/нет презентаций"
                        value={`${analytic.mainAnalytic.has_presentation_count}/${analytic.mainAnalytic.projects_count - analytic.mainAnalytic.has_presentation_count}`}
                    />
                </Card>
                <Card bordered={false}>
                    <Statistic
                        title="Есть/нет оценок комиссии"
                        value={`${analytic.mainAnalytic.has_commission_score_count}/${analytic.mainAnalytic.projects_count - analytic.mainAnalytic.has_commission_score_count}`}
                    />
                </Card>
            </div>
            <div className={styles.chartContainer}>
                <h2 className={styles.title}>Распределение оценок по командам</h2>
                <BarChart
                    xAxisLabel="Оценка"
                    yAxisLabel="Кол-во проектов"
                    h={300}
                    data={Object.keys(analytic.mainAnalytic.marks).map(key => ({
                        mark: key !== 'null' ? key : "Нет",
                        'Количество проектов': analytic.mainAnalytic.marks[key]
                    }))}
                    dataKey="mark"
                    series={[
                        {name: 'Количество проектов', color: 'violet.6'},
                    ]}
                    tickLine="y"
                    tooltipProps={{
                        content: ({ label, payload }) => <ChartTooltip label={label} payload={payload} />,
                    }}
                />
            </div>
        </div>
    )
}
