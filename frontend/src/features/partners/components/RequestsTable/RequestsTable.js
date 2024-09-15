import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { App, Button, Input, Space, Table, Typography } from "antd";
import { useDispatch } from "react-redux";
import styles from "./RequestsTable.module.css";
import { SearchOutlined } from "@ant-design/icons";
import { useTags } from "../../../../hooks/use-tags";
import RequestTagsCellEditor from "../RequestTagsCellEditor/RequestTagsCellEditor";
import { getAllTags } from "../../../../store/slices/tagsSlice";
import parse from "html-react-parser";
import RequestStudentsCountCellEditor from "../RequestStudentsCountCellEditor/RequestStudentsCountCellEditor";
import RequestTrackCellEditor from "../RequestTrackCellEditor/RequestTrackCellEditor";
import { normalizeCountForm } from "../../../../core/utils/normalizeCountForm";

const { Column, ColumnGroup } = Table;
const { Paragraph } = Typography;

export default function RequestsTable(props) {
    const navigate = useNavigate();
    const { message } = App.useApp();
    const dispatch = useDispatch();

    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);

    const [tableCount, setTableCount] = useState(0);

    const tags = useTags();

    useEffect(() => {
        dispatch(getAllTags());
    }, []);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm({
            closeDropdown: false,
        });
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
                             setSelectedKeys,
                             selectedKeys,
                             confirm,
                             clearFilters,
                             close,
                         }) => (
            <div
                style={ {
                    padding: 8,
                } }
                onKeyDown={ (e) => e.stopPropagation() }
            >
                <Input
                    ref={ searchInput }
                    placeholder={ `Поиск` }
                    value={ selectedKeys[0] }
                    onChange={ (e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={ () => handleSearch(selectedKeys, confirm, dataIndex) }
                    style={ {
                        marginBottom: 8,
                        display: "block",
                    } }
                />
                <Space >
                    <Button
                        type="primary"
                        onClick={ () => handleSearch(selectedKeys, confirm, dataIndex) }
                        icon={ <SearchOutlined /> }
                        size="small"
                        style={ {
                            width: 90,
                        } }
                    >
                        Найти
                    </Button >
                </Space >
            </div >
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={ {
                    color: filtered ? "#1677ff" : undefined,
                } }
            />
        ),
        onFilter: (value, record) => {
            setTableCount(
                props.requests.filter((vallue) => {
                    vallue[dataIndex]
                        .toString()
                        .toLowerCase()
                        .includes(value.toLowerCase());
                }).length,
            );
            return record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase());
        },
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });

    return (
        <div className={ styles.tableContainer } >
            <Table
                className={ styles.table }
                bordered={ true }
                title={ () =>
                    `${ tableCount } ${ normalizeCountForm(tableCount, [
                        "элемент",
                        "элемента",
                        "элементов",
                    ]) }`
                }
                dataSource={ props.isEdit ? props.editRequests : props.requests }
                size="small"
                scroll={ {
                    y: "100%",
                    x: "max-content",
                } }
                pagination={ {
                    pageSize: 30,
                    showSizeChanger: false,
                    showTotal: (total, range) => {
                        console.log(total, range);
                        setTableCount(total);
                        return ``;
                    },
                } }
                rowClassName={ (record, index) =>
                    index % 2 === 0 ? "" : styles.darkRow
                }
            >
                { props.columns.map((column) => {
                    if (column.key === "uid")
                        return (
                            <Column
                                title="Номер заявки"
                                width={ 80 }
                                dataIndex="uid"
                                key="uid"
                                render={ (value, record) => {
                                    return (
                                        <a
                                            target="_blank"
                                            href={
                                                "https://partner.urfu.ru/ptraining/services/learning/#/requests/" +
                                                record.id
                                            }
                                        >
                                            { value }
                                        </a >
                                    );
                                } }
                                { ...getColumnSearchProps("uid") }
                            />
                        );

                    if (column.key === "date")
                        return (
                            <Column
                                title="Дата"
                                width={ 50 }
                                dataIndex="date"
                                key="date"
                                render={ (value, record) => {
                                    return <p >{ value.toLocaleDateString() }</p >;
                                } }
                                sorter={ (a, b) => a.date - b.date }
                                { ...getColumnSearchProps("date_string") }
                            />
                        );

                    if (column.key === "name")
                        return (
                            <Column
                                title="Название"
                                width={ 200 }
                                dataIndex="name"
                                key="name"
                                sorter={ (a, b) => a.name.localeCompare(b.name) }
                                { ...getColumnSearchProps("name") }
                            />
                        );

                    if (column.key === "status")
                        return (
                            <Column
                                title="Статус"
                                width={ 90 }
                                dataIndex="status"
                                key="status"
                                { ...getColumnSearchProps("status") }
                            />
                        );

                    if (column.key === "track")
                        return (
                            <Column
                                title="Трек"
                                width={ 150 }
                                dataIndex="track"
                                key="track"
                                render={ (value, record) => {
                                    return (
                                        <RequestTrackCellEditor
                                            isEdit={ props.isEdit }
                                            value={ value }
                                            tags={ !tags.isLoading ? tags.tags : [] }
                                            request={ record }
                                            requests={ props.defaultRequests.requests }
                                        />
                                    );
                                } }
                                filters={
                                    !tags.isLoading
                                        ? tags.tags
                                            .filter((tag) => tag.is_track)
                                            .map((tag) => ({
                                                text: tag.text,
                                                value: tag.id,
                                            }))
                                        : []
                                }
                                onFilter={ (value, record) =>
                                    record.track.find((t) => t.id === value)
                                }
                            />
                        );

                    if (column.key === "tags")
                        return (
                            <Column
                                title="Теги"
                                width={ 200 }
                                dataIndex="tags"
                                key="tags"
                                render={ (value, record) => {
                                    return (
                                        <RequestTagsCellEditor
                                            isEdit={ props.isEdit }
                                            value={ value }
                                            tags={ !tags.isLoading ? tags.tags : [] }
                                            request={ record }
                                            requests={ props.defaultRequests.requests }
                                        />
                                    );
                                } }
                                filters={
                                    !tags.isLoading
                                        ? tags.tags.map((tag) => ({
                                            text: tag.text,
                                            value: tag.id,
                                        }))
                                        : []
                                }
                                onFilter={ (value, record) =>
                                    record.tags.find((t) => t.id === value)
                                }
                            />
                        );

                    if (column.key === "goal")
                        return (
                            <Column
                                title="Цель"
                                width={ 200 }
                                dataIndex="goal"
                                key="goal"
                                render={ (value, record) => {
                                    return (
                                        <Paragraph
                                            ellipsis={ {
                                                rows: 10,
                                                expandable: true,
                                                symbol: "Подробнее",
                                            } }
                                        >
                                            { parse(value) }
                                        </Paragraph >
                                    );
                                } }
                                { ...getColumnSearchProps("goal") }
                            />
                        );

                    if (column.key === "result")
                        return (
                            <Column
                                title="Результат"
                                width={ 200 }
                                dataIndex="result"
                                key="result"
                                render={ (value, record) => {
                                    return (
                                        <Paragraph
                                            ellipsis={ {
                                                rows: 10,
                                                expandable: true,
                                                symbol: "Подробнее",
                                            } }
                                        >
                                            { parse(value) }
                                        </Paragraph >
                                    );
                                } }
                                { ...getColumnSearchProps("result") }
                            />
                        );

                    if (column.key === "description")
                        return (
                            <Column
                                title="Описание"
                                width={ 450 }
                                dataIndex="description"
                                key="description"
                                render={ (value, record) => {
                                    return (
                                        <Paragraph
                                            ellipsis={ {
                                                rows: 10,
                                                expandable: true,
                                                symbol: "Подробнее",
                                            } }
                                        >
                                            { parse(value) }
                                        </Paragraph >
                                    );
                                } }
                                { ...getColumnSearchProps("description") }
                            />
                        );

                    if (column.key === "criteria")
                        return (
                            <Column
                                title="Критерии оценивания"
                                width={ 300 }
                                dataIndex="criteria"
                                key="criteria"
                                render={ (value, record) => {
                                    return (
                                        <Paragraph
                                            ellipsis={ {
                                                rows: 10,
                                                expandable: true,
                                                symbol: "Подробнее",
                                            } }
                                        >
                                            { parse(value) }
                                        </Paragraph >
                                    );
                                } }
                                { ...getColumnSearchProps("criteria") }
                            />
                        );

                    if (column.key === "customer_company_name")
                        return (
                            <Column
                                title="Заказчик"
                                width={ 150 }
                                dataIndex="customer_company_name"
                                key="customer_company_name"
                                { ...getColumnSearchProps("customer_company_name") }
                            />
                        );

                    if (column.key === "customer_name")
                        return (
                            <Column
                                title="Представитель заказчика"
                                width={ 130 }
                                dataIndex="customer_name"
                                key="customer_name"
                                { ...getColumnSearchProps("customer_name") }
                            />
                        );

                    if (column.key === "max_copies")
                        return (
                            <Column
                                title="Максимальное количество копий"
                                width={ 130 }
                                dataIndex="max_copies"
                                key="max_copies"
                                sorter={ (a, b) => a.max_copies - b.max_copies }
                            />
                        );

                    if (column.key === "students_count")
                        return (
                            <Column
                                title="Количество студентов"
                                width={ 140 }
                                dataIndex="students_count"
                                key="students_count"
                                render={ (value, record) => {
                                    return (
                                        <RequestStudentsCountCellEditor
                                            isEdit={ props.isEdit }
                                            value={ value }
                                            request={ record }
                                            requests={ props.defaultRequests.requests }
                                        />
                                    );
                                } }
                                sorter={ (a, b) => a.students_count - b.students_count }
                            />
                        );

                    if (column.key === "programs")
                        return (
                            <Column
                                title="Образовательные программы"
                                width={ 150 }
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
                }) }
            </Table >
        </div >
    );
}
