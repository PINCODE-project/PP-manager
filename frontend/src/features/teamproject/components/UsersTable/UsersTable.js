import React, {useRef, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {App, Button, Input, Modal, Space, Table, Tag} from "antd";
import {parseProjects} from "../../../../store/slices/teamprojectSlice";
import {useDispatch} from "react-redux";
import styles from "./UsersTable.module.css"
import {LinkOutlined, SearchOutlined} from "@ant-design/icons";

const {Column, ColumnGroup} = Table;
const {TextArea} = Input;

export default function UsersTable(props) {
    const {message} = App.useApp();
    const dispatch = useDispatch();

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm({
            closeDropdown: false,
        });
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters({
            closeDropdown: true,
        })
        setSearchText('');
        setSearchedColumn('');
    };

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    let data = []

    props.projects.forEach(project => {
        project.team.thematicGroups.forEach((group, groupIndex) => {
            group.students.forEach((student, studentIndex) => {
                if(!data.find(s => s.key === student.userId))
                    data.push(
                        {
                            key: student.userId,
                            fullname: student.fullname,
                            group: student.groupName,
                            projectName: project.project.title,
                            projectKey: project.project.id,
                            curator: group.curator.fullname,
                            expertsScore: project.results.expertsScore || "Нет оценки",
                            finalScore: project.results.thematicGroups[groupIndex].students[studentIndex].finalScore || "Нет оценки",
                            retakedScore: project.results.thematicGroups[groupIndex].students[studentIndex].retakedScore || "Не пересдавал",
                        }
                    )
            })
        })
    })


    console.log(data)

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Поиск по названию`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Найти
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        }
    });

    return (
        <div>
            <Table
                className={styles.table}
                bordered={true}
                dataSource={data}
                size="small"
                scroll={{
                    y: "70vh",
                    x: 'max-content'
                }}
                pagination={{
                    pageSize: 7,
                    showSizeChanger: false
                }}
            >
                <Column
                    title="ФИО"
                    width={"250px"}
                    dataIndex="fullname"
                    key="fullname"
                    {...getColumnSearchProps("fullname")}
                />
                <Column
                    title="Группа"
                    width={"100px"}
                    dataIndex="group"
                    key="group"
                    {...getColumnSearchProps("group")}
                />
                <Column
                    title="Название проекта"
                    width={"300px"}
                    dataIndex="projectName"
                    key="projectName"
                    render={(value, record) => {
                        return <div className={styles.nameItem}>
                            <p>{value}</p>
                            <a href={"https://teamproject.urfu.ru/,#/" + record.projectKey + "/about"} target="_blank">
                                <LinkOutlined className={styles.link}/></a>
                        </div>
                    }}
                    {...getColumnSearchProps("projectName")}
                />
                <Column title="Куратор" width={"200px"} dataIndex="curator" key="curator"
                        {...getColumnSearchProps("curator")}
                />
                <Column title="Оценка комиссии" width={"100px"} dataIndex="expertsScore" key="expertsScore"
                        filters={[{text: "Есть оценка", value: "Есть оценка"}, {text: "Нет оценки", value: "Нет оценки"}]}
                        onFilter={(value, record) => {
                            return value === "Есть оценка" ?
                                record.expertsScore !== "Нет оценки" :
                                record.expertsScore === "Нет оценки";
                        }}
                />
                <Column title="Оценка студента" width={"100px"} dataIndex="finalScore" key="finalScore"
                        filters={[{text: "Есть оценка", value: "Есть оценка"}, {text: "Нет оценки", value: "Нет оценки"}]}
                        onFilter={(value, record) => {
                            return value === "Есть оценка" ?
                                record.finalScore !== "Нет оценки" :
                                record.finalScore === "Нет оценки";
                        }}
                />
                <Column title="Пересдача" width={"100px"} dataIndex="retakedScore" key="retakedScore"
                        filters={[{text: "Пересдавал", value: "Пересдавал"}, {text: "Не пересдавал", value: "Не пересдавал"}]}
                        onFilter={(value, record) => {
                            return value === "Пересдавал" ?
                                record.retakedScore !== "Не пересдавал" :
                                record.retakedScore === "Не пересдавал";
                        }}
                />
                <Column
                    width="90px"
                    title="Действия"
                    key="action"
                    render={(value, record) => {
                        return <Space size="small" direction="vertical">
                            <Link to={`${record.key}`}>К студенту</Link>
                            <Link to={"/teamproject/projects/" + record.projectKey}>К проекту</Link>
                        </Space>
                    }}

                />
            </Table>
        </div>
    );
};
