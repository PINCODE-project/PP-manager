import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import API from "../../api/API";


export const getMainAnalytics = createAsyncThunk(
    'analytic/main',
    async function (data, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(
                `${API.GET_MAIN_ANALYTICS}/${data.period_id}/`,
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
            dispatch(setMainAnalytic(response))

            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    mainAnalytic: {},
    isLoading: true
};

const analyticSlice = createSlice({
        name: 'analytic',
        initialState: initialState,
        reducers: {
            setMainAnalytic(state, action) {
                state.mainAnalytic = action.payload
                state.isLoading = false;
            },
            removeMainAnalytic(state) {
                state.mainAnalytic = []
                state.isLoading = true;
            }
        },
        extraReducers: builder => builder
            .addCase(getMainAnalytics.rejected, (state, action) => {
                throw new Error(action.payload);
            })
    })
;

export const {setMainAnalytic, removeMainAnalytic} = analyticSlice.actions;

export default analyticSlice.reducer;
