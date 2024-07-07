import React, {useCallback, useEffect, useState} from 'react';
import {App, Button, Drawer, Input, Select, Switch, Table} from "antd";
import {useDispatch} from "react-redux";
import {DndContext, PointerSensor, useSensor, useSensors} from '@dnd-kit/core';
import {restrictToVerticalAxis} from '@dnd-kit/modifiers';
import {arrayMove, SortableContext, useSortable, verticalListSortingStrategy,} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import styles from "./PassportSettings.module.css"
import {initialPassportsTableColumns} from "../../pages/PartnersPassportsPage/PartnersPassportsPage";
import {usePassport} from "../../../../hooks/use-passport";
import {getPassport, updatePassportTag} from "../../../../store/slices/passportSlice";
import {getAllTags} from "../../../../store/slices/tagsSlice";
import {useTags} from "../../../../hooks/use-tags";
import {loginUser} from "../../../../store/slices/authSlice";

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


export default function PassportSettings(props) {
    const {message} = App.useApp();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [tagOptions, setTagOptions] = useState([])
    const [passportTags, setPassportTags] = useState([])

    const passport = usePassport()
    const tags = useTags()

    useEffect(() => {
        dispatch(getPassport(props.editPassportId))
        dispatch(getAllTags())
    }, [])

    useEffect(() => {
        if(!tags.isLoading)
            setTagOptions(tags.tags.map(tag => ({
                value: tag.id,
                label: tag.text,
            })))
    }, [tags])

    useEffect(() => {
        if(!passport.isLoading)
            setPassportTags(passport.passport.tags.map(tag => tag.id))
    }, [passport])

    const savePassport = () => {
        // if (!isLoading) {
        //     setIsLoading(true);
        //     message.loading({content: "Сохраняю паспорт...", key: 'updatePassport', duration: 0})
        //
        //     dispatch(updatePassportTag({
        //         id: props.editPassportId,
        //         tags: passportTags
        //     })).then((response) => {
        //         setIsLoading(false)
        //         message.destroy('updatePassport')
        //         message.success({content: "Вы успешно обновили паспорт"})
        //     }, (error) => {
        //         setIsLoading(false)
        //         message.destroy('updatePassport')
        //         message.error({content: error.message})
        //     });
        // }
    }

    if(tags.isLoading || passport.isLoading)
        return;

    console.log(passportTags)

    return (
        <Drawer
            title="Редактирование паспорта"
            onClose={() => {
                props.setIsOpen(false)
                props.setEditPassportId(null)
            }}
            open={props.isOpen}
        >
            <div className={styles.content}>
                <div>
                    <p>{passport.passport.request.name}</p>
                </div>
                <div>
                    <Button onClick={savePassport} type="primary">Сохранить</Button>
                </div>
                <div className={styles.tagsContainer}>
                    <p>Теги</p>
                    <Select
                        mode="tags"
                        style={{
                            width: '100%',
                        }}

                        placeholder="Выберите теги"
                        onChange={(value) => setPassportTags(value)}
                        options={tagOptions}
                        value={passportTags}
                    />
                </div>
            </div>
        </Drawer>
    );
};
