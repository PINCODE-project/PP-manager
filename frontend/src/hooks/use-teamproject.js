import {useDispatch, useSelector} from 'react-redux';
import {setTeamproject} from "../store/slices/teamprojectSlice";

export function useTeamproject() {

    const dispatch = useDispatch();
    const teamproject = useSelector((state) => state.teamproject);
    console.log("UseTeamproject", teamproject)
    const localProjects = JSON.parse(localStorage.getItem('PP-analyze-projects')) || [];

    if(teamproject.projects.length !== 0) {
        return {
            ...teamproject,
        }
    }


    if (localProjects.length !== 0) {
        dispatch(setTeamproject(localProjects));
        return {
            isLoading: false,
            projects: localProjects,
        };
    } else {
        return {
            isLoading: false,
            projects: [],
        };
    }
}
