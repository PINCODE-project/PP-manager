import React, {useEffect, useRef, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {App, Button, Dropdown, Input, Space, Table, Typography} from "antd";
import {useDispatch} from "react-redux";
import styles from "./StudentsTable.module.css"
import {SearchOutlined} from "@ant-design/icons";
import {getAllTags} from "../../../../store/slices/tagsSlice";
import {useTags} from "../../../../hooks/use-tags";
import {normalizeCountForm} from "../../../../core/utils/normalizeCountForm";

const {Column, ColumnGroup} = Table;
const {TextArea} = Input;
const {Paragraph} = Typography;

export default function StudentsTable(props) {
    const navigate = useNavigate()
    const {message} = App.useApp();
    const dispatch = useDispatch();

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const [tableCount, setTableCount] = useState(0);

    const tags = useTags()

    useEffect(() => {
        dispatch(getAllTags())
    }, []);

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
                    placeholder={`Поиск`}
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
            setTableCount(props.students.filter(vallue => {
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

    const getCurrentProjectDropdown = (value, record) => [
        {
            key: '0',
            label: (
                <a target="_blank" href={"https://teamproject.urfu.ru/#/" + record.currentProjectId + "/about"}>
                    Перейти к проекту в Teamproject
                </a>
            ),
        },
        {
            key: '1',
            label: (
                <Link to={"/teamproject/projects/"+record.currentProjectId}>
                    Перейти к проекту в PP-manager
                </Link>
            ),
        },
    ]

    const getCurrentProjectPassportDropdown = (value, record) => [
        {
            key: '0',
            label: (
                <a target="_blank" href={"https://partner.urfu.ru/ptraining/services/learning/#/passport/" + record.currentProjectPassportId}>
                    Перейти к паспорту в ЛКП
                </a>
            ),
        },
    ]

    const getCurrentProjectRequestDropdown = (value, record) => [
        {
            key: '0',
            label: (
                <a target="_blank" href={"https://partner.urfu.ru/ptraining/services/learning/#/requests/" + record.currentProjectRequestId}>
                    Перейти к заявке в ЛКП
                </a>
            ),
        },
    ]

    return (
        <div className={styles.tableContainer}>
            <Table
                className={styles.table}
                title={() => `${tableCount} ${normalizeCountForm(tableCount, ["элемент", 'элемента', 'элементов'])}`}
                bordered={true}
                dataSource={props.students}
                size="small"
                scroll={{
                    y: "100%",
                    x: "max-content"
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
                        if (column.key === "fullname")
                            return <Column
                                title="ФИО студента"
                                width={150}
                                dataIndex="fullname"
                                key="fullname"
                                sorter={{
                                    compare: (a, b) => a.fullname.localeCompare(b.fullname),
                                    multiple: 6
                                }}
                                render={(value, record) => {
                                    return (
                                        <Link to={`${record.id}`}>
                                            {value}
                                        </Link>
                                    )
                                }}
                                {...getColumnSearchProps("fullname")}
                            />

                        if (column.key === "phone")
                            return <Column
                                title="Телефон"
                                width={90}
                                dataIndex="phone"
                                key="phone"
                                // sorter={(a, b) => a.date - b.date}
                                {...getColumnSearchProps("phone")}
                            />

                        if (column.key === "email")
                            return <Column
                                title="Почта"
                                width={90}
                                dataIndex="email"
                                key="email"
                                // sorter={(a, b) => a.date - b.date}
                                {...getColumnSearchProps("email")}
                            />

                        if (column.key === "groupName")
                            return <Column
                                title="Академическая группа"
                                width={150}
                                dataIndex="groupName"
                                key="groupName"
                                sorter={{
                                    compare: (a, b) => a.groupName.localeCompare(b.groupName),
                                    multiple: 5
                                }}
                                {...getColumnSearchProps("groupName")}
                            />

                        if (column.key === "currentProject")
                            return (
                                <Column
                                    title="Проект семестра"
                                    width={230}
                                    dataIndex="currentProjectName"
                                    key="currentProjectName"
                                    render={(value, record) => {
                                        return (
                                            <Dropdown
                                                trigger={['click']}
                                                menu={{
                                                    items: getCurrentProjectDropdown(value, record),
                                                }}
                                            >
                                                <a onClick={(e) => e.preventDefault()}>
                                                    {value}
                                                </a>
                                            </Dropdown>
                                        )
                                    }}
                                    {...getColumnSearchProps("currentProjectName")}
                                />
                            )

                        if (column.key === "currentProjectPassportUid")
                            return (
                                <Column
                                    title="Паспорт"
                                    width={80}
                                    dataIndex="currentProjectPassportUid"
                                    key="currentProjectPassportUid"
                                    render={(value, record) => {
                                        return (
                                            <Dropdown
                                                trigger={['click']}
                                                menu={{
                                                    items: getCurrentProjectPassportDropdown(value, record),
                                                }}
                                            >
                                                <a onClick={(e) => e.preventDefault()}>
                                                    {value}
                                                </a>
                                            </Dropdown>
                                        )
                                    }}
                                    {...getColumnSearchProps("currentProjectPassportUid")}
                                />
                            )

                        if (column.key === "currentProjectRequestUid")
                            return (
                                <Column
                                    title="Заявка"
                                    width={80}
                                    dataIndex="currentProjectRequestUid"
                                    key="currentProjectRequestUid"
                                    render={(value, record) => {
                                        return (
                                            <Dropdown
                                                trigger={['click']}
                                                menu={{
                                                    items: getCurrentProjectRequestDropdown(value, record),
                                                }}
                                            >
                                                <a onClick={(e) => e.preventDefault()}>
                                                    {value}
                                                </a>
                                            </Dropdown>
                                        )
                                    }}
                                    {...getColumnSearchProps("currentProjectRequestUid")}
                                />
                            )

                        if (column.key === "currentProjectCurator")
                            return <Column
                                title="Куратор"
                                width={140}
                                dataIndex="currentProjectCurator"
                                key="currentProjectCurator"
                                sorter={{
                                    compare: (a, b) => a.currentProjectCurator - b.currentProjectCurator,
                                    multiple: 4
                                }}
                                {...getColumnSearchProps("currentProjectCurator")}
                            />

                        if (column.key === "expertsScore")
                            return <Column
                                title="Оценка комиссии"
                                width={100}
                                dataIndex="expertsScore"
                                key="expertsScore"
                                sorter={{
                                    compare: (a, b) => a.expertsScore - b.expertsScore,
                                    multiple: 3
                                }}
                            />

                        if (column.key === "finalScore")
                            return <Column
                                title="Оценка студента"
                                width={100}
                                dataIndex="finalScore"
                                key="finalScore"
                                sorter={{
                                    compare: (a, b) => a.finalScore - b.finalScore,
                                    multiple: 2
                                }}
                            />

                        if (column.key === "retakedScore")
                            return <Column
                                title="Пересдача"
                                width={100}
                                dataIndex="retakedScore"
                                key="retakedScore"
                                sorter={{
                                    compare: (a, b) => a.retakedScore - b.retakedScore,
                                    multiple: 1
                                }}
                            />
                    })
                }
                {/*<Column*/}
                {/*    width={90}*/}
                {/*    title="Действие"*/}
                {/*    key="action"*/}
                {/*    render={(value, record) => {*/}
                {/*        return <Space size="middle">*/}
                {/*            <a*/}
                {/*                onClick={() => {*/}
                {/*                    props.setIsPassportEditOpen(true);*/}
                {/*                    props.setEditPassportId(record.id)*/}
                {/*                }}*/}
                {/*            >*/}
                {/*                Редактировать*/}
                {/*            </a>*/}
                {/*        </Space>*/}
                {/*    }}*/}
                {/*/>*/}
            </Table>
        </div>
    );
};
