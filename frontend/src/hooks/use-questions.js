import {useDispatch, useSelector} from 'react-redux';
import {setTeamproject} from "../store/slices/teamprojectSlice";

export function useQuestions() {
    return useSelector((state) => state.questions);
}
