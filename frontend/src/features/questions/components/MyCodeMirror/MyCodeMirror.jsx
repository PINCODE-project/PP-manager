import React from 'react';
import {autocompletion} from "@codemirror/autocomplete";
import {langs} from "@uiw/codemirror-extensions-langs";
import CodeMirror from "@uiw/react-codemirror";

export default function MyCodeMirror(props) {
    return (
        <>
            <CodeMirror
                value={props.code}
                height="500px"
                width="calc((100wv - 200px) / 2)"
                placeholder="Введите ответ на вопрос (Поддержка markdown)"
                basicSetup={{history: true, lineNumbers: true, closeBrackets: true, tabSize: 4}}
                extensions={[autocompletion(), langs["markdown"]()]}
                onChange={props.onChange}
            />
        </>

    )
}
