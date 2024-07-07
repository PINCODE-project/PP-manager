import {useSelector} from 'react-redux';

export function usePassport() {
    return useSelector((state) => state.passport);
}
