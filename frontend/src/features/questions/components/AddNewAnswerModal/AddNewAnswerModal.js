import React, {useEffect, useState} from 'react';
import {App, Button, Form, Input, Modal, Select} from "antd";
import {useDispatch} from "react-redux";
import styles from "./AddNewAnswerModal.module.css"
import MyCodeMirror from "../MyCodeMirror/MyCodeMirror";
import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import {createQuestion} from "../../../../store/slices/questionsSlice";
import {useSections} from "../../../../hooks/use-sections";
import {getAllSections} from "../../../../store/slices/questionSectionsSlice";

const {TextArea} = Input;

export default function AddNewAnswerModal(props) {
    const {message} = App.useApp();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [code, setCode] = useState()

    const sections = useSections()

    useEffect(() => {
        dispatch(getAllSections())
    }, []);


    const addNewAnswer = (payload) => {
        if (!isLoading) {
            setIsLoading(true);

            const data = {
                questionSectionId: payload.section,
                // questionSectionId: "b75df7ab-06e7-49c8-8729-80a2fb89cb64",
                answer: code,
                question: payload.question
            }

            dispatch(createQuestion(data)).then((response) => {
                setIsLoading(false)
                message.success({content: "Вопрос успешно добавлен!"})
                props.setIsOpen(false)
            }, (error) => {
                setIsLoading(false)
                message.error({content: error.message})
            });
        }
    }

    if(!sections.sections)
        return;

    return (
        <Modal
            title="Новый вопрос - ответ"
            open={props.isOpen}
            footer={() => undefined}
            onCancel={() => props.setIsOpen(false)}
            className={styles.modal}
        >
            <Form autoComplete="off"
                  disabled={isLoading}
                  layout={'horizontal'}
                  onFinish={addNewAnswer}
            >
                <Form.Item
                    name="section"
                    label="Раздел"
                    rules={[{required: true, message: 'Поле обязательно для ввода!'}]}
                >
                    <Select
                        size="large"
                        placeholder="Выберите раздел"
                        options={sections.sections.map(section =>({
                            value: section.id,
                            label: section.name
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    name="question"
                    label="Вопрос"
                    rules={[{required: true, message: 'Поле обязательно для ввода!'}]}
                >
                    <Input
                        size="large"
                        style={{width: '100%'}}
                        placeholder="Введите вопрос"
                    />
                </Form.Item>
                <Form.Item name="answer" label="Ответ">
                    <div className={styles.code}>
                        <div className={styles.codeEdit}>
                            <MyCodeMirror code={code} onChange={setCode}/>
                        </div>

                        <Markdown className={styles.codePreview} remarkPlugins={[[remarkGfm, {singleTilde: false}]]}>
                            {code}
                        </Markdown >
                    </div>
                </Form.Item>

                <div className={styles.buttons}>
                    <Button onClick={() => props.setIsOpen(false)} disabled={isLoading}>
                        Отмена
                    </Button>
                    <Button disabled={isLoading} htmlType="submit" type="primary">
                        Добавить
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};
