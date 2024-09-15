import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import API from "../../api/API";

export const parsePassports = createAsyncThunk(
    'passports/parse',
    async function (data, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(
                API.PARSE_PASSPORTS,
                {
                    method: 'post',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("PP-manager-accessToken")
                    },
                    body: JSON.stringify(data)
                }
            );

            if (!response.ok) {
                if (response.status === 401)
                    throw new Error("Неверный Bearer токен!");
                throw new Error("Ошибка сервера!");
            }

            response = await response.json()
            dispatch(getAllPassports({period_id: data.period_id}))

            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


export const getAllPassports = createAsyncThunk(
    'passports/all',
    async function (data, {rejectWithValue, dispatch}) {
        try {
            dispatch(setPassportsLoading(true))
            let response = await fetch(
                API.GET_PASSPORTS,
                {
                    method: 'post',
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("PP-manager-accessToken"),
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        period_id: data.period_id,
                        programs: data.programs
                    })
                }
            );

            if (!response.ok) {
                if (response.status === 401)
                    throw new Error("Не авторизован!");
                throw new Error("Ошибка сервера!");
            }

            response = await response.json()
            dispatch(setPassports(response))

            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    passports: [],
    isLoading: true
};

const passportsSlice = createSlice({
        name: 'passports',
        initialState: initialState,
        reducers: {
            setPassportsLoading(state, action) {
                state.isLoading = action.payload;
            },
            setPassports(state, action) {
                state.passports = action.payload
                state.isLoading = false;
            },
            removePassports(state) {
                state.passports = []
                state.isLoading = true;
            }
        },
        extraReducers: builder => builder
            .addCase(getAllPassports.rejected, (state, action) => {
                throw new Error(action.payload);
            })
    })
;

export const {setPassportsLoading, setPassports, removePassports} = passportsSlice.actions;

export default passportsSlice.reducer;
