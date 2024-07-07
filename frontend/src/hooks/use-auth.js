import {useDispatch, useSelector} from 'react-redux';
import {setAuth} from '../store/slices/authSlice';

export function useAuth() {
    const auth = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const localUser = {
        id: localStorage.getItem('PP-manager-userId'),
        login: localStorage.getItem('PP-manager-login'),
        accessToken: localStorage.getItem('PP-manager-accessToken'),
    };

    if (localUser.login && localUser.id) {
        dispatch(setAuth(localUser));
        return {
            isAuth: !!localUser.id,
            ...localUser,
        };
    }

    return {
        isAuth: !!auth.id,
        ...auth,
    };
}
