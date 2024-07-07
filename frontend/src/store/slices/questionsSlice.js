import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import API from "../../api/API";


export const getAllQuestions = createAsyncThunk(
    'question/getAll',
    async function (_, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(
                `${API.GET_QUESTIONS}`,
                {
                    method: 'get',
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("PP-manager-accessToken")
                    }
                }
            );

            if (!response.ok) {
                if(response.status === 401)
                    throw new Error("Не авторизован!");
                throw new Error("Ошибка сервера!");
            }

            response = await response.json()
            dispatch(setQuestions(response))

            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const removeQuestion = createAsyncThunk(
    'question/remove',
    async function (id, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(
                `${API.REMOVE_QUESTION}/${id}` ,
                {
                    method: 'DELETE',
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("PP-manager-accessToken")
                    }
                }
            );

            if (!response.ok) {
                if(response.status === 401)
                    throw new Error("Не авторизован!");
                throw new Error("Ошибка сервера!");
            }

            dispatch(getAllQuestions())
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createQuestion = createAsyncThunk(
    'question/create',
    async function (data, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(
                `${API.CREATE_QUESTION}` ,
                {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("PP-manager-accessToken"),
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.ok) {
                if(response.status === 401)
                    throw new Error("Не авторизован!");
                throw new Error("Ошибка сервера!");
            }

            dispatch(getAllQuestions())
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


const initialState = {
    questions: [],
    isLoading: true
};

const questionsSlice = createSlice({
        name: 'question',
        initialState: initialState,
        reducers: {
            setQuestions(state, action) {
                state.questions = action.payload
                state.isLoading = false;
            },
            removeQuestions(state) {
                state.questions = []
                state.isLoading = true;
            }
        },
        extraReducers: builder => builder
            .addCase(getAllQuestions.rejected, (state, action) => {
                throw new Error(action.payload);
            })
    })
;

export const {setQuestions, removeQuestions} = questionsSlice.actions;

export default questionsSlice.reducer;
