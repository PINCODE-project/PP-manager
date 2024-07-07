import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import API from "../../api/API";

export const getAllCustomerUsers = createAsyncThunk(
    'customerUsers/all',
    async function (data, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(
                `${API.GET_CUSTOMER_USERS}/${data.period_id}`,
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
            dispatch(setCustomerUsers(response))

            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    customerUsers: [],
    isLoading: true
};

const customerUsersSlice = createSlice({
        name: 'customerUsers',
        initialState: initialState,
        reducers: {
            setCustomerUsers(state, action) {
                state.customerUsers = action.payload
                state.isLoading = false;
            },
            removeCustomerUsers(state) {
                state.customerUsers = []
                state.isLoading = true;
            }
        },
        extraReducers: builder => builder
            .addCase(getAllCustomerUsers.rejected, (state, action) => {
                throw new Error(action.payload);
            })
    })
;

export const {setCustomerUsers, removeCustomerUsers} = customerUsersSlice.actions;

export default customerUsersSlice.reducer;
