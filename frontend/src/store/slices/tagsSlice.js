import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import API from "../../api/API";


export const getAllTags = createAsyncThunk(
    'tag/all',
    async function (data, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(
                `${API.GET_TAGS}`,
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
            dispatch(setTags(response))

            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    tags: {},
    isLoading: true
};

const tagsSlice = createSlice({
        name: 'tags',
        initialState: initialState,
        reducers: {
            setTags(state, action) {
                state.tags = action.payload
                state.isLoading = false;
            },
            removeTags(state) {
                state.tags = []
                state.isLoading = true;
            }
        },
        extraReducers: builder => builder
            .addCase(getAllTags.rejected, (state, action) => {
                throw new Error(action.payload);
            })
    })
;

export const {setTags, removeTags} = tagsSlice.actions;

export default tagsSlice.reducer;
