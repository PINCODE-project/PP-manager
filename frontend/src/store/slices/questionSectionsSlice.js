import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import API from "../../api/API";


export const getAllSections = createAsyncThunk(
    'questionSections/getAll',
    async function (_, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(
                `${API.GET_QUESTION_SECTIONS}`,
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
            dispatch(setSections(response))

            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    sections: [],
    isLoading: true
};

const questionSectionsSlice = createSlice({
        name: 'questionSections',
        initialState: initialState,
        reducers: {
            setSections(state, action) {
                state.sections = action.payload
                state.isLoading = false;
            },
            removeSections(state) {
                state.sections = []
                state.isLoading = true;
            }
        },
        extraReducers: builder => builder
            .addCase(getAllSections.rejected, (state, action) => {
                throw new Error(action.payload);
            })
    })
;

export const {setSections, removeSections} = questionSectionsSlice.actions;

export default questionSectionsSlice.reducer;
