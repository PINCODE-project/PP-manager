import {useSelector} from 'react-redux';

export function useAnalytic() {
    return useSelector((state) => state.analytic);
}
