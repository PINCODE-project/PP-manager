import {useSelector} from 'react-redux';

export function usePassports() {
    return useSelector((state) => state.passports);
}
