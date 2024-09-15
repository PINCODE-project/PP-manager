import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import API from "../../api/API";


export const getMainAnalytics = createAsyncThunk(
    'analytic/main',
    async function (data, {rejectWithValue, dispatch}) {
        try {
            dispatch(setMainAnalyticLoading(true))
            let response = await fetch(
                `${API.GET_MAIN_ANALYTICS}`,
                {
                    body: JSON.stringify({
                        period_id: data.period_id,
                        programs: data.programs
                    }),
                    method: 'post',
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("PP-manager-accessToken"),
                        "Content-Type": "application/json"
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
            setMainAnalyticLoading(state, action) {
                state.isLoading = action.payload;
            },
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

export const {setMainAnalyticLoading, setMainAnalytic, removeMainAnalytic} = analyticSlice.actions;

export default analyticSlice.reducer;
