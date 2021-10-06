//Interfaces
import { User } from "../interfaces/User";

const CREDENTIALS_STORAGE = "user_bnb_bank_token";

export function useAuthentication() {

    const cleanStorage = () => {
        localStorage.removeItem(CREDENTIALS_STORAGE);
    }

    const saveUserInStorage = (user: User | undefined ) => {
        localStorage.setItem(CREDENTIALS_STORAGE, JSON.stringify(user))
    }

    const getUser = () => {
        let rawUser = localStorage.getItem(CREDENTIALS_STORAGE);
        if (rawUser != undefined) {
            return JSON.parse(rawUser) as User;
        }       
    }

    const getToken = () => {
        return getUser()?.token;
    }

    const getUserName = () => {
        return getUser()?.username;
    }

    const getUserEmail = () => {
        return getUser()?.email;
    }


    return {
        saveUserInStorage,
        cleanStorage,
        getToken,
        getUserName,
        getUserEmail
    };

}