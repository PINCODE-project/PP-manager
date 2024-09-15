import {useSelector} from 'react-redux';

export function usePrograms() {
    return useSelector((state) => state.programs);
}
