import {useSelector} from 'react-redux';

export function useCustomerUsers() {
    return useSelector((state) => state.customerUsers);
}
