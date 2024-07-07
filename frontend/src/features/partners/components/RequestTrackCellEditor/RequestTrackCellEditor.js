import React, {useEffect, useState} from 'react';
import {App, Button, Input, Select, Table, Tag} from "antd";
import {useDispatch} from "react-redux";
import styles from "./RequestTrackCellEditor.module.css"
import {CheckCircleOutlined, EditOutlined} from "@ant-design/icons";
import {updateRequest} from "../../../../store/slices/requestSlice";
import {setEditedRequests, setEditRequests, setRequests} from "../../../../store/slices/requestsSlice";
import {useRequests} from "../../../../hooks/use-requests";

const {TextArea} = Input;
const {Column, ColumnGroup} = Table;

export default function RequestTrackCellEditor(props) {
    const {message} = App.useApp();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [tagOptions, setTagOptions] = useState([])
    const [requestTags, setRequestTags] = useState([])

    const requests = useRequests()

    useEffect(() => {
        setTagOptions([{
            value: null,
            label: "!Нет"
        }, ...props.tags.filter(tag => tag.is_track).map(tag => ({
            value: tag.id,
            label: tag.text,
        }))])
    }, [props.tags])

    useEffect(() => {
        setRequestTags(props.request.track?.id)
    }, [props.request])

    if (!props.isEdit) {
        return (
            <div className={styles.tags__container}>
                <div className={styles.tags__list}>
                    {
                        props.value &&
                        <Tag color={props.value?.color}>{props.value?.text}</Tag>
                    }
                </div>
            </div>
        )
    }


    const editRequestTrack = (value) => {
        setRequestTags(value)
        const editedRequest = requests.editedRequests.find(editedRequest => editedRequest.id === props.request.id)
        if (!editedRequest) {
            console.log(value)
            dispatch(setEditedRequests([...requests.editedRequests, {id: props.request.id, track: value}]))
        } else {
            dispatch(setEditedRequests([...requests.editedRequests.filter(editedRequestFilter => editedRequestFilter.id !== editedRequest.id), {
                ...editedRequest,
                track: value
            }]))
        }
    }

    return (
        <div className={styles.tags__container}>
            <Select
                style={{
                    width: '100%',
                }}
                // allowClear={true}
                showSearch={true}
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
                placeholder="Выберите трек"
                onChange={(value) => editRequestTrack(value)}
                options={tagOptions}
                value={requestTags}
            />
        </div>
    );
};
