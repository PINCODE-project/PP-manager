import {useSelector} from 'react-redux';

export function useProject() {
    return useSelector((state) => state.project);
}
