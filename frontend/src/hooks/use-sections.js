import {useSelector} from 'react-redux';

export function useSections() {
    return useSelector((state) => state.questionSections);
}
