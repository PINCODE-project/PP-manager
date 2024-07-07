import {useDispatch, useSelector} from 'react-redux';
import {setTeamproject} from "../store/slices/teamprojectSlice";

export function useProjects() {
    return useSelector((state) => state.projects);
}
