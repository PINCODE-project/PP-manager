import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import API from "../../api/API";


export const getAllPeriods = createAsyncThunk(
    'periods/all',
    async function (_, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(
                `${API.GET_PERIODS}/`,
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
            dispatch(setPeriods(response))

            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    periods: [],
    isLoading: true
};

const periodsSlice = createSlice({
        name: 'periods',
        initialState: initialState,
        reducers: {
            setPeriods(state, action) {
                state.periods = action.payload
                state.isLoading = false;
            },
            removePeriods(state) {
                state.periods = []
                state.isLoading = true;
            }
        },
        extraReducers: builder => builder
            .addCase(getAllPeriods.rejected, (state, action) => {
                throw new Error(action.payload);
            })
    })
;

export const {setPeriods, removePeriods} = periodsSlice.actions;

export default periodsSlice.reducer;
