import SideBar from "../../../../components/SideBar/SideBar";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import React, {useEffect, useState} from "react";
import {App, Button, Spin} from "antd";
import styles from './QuestionsPage.module.css'
import {removeProject} from "../../../../store/slices/projectSlice";
import QuestionsTable from "../../components/QuestionsTable/QuestionsTable";
import {removePassports} from "../../../../store/slices/passportsSlice";
import {removeStudent} from "../../../../store/slices/studentSlice";
import {unauthorizedHandler} from "../../../../core/utils/unauthorizedHandler";
import {useQuestions} from "../../../../hooks/use-questions";
import {getAllQuestions} from "../../../../store/slices/questionsSlice";
import QuestionsTableSettings from "../../components/QuestionsTableSettings/QuestionsTableSettings";
import AddNewAnswerModal from "../../components/AddNewAnswerModal/AddNewAnswerModal";

export const initialQuestionsTableColumns = [
    {
        key: 'section',
        name: 'Раздел',
    },
    {
        key: 'question',
        name: 'Вопрос',
    },
    {
        key: 'answer',
        name: 'Ответ',
    }
]

export function QuestionsPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const {message} = App.useApp();

    const [isSettingsTableOpen, setIsSettingsTableOpen] = useState(false);
    const [questionsTable, setQuestionsTable] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [isAddNewAnswerModalOpen, setIsAddNewAnswerModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [questionsTableColumns, setQuestionsTableColumns] = useState(
        JSON.parse(localStorage.getItem("PP-manager-questions-columns")) ||
        initialQuestionsTableColumns
    )

    const questions = useQuestions()

    useEffect(() => {
        dispatch(getAllQuestions()).catch((error) => unauthorizedHandler(error, dispatch, message))
    }, []);

    useEffect(() => {
        dispatch(removeProject())
        dispatch(removePassports())
        dispatch(removeStudent())
    }, []);

    useEffect(() => {
        const parsedQuestionsTable = questions.questions.map(question => ({
            id: question.id,
            question: question.question,
            answer: question.answer,
            section: question.questionSection.name,
        }))
        setQuestionsTable(parsedQuestionsTable);
        console.log(parsedQuestionsTable)
        // dispatch(setEditQuestions(parsedQuestionsTable));
    }, [questions.questions])


    return (
        <div className={styles.page}>
            <SideBar selectedKeys={["Q&A"]}/>

            <h1 className={styles.title}>Вопрос - ответ</h1>
            <div className={styles.header}>
                <div className={styles.filters}>
                </div>

                <div className={styles.buttons}>
                    <Button type="primary" onClick={() => setIsAddNewAnswerModalOpen(true)}>
                        Добавить ответ на вопрос
                    </Button>
                    <Button onClick={() => setIsSettingsTableOpen(true)}>
                        Настроить таблицу
                    </Button>
                </div>
            </div>

            {
                questions.isLoading ?
                    <Spin/> :
                    <QuestionsTable
                        questions={questionsTable}
                        columns={questionsTableColumns}
                    />
            }

            <QuestionsTableSettings
                isOpen={isSettingsTableOpen}
                setIsOpen={setIsSettingsTableOpen}

                tableColumns={questionsTableColumns}
                setTableColumns={setQuestionsTableColumns}
            />

            <AddNewAnswerModal isOpen={isAddNewAnswerModalOpen} setIsOpen={setIsAddNewAnswerModalOpen}/>
        </div>
    )
}
