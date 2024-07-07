import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import API from "../../api/API";

export const getAllRequests = createAsyncThunk(
    'requests/all',
    async function (data, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(
                `${API.GET_REQUESTS}/${data.period_id}/`,
                {
                    cache: "no-cache",
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
            dispatch(setRequests(response))

            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    requests: [],
    editRequests: [],
    editedRequests: [],
    isLoading: true
};

const requestsSlice = createSlice({
        name: 'requests',
        initialState: initialState,
        reducers: {
            setRequests(state, action) {
                state.requests = action.payload
                state.isLoading = false;
            },
            setEditRequests(state, action) {
                state.editRequests = action.payload
                state.isLoading = false;
            },
            setEditedRequests(state, action) {
                state.editedRequests = action.payload
                state.isLoading = false;
            },
            removeRequests(state) {
                state.requests = []
                state.isLoading = true;
            },
            removeEditRequests(state) {
                state.editRequests = []
                state.isLoading = true;
            }
        },
        extraReducers: builder => builder
            .addCase(getAllRequests.rejected, (state, action) => {
                throw new Error(action.payload);
            })
    })
;

export const {setRequests, setEditRequests, setEditedRequests, removeRequests, removeEditRequests} = requestsSlice.actions;

export default requestsSlice.reducer;
