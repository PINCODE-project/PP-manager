import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import API from "../../api/API";
import {getAllPassports} from "./passportsSlice";


export const getPassport = createAsyncThunk(
    'passport/get',
    async function (id, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(
                `${API.GET_PASSPORT}/${id}`,
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
            dispatch(setPassport(response))

            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updatePassport = createAsyncThunk(
    'passport/update',
    async function (data, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(
                `${API.UPDATE_PASSPORT}/${data.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("PP-manager-accessToken"),
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            );

            if (!response.ok) {
                throw new Error("Ошибка сервера!");
            }

            response = await response.json()
            // dispatch(getPassport(data.id))

            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    passport: {},
    isLoading: true
};

const passportSlice = createSlice({
        name: 'passport',
        initialState: initialState,
        reducers: {
            setPassport(state, action) {
                state.passport = action.payload
                state.isLoading = false;
            },
            removePassport(state) {
                state.passport = {}
                state.isLoading = true;
            }
        },
        extraReducers: builder => builder
            .addCase(getPassport.rejected, (state, action) => {
                throw new Error(action.payload);
            })
            .addCase(updatePassport.rejected, (state, action) => {
                throw new Error(action.payload);
            })
    })
;

export const {setPassport, removePassport} = passportSlice.actions;

export default passportSlice.reducer;
