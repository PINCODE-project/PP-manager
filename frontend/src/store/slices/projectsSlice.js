import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import API from "../../api/API";


export const getAllProjects = createAsyncThunk(
    'projects/all',
    async function (data, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(
                `${API.GET_PROJECTS}/${data.period_id}`,
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
            dispatch(setProjects(response))

            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    projects: [],
    isLoading: true
};

const projectsSlice = createSlice({
        name: 'projects',
        initialState: initialState,
        reducers: {
            setProjects(state, action) {
                state.projects = action.payload
                state.isLoading = false;
            },
            removeProjects(state) {
                state.projects = []
                state.isLoading = true;
            }
        },
        extraReducers: builder => builder
            .addCase(getAllProjects.rejected, (state, action) => {
                throw new Error(action.payload);
            })
    })
;

export const {setProjects, removeProjects} = projectsSlice.actions;

export default projectsSlice.reducer;
