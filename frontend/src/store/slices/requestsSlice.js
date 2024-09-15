import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../api/API";

export const parseRequests = createAsyncThunk(
    "requests/parse",
    async function(data, { rejectWithValue, dispatch }) {
        try {
            let response = await fetch(API.PARSE_REQUESTS, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + localStorage.getItem("PP-manager-accessToken"),
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                if (response.status === 401) throw new Error("Неверный Bearer токен!");
                throw new Error("Ошибка сервера!");
            }

            response = await response.json();
            dispatch(getAllRequests({ period_id: data.period_id }));

            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

export const getAllRequests = createAsyncThunk(
    "requests/all",
    async function(data, { rejectWithValue, dispatch }) {
        try {
            dispatch(setRequestsLoading(true))
            console.log("requests/all")
            let response = await fetch(`${ API.GET_REQUESTS }`, {
                body: JSON.stringify({
                    period_id: data.period_id,
                    programs: data.programs
                }),
                cache: "no-cache",
                method: "post",
                headers: {
                    Authorization:
                        "Bearer " + localStorage.getItem("PP-manager-accessToken"),
                    "Content-Type": "application/json"
                },
            });

            if (!response.ok) {
                if (response.status === 401) throw new Error("Не авторизован!");
                throw new Error("Ошибка сервера!");
            }

            response = await response.json();
            dispatch(setRequests(response));

            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

export const createRequestReport = createAsyncThunk(
    "requests/report",
    async function(data, { rejectWithValue, dispatch }) {
        try {
            let response = await fetch(API.CREATE_REQUESTS_REPORT, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + localStorage.getItem("PP-manager-accessToken"),
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Ошибка сервера!");
            }

            response = await response.json();

            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

const initialState = {
    requests: [],
    editRequests: [],
    editedRequests: [],
    isLoading: true,
};

const requestsSlice = createSlice({
    name: "requests",
    initialState: initialState,
    reducers: {
        setRequestsLoading(state, action) {
            state.isLoading = action.payload;
        },
        setRequests(state, action) {
            state.requests = action.payload;
            state.isLoading = false;
        },
        setEditRequests(state, action) {
            state.editRequests = action.payload;
            state.isLoading = false;
        },
        setEditedRequests(state, action) {
            state.editedRequests = action.payload;
            state.isLoading = false;
        },
        removeRequests(state) {
            state.requests = [];
            state.isLoading = true;
        },
        removeEditRequests(state) {
            state.editRequests = [];
            state.isLoading = true;
        },
    },
    extraReducers: (builder) =>
        builder.addCase(getAllRequests.rejected, (state, action) => {
            throw new Error(action.payload);
        }),
});
export const {
    setRequestsLoading,
    setRequests,
    setEditRequests,
    setEditedRequests,
    removeRequests,
    removeEditRequests,
} = requestsSlice.actions;

export default requestsSlice.reducer;
