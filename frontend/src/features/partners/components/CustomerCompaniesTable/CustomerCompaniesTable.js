import React, {useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {App, Button, Input, Space, Table, Tag} from "antd";
import {useDispatch} from "react-redux";
import styles from "./CustomerCompaniesTable.module.css"
import {SearchOutlined} from "@ant-design/icons";

const {Column, ColumnGroup} = Table;
const {TextArea} = Input;

export default function CustomerCompaniesTable(props) {
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
            setTableCount(props.customerCompanies.filter(vallue => {
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
                title={() => `${tableCount} элементов`}
                bordered={true}
                dataSource={props.customerCompanies}
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
                        if (column.key === "name")
                            return <Column
                                title="Заказчик"
                                width={200}
                                dataIndex="name"
                                key="name"
                                {...getColumnSearchProps("name")}
                            />

                        if (column.key === "law_address")
                            return <Column
                                title="Адрес"
                                width={200}
                                dataIndex="law_address"
                                key="law_address"
                                {...getColumnSearchProps("law_address")}
                            />

                        if (column.key === "inn")
                            return <Column
                                title="ИНН"
                                width={90}
                                dataIndex="inn"
                                key="inn"
                                {...getColumnSearchProps("inn")}
                            />

                        if (column.key === "ogrn")
                            return <Column
                                title="ОГРН"
                                width={90}
                                dataIndex="ogrn"
                                key="ogrn"
                                {...getColumnSearchProps("ogrn")}
                            />

                        if (column.key === "phone")
                            return <Column
                                title="Телефон"
                                width={80}
                                dataIndex="phone"
                                key="phone"
                                {...getColumnSearchProps("phone")}
                            />

                        if (column.key === "customer_users_count")
                            return <Column
                                title="Количество представителей"
                                width={90}
                                dataIndex="customer_users_count"
                                key="customer_users_count"
                            />

                        if (column.key === "requests_count")
                            return <Column
                                title="Количество заявок"
                                width={90}
                                dataIndex="requests_count"
                                key="requests_count"
                                sorter={(a, b) => a.requests_count - b.requests_count}
                            />
                    })
                }
            </Table>
        </div>
    );
};
