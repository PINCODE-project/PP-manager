import React, {useEffect, useState} from 'react';
import {Outlet} from 'react-router-dom';
import {MantineProvider} from '@mantine/core';
import styles from "./TagsEditor.module.css"
import {App, Button, Card, ColorPicker, Form, Input, Tag} from "antd";
import {loginUser} from "../../../../store/slices/authSlice";
import {useTags} from "../../../../hooks/use-tags";
import {getAllTags} from "../../../../store/slices/tagsSlice";
import {useDispatch} from "react-redux";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";

export default function TagsEditor() {
    const [isLoading, setIsLoading] = useState(false);
    const {message} = App.useApp();
    const dispatch = useDispatch()

    const tags = useTags();

    useEffect(() => {
        dispatch(getAllTags());
    }, []);

    const addTag = (payload) => {
        if (!isLoading) {
            setIsLoading(true);
            message.loading({content: "Создаю тег...", key: 'addTag', duration: 0})

            const data = {
                text: payload.text,
                color: payload.color
            }

            // dispatch(loginUser(data)).then((response) => {
            //     setIsLoading(false)
            //     message.destroy('logIn')
            //     message.success({content: "Вы успешно авторизовались"})
            //     navigate("/teamproject/projects")
            // }, (error) => {
            //     setIsLoading(false)
            //     message.destroy('logIn')
            //     message.error({content: error.message})
            // });
        }
    }

    return (
        <div className={styles.tagsEditor}>
            <h2 className={styles.tagsEditor__title}>Теги</h2>
            <Form
                name="addTag"
                className={styles.tagsEditor__addTagForm}
                onFinish={addTag}
                autoComplete="off"
                layout={'horizontal'}
                disabled={isLoading}
            >
                <Form.Item
                    name="text"
                    rules={[{required: true, message: 'Поле обязательно для ввода!'}]}
                >
                    <Input placeholder="Название тега"/>
                </Form.Item>
                <Form.Item>
                    <ColorPicker defaultValue="#1677ff" />
                </Form.Item>

                <Form.Item className={styles.tagsEditor__addTagForm__button}>
                    <Button type="primary" htmlType="submit" disabled={isLoading}>
                        Создать тег
                    </Button>
                </Form.Item>
            </Form>
            <div className={styles.tagsEditor__tagsList}>
                {
                    !tags.isLoading &&
                    tags.tags.map(tag => {
                        return <div className={styles.tagsEditor__tagsListElement}>
                            <Tag color={tag.color}>{tag.text}</Tag>
                            <Button icon={<EditOutlined/>}/>
                            <Button icon={<DeleteOutlined/>}/>
                        </div>
                    })
                }
            </div>
        </div>
    );
};
