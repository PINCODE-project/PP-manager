import {useSelector} from 'react-redux';

export function useCustomerCompanies() {
    return useSelector((state) => state.customerCompanies);
}
