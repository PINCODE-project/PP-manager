import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import API from "../../api/API";

export const getAllCustomerCompanies = createAsyncThunk(
    'customerCompanies/all',
    async function (data, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(
                `${API.GET_CUSTOMER_COMPANIES}/${data.period_id}`,
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
            dispatch(setCustomerCompanies(response))

            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    customerCompanies: [],
    isLoading: true
};

const customerCompaniesSlice = createSlice({
        name: 'customerCompanies',
        initialState: initialState,
        reducers: {
            setCustomerCompanies(state, action) {
                state.customerCompanies = action.payload
                state.isLoading = false;
            },
            removeCustomerCompanies(state) {
                state.customerCompanies = []
                state.isLoading = true;
            }
        },
        extraReducers: builder => builder
            .addCase(getAllCustomerCompanies.rejected, (state, action) => {
                throw new Error(action.payload);
            })
    })
;

export const {setCustomerCompanies, removeCustomerCompanies} = customerCompaniesSlice.actions;

export default customerCompaniesSlice.reducer;
