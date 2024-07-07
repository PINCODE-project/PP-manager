import React, {useState} from 'react';
import {App, Button, Drawer, Input, Switch, Table} from "antd";
import {useDispatch} from "react-redux";
import {DndContext, PointerSensor, useSensor, useSensors} from '@dnd-kit/core';
import {restrictToVerticalAxis} from '@dnd-kit/modifiers';
import {arrayMove, SortableContext, useSortable, verticalListSortingStrategy,} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import styles from "./ProjectsTableSettings.module.css"
import {initialProjectsTableColumns} from "../../pages/TeamprojectProjectsPage/TeamprojectProjectsPage";

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


export default function ProjectsTableSettings(props) {
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
            title="Настройки таблицы проектов"
            onClose={() => {
                props.setTableColumns(JSON.parse(localStorage.getItem("PP-manager-projects-columns")) || initialProjectsTableColumns)
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
                                "PP-manager-projects-columns",
                                JSON.stringify(props.tableColumns)
                            );
                            message.success("Настройки таблицы успешно сохранены!")
                        }}
                    >
                        Сохранить
                    </Button>
                    <Button
                        onClick={() => {
                            props.setTableColumns(initialProjectsTableColumns);
                            localStorage.setItem(
                                "PP-manager-projects-columns",
                                JSON.stringify(initialProjectsTableColumns)
                            );
                            message.success("Настройки таблицы успешно сброшены!")
                        }}>
                        Сбросить
                    </Button>
                </div>
                <div className={styles.columnSwitchs}>
                    {
                        initialProjectsTableColumns.map(column => {
                            return <div className={styles.columnSwitch}>
                                <Switch value={props.tableColumns.find(tableColumn => tableColumn.key === column.key)}
                                        onChange={(value) => {
                                            value ? props.setTableColumns([...props.tableColumns, column]) :
                                                props.setTableColumns([...props.tableColumns.filter(tableColumn => tableColumn.key !== column.key)])
                                        }}/>
                                {column.name}
                            </div>
                        })
                    }
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
