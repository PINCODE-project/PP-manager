import {Navigate, useNavigate} from "react-router-dom";
import styles from "./LandingPage.module.css"
import {useDispatch} from "react-redux";


export function LandingPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch()

    return (
        <div className={styles.landingPage}>
            <Navigate to={"/teamproject/projects"} replace/>
            {/*<Header/>*/}
            {/*<div>*/}
            {/*    <p className={styles.title}>*/}
            {/*        Инструменты для аналитики курса "Проектный практикум"*/}
            {/*    </p>*/}
            {/*    <div className={styles.cards}>*/}
            {/*        <Space>*/}
            {/*            <Card title="Переносите шаги со старой версии в новую" bordered={false} className={styles.card}>*/}
            {/*                <p>Экономьте время на ручном переносе контролов. Быстрее в 10 раз.</p>*/}
            {/*            </Card>*/}
            {/*            <Card title="Создавайте таблицы для документации" bordered={false} className={styles.card}>*/}
            {/*                <p>Быстрый перенос модели документа в табличный вид. Копируйте таблицу по одной кнопке и вставляйте куда душе угодно.</p>*/}
            {/*            </Card>*/}
            {/*            <Card title="Изменяйте режим 'Только чтение' контролов" bordered={false} className={styles.card}>*/}
            {/*                <p>Гибкая настройка - можно выбрать к каким типам контролов применять режим только чтение.</p>*/}
            {/*            </Card>*/}
            {/*        </Space>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    )
}
