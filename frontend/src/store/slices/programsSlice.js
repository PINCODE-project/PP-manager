import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../api/API";


export const getAllPrograms = createAsyncThunk(
    "programs/all",
    async function(data, { rejectWithValue, dispatch }) {
        try {
            let response = await fetch(
                `${ API.GET_PROGRAMS }`,
                {
                    method: "get",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("PP-manager-accessToken")
                    },
                },
            );

            if (!response.ok) {
                throw new Error("Ошибка сервера!");
            }

            response = await response.json();
            dispatch(setPrograms(response));

            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

const initialState = {
    programs: [],
    isLoading: true,
};

const programsSlice = createSlice({
        name: "programs",
        initialState: initialState,
        reducers: {
            setPrograms(state, action) {
                state.programs = action.payload;
                state.isLoading = false;
            },
            removePrograms(state) {
                state.programs = [];
                state.isLoading = true;
            },
        },
        extraReducers: builder => builder
            .addCase(getAllPrograms.rejected, (state, action) => {
                throw new Error(action.payload);
            }),
    })
;

export const { setPrograms, removePrograms } = programsSlice.actions;

export default programsSlice.reducer;
