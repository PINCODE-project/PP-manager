import {useSelector} from 'react-redux';

export function useStudent() {
    return useSelector((state) => state.student);
}
