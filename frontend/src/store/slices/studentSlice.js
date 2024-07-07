import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import API from "../../api/API";
import {getAllPassports} from "./passportsSlice";


export const getStudent = createAsyncThunk(
    'student/get',
    async function (id, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(
                `${API.GET_STUDENT}/${id}`,
                {
                    method: 'get',
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("PP-manager-accessToken")
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Ошибка сервера!");
            }

            response = await response.json()
            dispatch(setStudent(response))

            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    student: {},
    isLoading: true
};

const studentSlice = createSlice({
        name: 'student',
        initialState: initialState,
        reducers: {
            setStudent(state, action) {
                state.student = action.payload
                state.isLoading = false;
            },
            removeStudent(state) {
                state.student = {}
                state.isLoading = true;
            }
        },
        extraReducers: builder => builder
            .addCase(getStudent.rejected, (state, action) => {
                throw new Error(action.payload);
            })
    })
;

export const {setStudent, removeStudent} = studentSlice.actions;

export default studentSlice.reducer;
