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
            let response = await fetch(
                `${API.GET_PASSPORTS}/${data.period_id}/`,
                {
                    method: 'get',
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("PP-manager-accessToken")
                    }
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

export const {setPassports, removePassports} = passportsSlice.actions;

export default passportsSlice.reducer;
