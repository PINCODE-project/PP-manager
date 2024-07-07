import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import API from "../../api/API";


export const updateRequest = createAsyncThunk(
    'request/update',
    async function (data, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(
                `${API.UPDATE_REQUEST}/${data.id}`,
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
    request: {},
    isLoading: true
};

const requestSlice = createSlice({
        name: 'request',
        initialState: initialState,
        reducers: {
            setRequest(state, action) {
                state.request = action.payload
                state.isLoading = false;
            },
            removeRequest(state) {
                state.request = {}
                state.isLoading = true;
            }
        },
        extraReducers: builder => builder
            .addCase(updateRequest.rejected, (state, action) => {
                throw new Error(action.payload);
            })
    })
;

export const {setRequest, removeRequest} = requestSlice.actions;

export default requestSlice.reducer;
