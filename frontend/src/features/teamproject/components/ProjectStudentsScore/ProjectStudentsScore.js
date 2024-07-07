import React, {useEffect, useState} from 'react';
import {App, Card, Collapse, Descriptions, Dropdown, Input, Statistic, Table, Tag} from "antd";
import {useDispatch} from "react-redux";
import styles from "./ProjectStudentsScore.module.css"
import {Link} from "react-router-dom";

const {TextArea} = Input;
const {Column, ColumnGroup} = Table;

export default function ProjectStudentsScore(props) {
    const {message} = App.useApp();
    const dispatch = useDispatch();
    const [studentsScore, setStudentsScore] = useState([]);

    useEffect(() => {
        setStudentsScore(props.project.students.map(student => ({
            studentId: student.id,
            fullname: student.fullname,
            totalScore: student.projects_result[0].totalScore,
            expertsScore: student.projects_result[0].expertsScore,
            finalScore: student.projects_result[0].finalScore,
            retakedScore: student.projects_result[0].retakedScore,
            brsScore: student.projects_result[0].brsScore,
            coefficient: student.projects_result[0].coefficient,
        })))
    }, [props.project]);

    console.log(studentsScore)
    return (
        <Card
            title={(<p className={styles.title}>Оценки студентов</p>
            )}
            bordered={false}
            className={styles.project}
        >
            <Table
                className={styles.table}
                bordered={true}
                dataSource={studentsScore}
                size="small"
                pagination={false}
            >
                <Column
                    title="Студент"
                    width={150}
                    dataIndex="fullname"
                    key="fullname"
                    render={(value, record) => {
                        return (
                            <Link to={"/teamproject/students/" + record.studentId}>{value}</Link>
                        )
                    }}
                />
                <Column
                    title="По всем итерациям"
                    width={90}
                    dataIndex="totalScore"
                    key="totalScore"
                />
                <Column
                    title="Коэффициент участия"
                    width={90}
                    dataIndex="coefficient"
                    key="coefficient"
                />
                <Column
                    title="Сводная оценка экспертной комиссии"
                    width={90}
                    dataIndex="expertsScore"
                    key="expertsScore"
                />
                <Column
                    title="Итог"
                    width={90}
                    dataIndex="finalScore"
                    key="finalScore"
                />
                <Column
                    title="Пересдача"
                    width={90}
                    dataIndex="retakedScore"
                    key="retakedScore"
                    render={(value, record) => {
                        return (
                            <p>{value ?? "-"}</p>
                        )
                    }}
                />
            </Table>
        </Card>
    );
};
