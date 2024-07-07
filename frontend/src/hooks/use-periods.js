import {useDispatch, useSelector} from 'react-redux';
import {setTeamproject} from "../store/slices/teamprojectSlice";

export function usePeriods() {
    return useSelector((state) => state.periods);
}
