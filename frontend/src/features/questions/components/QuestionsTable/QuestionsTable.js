import React, {useRef, useState} from 'react';
import {App, Button, Input, Space, Table, Typography} from "antd";
import {useDispatch} from "react-redux";
import styles from "./RequestsTable.module.css"
import {DeleteOutlined, SearchOutlined} from "@ant-design/icons";
import {removeQuestion} from "../../../../store/slices/questionsSlice";
import {unauthorizedHandler} from "../../../../core/utils/unauthorizedHandler";
import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";

const {Column, ColumnGroup} = Table;
const {Paragraph} = Typography;

export default function QuestionsTable(props) {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const dispatch = useDispatch()
    const {message} = App.useApp();

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm({
            closeDropdown: false,
        });
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleDelete = (id) => {
        dispatch(removeQuestion(id)).catch((error) => unauthorizedHandler(error, dispatch, message))
    }

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
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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
                dataSource={props.questions}
                size="small"
                scroll={{
                    y: "100%",
                    x: "max-content"
                }}
                pagination={false}
                // pagination={{
                //     pageSize: 30,
                //     showSizeChanger: false
                // }}
                rowClassName={(record, index) => index % 2 === 0 ? '' : styles.darkRow}
            >
                {
                    props.columns.map(column => {
                        if (column.key === "section")
                            return <Column
                                title="Раздел"
                                width={200}
                                dataIndex="section"
                                key="section"

                                // filters={!tags.isLoading ? tags.tags.filter(tag => tag.is_track).map(tag => ({
                                //     text: tag.text,
                                //     value: tag.id
                                // })) : []}
                                // {...getColumnSearchProps("section")}
                            />

                        if (column.key === "question")
                            return <Column
                                title="Вопрос"
                                width={400}
                                dataIndex="question"
                                key="question"
                                {...getColumnSearchProps("question")}
                            />

                        if (column.key === "answer")
                            return <Column
                                title="Ответ"
                                width={400}
                                dataIndex="answer"
                                key="answer"
                                render={(value) => {
                                    return <Markdown remarkPlugins={[[remarkGfm, {singleTilde: false}]]}>
                                        {value}
                                    </Markdown>
                                }}
                            />
                    })
                }
                <Column
                    title="Действия"
                    key="action"
                    width={80}
                    render={(_, record) => (
                        <Space size="middle">
                            {/*<Button icon={<EditOutlined/>}/>*/}
                            <Button danger icon={<DeleteOutlined/>} onClick={() => handleDelete(record.id)}/>
                        </Space>
                    )}
                />
            </Table>
        </div>
    );
};
