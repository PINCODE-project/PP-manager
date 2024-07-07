import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import API from '../../api/API';

export const loginUser = createAsyncThunk(
    'user/login',
    async function (user, {rejectWithValue, dispatch}) {
        try {
            let response = await fetch(API.AUTH + "/login", {
                method: 'post',
                body: JSON.stringify(user),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                if(response.status === 401)
                    throw new Error("Неправильный логин или пароль!");
                if(response.status === 403)
                    throw new Error("Необходимо подтвердить аккаунт через ссылку на почте!");
                throw new Error("Ошибка сервера!");
            }

            response = await response.json();
            dispatch(setAuth(response));

            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    id: null,
    login: null,
    accessToken: null,
};

const authSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        setAuth(state, action) {
            state.id = action.payload.id;
            state.login = action.payload.login;
            state.accessToken = action.payload.accessToken;

            localStorage.setItem('PP-manager-userId', action.payload.id);
            localStorage.setItem('PP-manager-login', action.payload.login);
            localStorage.setItem('PP-manager-accessToken', action.payload.accessToken);
        },
        removeAuth(state) {
            state.id = null;
            state.login = null;
            state.accessToken = null;

            localStorage.removeItem('PP-manager-userId');
            localStorage.removeItem('PP-manager-login');
            localStorage.removeItem('PP-manager-accessToken');
        },
    },
    extraReducers: builder => builder
        .addCase(loginUser.rejected, (state, action) => {
            throw new Error(action.payload);
        })
})
;

export const {setAuth, removeAuth} = authSlice.actions;

export default authSlice.reducer;
