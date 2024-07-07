import {useSelector} from 'react-redux';

export function useStudents() {
    return useSelector((state) => state.students);
}
