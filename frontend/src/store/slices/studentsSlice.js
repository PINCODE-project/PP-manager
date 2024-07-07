import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import API from "../../api/API";


export const getAllStudents = createAsyncThunk(
    'students/all',
    async function (data, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(
                `${API.GET_STUDENTS}/${data.period_id}/`,
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
            dispatch(setStudents(response))

            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    students: [],
    isLoading: true
};

const studentsSlice = createSlice({
        name: 'students',
        initialState: initialState,
        reducers: {
            setStudents(state, action) {
                state.students = action.payload
                state.isLoading = false;
            },
            removeStudents(state) {
                state.students = []
                state.isLoading = true;
            }
        },
        extraReducers: builder => builder
            .addCase(getAllStudents.rejected, (state, action) => {
                throw new Error(action.payload);
            })
    })
;

export const {setStudents, removeStudents} = studentsSlice.actions;

export default studentsSlice.reducer;
