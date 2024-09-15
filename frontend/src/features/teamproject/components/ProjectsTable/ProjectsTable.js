import React, {useRef, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {App, Avatar, Button, Dropdown, Input, Space, Table, Tag, Tooltip} from "antd";
import {useDispatch} from "react-redux";
import styles from "./ProjectsTable.module.css"
import {LinkOutlined, SearchOutlined} from "@ant-design/icons";
import {normalizeCountForm} from "../../../../core/utils/normalizeCountForm";

const {Column, ColumnGroup} = Table;

export default function ProjectsTable(props) {
    const navigate = useNavigate()
    const {message} = App.useApp();
    const dispatch = useDispatch();

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const [tableCount, setTableCount] = useState(0);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm({
            closeDropdown: false,
        });
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

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
        onFilter: (value, record) => {
            setTableCount(props.projects.filter(vallue => {
                vallue[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
            }).length)
            return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        },
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        }
    });

    const getUidPassportDropdown = (value, record) => [
        {
            key: '0',
            label: (
                <a target="_blank"
                   href={"https://partner.urfu.ru/ptraining/services/learning/#/passport/" + record.passport_id}>
                    Перейти к паспорту в ЛКП
                </a>
            ),
        }
    ]

    const getProjectNameDropdown = (value, record) => [
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

    return (
        <div className={styles.tableContainer}>
            <Table
                className={styles.table}
                bordered={true}
                dataSource={props.projects}
                size="small"
                title={() => `${tableCount} ${normalizeCountForm(tableCount, ["элемент", 'элемента', 'элементов'])}`}
                scroll={{
                    y: "100%",
                    x: false
                }}
                pagination={{
                    pageSize: 30,
                    showSizeChanger: false,
                    showTotal: (total, range) => {
                        console.log(total, range)
                        setTableCount(total);
                        return ``;
                    },
                }}
                rowClassName={(record, index) => index % 2 === 0 ? '' : styles.darkRow}
            >
                {
                    props.columns.map(column => {
                        if (column.key === "passport_uid")
                            return <Column
                                title="Паспорт"
                                width={90}
                                dataIndex="passport_uid"
                                key="passport_uid"
                                render={(value, record) => {
                                    return (
                                        <Dropdown
                                            trigger={['click']}
                                            menu={{
                                                items: getUidPassportDropdown(value, record),
                                            }}
                                        >
                                            <a onClick={(e) => e.preventDefault()}>
                                                {value}
                                            </a>
                                        </Dropdown>
                                    )
                                }}
                                {...getColumnSearchProps("passport_uid")}
                            />

                        if (column.key === "name")
                            return <Column
                                title="Название"
                                width={300}
                                dataIndex="name"
                                key="name"
                                render={(value, record) => {
                                    return (
                                        <Dropdown
                                            trigger={['click']}
                                            menu={{
                                                items: getProjectNameDropdown(value, record),
                                            }}
                                        >
                                            <a onClick={(e) => e.preventDefault()}>
                                                {value}
                                            </a>
                                        </Dropdown>
                                    )
                                }}
                                {...getColumnSearchProps("name")}
                            />

                        if (column.key === "students")
                            return <Column
                                title="Участники"
                                width={200}
                                dataIndex="students"
                                key="students"
                                render={(value, record) => {
                                    return <Avatar.Group className={styles.students}>
                                        {
                                            value.map(student => {
                                                return <Tooltip title={student.fullname} placement="top">
                                                    <Avatar
                                                        onClick={() => navigate(`/teamproject/students/${student.id}`)}
                                                        style={{
                                                            backgroundColor: "rgba(174, 126, 222, 0.6)",
                                                            cursor: "pointer"
                                                        }}
                                                    >
                                                        {student.fullname.split(" ")[0][0]}{student.fullname.split(" ")[1][0]}
                                                    </Avatar>
                                                </Tooltip>
                                            })
                                        }
                                    </Avatar.Group>
                                }}
                                {...getColumnSearchProps("students_name")}
                            />

                        if (column.key === "curator")
                            return <Column title="Куратор" width={200} dataIndex="curator" key="curator"
                                           {...getColumnSearchProps("curator")}
                            />

                        if (column.key === "isHaveReport")
                            return <Column
                                title="Отчет"
                                width={110}
                                dataIndex="isHaveReport"
                                key="isHaveReport"
                                render={(value, record) => {
                                    return value ? "Да" : "Нет"
                                }}
                                filters={[{text: "Да", value: true}, {text: "Нет", value: false},]}
                                onFilter={(value, record) => record.isHaveReport === value}
                            />

                        if (column.key === "isHavePresentation")
                            return <Column
                                title="Презентация"
                                width={120}
                                dataIndex="isHavePresentation"
                                key="isHavePresentation"
                                render={(value, record) => {
                                    return value ? "Да" : "Нет"
                                }}
                                filters={[{text: "Да", value: true}, {text: "Нет", value: false},]}
                                onFilter={(value, record) => record.isHavePresentation === value}
                            />

                        if (column.key === "comissionScore")
                            return <Column
                                width={100}
                                title="Оценка комиссии"
                                dataIndex="comissionScore"
                                key="comissionScore"
                                render={(value, record) => {
                                    return value === null ? "Нет оценки" : value
                                }}
                                filters={[{text: "Есть оценка", value: true}, {text: "Нет оценки", value: false}]}
                                onFilter={(value, record) => {
                                    return value ?
                                        record.comissionScore !== null :
                                        record.comissionScore === null;
                                }}
                            />

                        if (column.key === "status")
                            return <Column
                                title="Статус"
                                dataIndex="status"
                                key="status"
                                width={120}
                                render={(value) => {
                                    return <Tag color={value === "Активный" ? "green" : "gray"}>{value}</Tag>
                                }}
                                filters={[{text: "Активный", value: "Активный"}, {
                                    text: "Завершённый",
                                    value: "Завершённый"
                                },]}
                                onFilter={(value, record) => record.status.indexOf(value) === 0}
                            />

                        if (column.key === "programs")
                            return (
                                <Column
                                    title="Образовательные программы"
                                    width={ 300 }
                                    dataIndex="programs"
                                    key="programs"
                                    render={ (value, record) => {
                                        return (
                                            <div >
                                                { value.map((program) => (
                                                    <p >{ program.uid } { program.name }</p >
                                                )) }
                                            </div >
                                        );
                                    } }
                                    { ...getColumnSearchProps("programs_search") }
                                />
                            );
                    })
                }
            </Table>
        </div>
    );
};
