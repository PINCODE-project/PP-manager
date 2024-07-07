import React, {useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {App, Button, Input, Space, Table} from "antd";
import {useDispatch} from "react-redux";
import styles from "./CustomerUsersTable.module.css"
import {SearchOutlined} from "@ant-design/icons";
import {normalizeCountForm} from "../../../../core/utils/normalizeCountForm";

const {Column, ColumnGroup} = Table;
const {TextArea} = Input;

export default function CustomerUsersTable(props) {
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
            setTableCount(props.customerUsers.filter(vallue => {
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

    return (
        <div className={styles.tableContainer}>
            <Table
                className={styles.table}
                bordered={true}
                dataSource={props.customerUsers}
                title={() => `${tableCount} ${normalizeCountForm(tableCount, ["элемент", 'элемента', 'элементов'])}`}
                size="small"
                scroll={{
                    y: "100%",
                    x: "calc(100vw - 170px - 80px)"
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
                        if (column.key === "name")
                            return <Column
                                title="ФИО"
                                width={130}
                                dataIndex="name"
                                key="name"
                                {...getColumnSearchProps("name")}
                            />

                        if (column.key === "email")
                            return <Column
                                title="Почта"
                                width={90}
                                dataIndex="email"
                                key="email"
                                {...getColumnSearchProps("email")}
                            />

                        if (column.key === "phone")
                            return <Column
                                title="Телефон"
                                width={90}
                                dataIndex="phone"
                                key="phone"
                                {...getColumnSearchProps("phone")}
                            />

                        if (column.key === "qualification")
                            return <Column
                                title="Квалификация"
                                width={90}
                                dataIndex="qualification"
                                key="qualification"
                                {...getColumnSearchProps("qualification")}
                            />


                        if (column.key === "requests_count")
                            return <Column
                                title="Количество заявок"
                                width={90}
                                dataIndex="requests_count"
                                key="requests_count"
                                {...getColumnSearchProps("requests_count")}
                            />

                        if (column.key === "customer_company_name")
                            return <Column
                                title="Организация"
                                width={150}
                                dataIndex="customer_company_name"
                                key="customer_company_name"
                                {...getColumnSearchProps("customer_company_name")}
                            />
                    })
                }
            </Table>
        </div>
    );
};
