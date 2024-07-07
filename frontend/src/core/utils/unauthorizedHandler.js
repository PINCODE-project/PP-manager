import {removeAuth} from "../../store/slices/authSlice";

export const unauthorizedHandler = (error, dispatch, message) => {
    if(error.message === "Не авторизован!") {
        message.error("Срок авторизации истёк!")
        dispatch(removeAuth())
    }
}
