import {useSelector} from 'react-redux';

export function useRequests() {
    return useSelector((state) => state.requests);
}
