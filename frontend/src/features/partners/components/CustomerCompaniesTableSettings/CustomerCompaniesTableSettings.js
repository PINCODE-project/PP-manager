import React, {useState} from 'react';
import {App, Button, Drawer, Input, Switch, Table} from "antd";
import {useDispatch} from "react-redux";
import {DndContext, PointerSensor, useSensor, useSensors} from '@dnd-kit/core';
import {restrictToVerticalAxis} from '@dnd-kit/modifiers';
import {arrayMove, SortableContext, useSortable, verticalListSortingStrategy,} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import styles from "./CustomerCompaniesTableSettings.module.css"
import {initialPassportsTableColumns} from "../../pages/PartnersPassportsPage/PartnersPassportsPage";
import {
    initialCustomerCompaniesTableColumns
} from "../../pages/PartnersCusomerCompaniesPage/PartnersCustomerCompaniesPage";

const {TextArea} = Input;
const {Column, ColumnGroup} = Table;


const Row = (props) => {
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
        id: props['data-row-key'],
    });
    const style = {
        ...props.style,
        transform: CSS.Transform.toString(
            transform && {
                ...transform,
                scaleY: 1,
            },
        ),
        transition,
        cursor: 'move',
        ...(isDragging
            ? {
                position: 'relative',
                zIndex: 9999,
            }
            : {}),
    };
    return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
};


export default function CustomerCompaniesTableSettings(props) {
    const {message} = App.useApp();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 1,
            },
        }),
    );
    const onDragEnd = ({active, over}) => {
        if (active.id !== over?.id) {
            props.setTableColumns((prev) => {
                const activeIndex = prev.findIndex((i) => i.key === active.id);
                const overIndex = prev.findIndex((i) => i.key === over?.id);
                return arrayMove(prev, activeIndex, overIndex);
            });
        }
    };


    return (
        <Drawer
            title="Настройки таблицы заказчиков"
            onClose={() => {
                props.setTableColumns(JSON.parse(localStorage.getItem("PP-manager-customer-companies-columns")) || initialCustomerCompaniesTableColumns)
                props.setIsOpen(false)
            }}
            open={props.isOpen}
        >
            <div className={styles.content}>
                <div className={styles.buttons}>
                    <Button
                        type="primary"
                        onClick={() => {
                            localStorage.setItem(
                                "PP-manager-customer-companies-columns",
                                JSON.stringify(props.tableColumns)
                            );
                            message.success("Настройки таблицы успешно сохранены!")
                        }}
                    >
                        Сохранить
                    </Button>
                    <Button
                        onClick={() => {
                            props.setTableColumns(initialCustomerCompaniesTableColumns);
                            localStorage.setItem(
                                "PP-manager-customer-companies-columns",
                                JSON.stringify(initialCustomerCompaniesTableColumns)
                            );
                            message.success("Настройки таблицы успешно сброшены!")
                        }}>
                        Сбросить
                    </Button>
                </div>
                <div className={styles.columnSwitchs}>
                    <div className={styles.columnSwitch}>
                        <Switch value={props.tableColumns.find(column => column.key === "name")} onChange={(value) => {
                            value ? props.setTableColumns([...props.tableColumns, {
                                    key: 'name',
                                    name: 'Заказчик',
                                }]) :
                                props.setTableColumns([...props.tableColumns.filter(column => column.key !== 'name')])
                        }}/>
                        Заказчик
                    </div>
                    <div className={styles.columnSwitch}>
                        <Switch value={props.tableColumns.find(column => column.key === "law_address")} onChange={(value) => {
                            value ? props.setTableColumns([...props.tableColumns, {
                                    key: 'law_address',
                                    name: 'Адрес',
                                }]) :
                                props.setTableColumns([...props.tableColumns.filter(column => column.key !== 'law_address')])
                        }}/>
                        Адрес
                    </div>
                    <div className={styles.columnSwitch}>
                        <Switch value={props.tableColumns.find(column => column.key === "inn")}
                                onChange={(value) => {
                                    value ? props.setTableColumns([...props.tableColumns, {
                                            key: 'inn',
                                            name: 'ИНН',
                                        }]) :
                                        props.setTableColumns([...props.tableColumns.filter(column => column.key !== 'inn')])
                                }}/>
                        ИНН
                    </div>
                    <div className={styles.columnSwitch}>
                        <Switch value={props.tableColumns.find(column => column.key === "ogrn")}
                                onChange={(value) => {
                                    value ? props.setTableColumns([...props.tableColumns, {
                                            key: 'ogrn',
                                            name: 'ОГРН',
                                        }]) :
                                        props.setTableColumns([...props.tableColumns.filter(column => column.key !== 'ogrn')])
                                }}/>
                        ОГРН
                    </div>
                    <div className={styles.columnSwitch}>
                        <Switch value={props.tableColumns.find(column => column.key === "phone")}
                                onChange={(value) => {
                                    value ? props.setTableColumns([...props.tableColumns, {
                                            key: 'phone',
                                            name: 'Телефон',
                                        }]) :
                                        props.setTableColumns([...props.tableColumns.filter(column => column.key !== 'phone')])
                                }}/>
                        Телефон
                    </div>
                    <div className={styles.columnSwitch}>
                        <Switch value={props.tableColumns.find(column => column.key === "customer_users_count")} onChange={(value) => {
                            value ? props.setTableColumns([...props.tableColumns, {
                                    key: 'customer_users_count',
                                    name: 'Количество представителей',
                                }]) :
                                props.setTableColumns([...props.tableColumns.filter(column => column.key !== 'customer_users_count')])
                        }}/>
                        Количество представителей
                    </div>
                    <div className={styles.columnSwitch}>
                        <Switch value={props.tableColumns.find(column => column.key === "requests_count")}
                                onChange={(value) => {
                                    value ? props.setTableColumns([...props.tableColumns, {
                                            key: 'requests_count',
                                            name: 'Количество заявок',
                                        }]) :
                                        props.setTableColumns([...props.tableColumns.filter(column => column.key !== 'requests_count')])
                                }}/>
                        Количество заявок
                    </div>
                </div>

                <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                    <SortableContext
                        items={props.tableColumns.map((i) => i.key)}
                        strategy={verticalListSortingStrategy}
                    >
                        <Table
                            bordered={true}
                            components={{
                                body: {
                                    row: Row,
                                },
                            }}
                            pagination={false}
                            rowKey="key"
                            dataSource={props.tableColumns}
                        >
                            <Column
                                title="Столбцы"
                                width={90}
                                dataIndex="name"
                                key="name"
                            />
                        </Table>
                    </SortableContext>
                </DndContext>
            </div>
        </Drawer>
    );
};
