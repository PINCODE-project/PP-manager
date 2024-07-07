import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import API from "../../api/API";


export const getProject = createAsyncThunk(
    'project/get',
    async function (data, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(
                `${API.GET_PROJECT}/${data.id}`,
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
            dispatch(setProject(response))

            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    project: {},
    isLoading: true
};

const projectSlice = createSlice({
        name: 'project',
        initialState: initialState,
        reducers: {
            setProject(state, action) {
                state.project = action.payload
                state.isLoading = false;
            },
            removeProject(state) {
                state.project = []
                state.isLoading = true;
            }
        },
        extraReducers: builder => builder
            .addCase(getProject.rejected, (state, action) => {
                throw new Error(action.payload);
            })
    })
;

export const {setProject, removeProject} = projectSlice.actions;

export default projectSlice.reducer;
