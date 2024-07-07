import {useSelector} from 'react-redux';

export function useTags() {
    return useSelector((state) => state.tags);
}
