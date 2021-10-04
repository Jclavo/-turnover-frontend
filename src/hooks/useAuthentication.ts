//Interfaces
import { User } from "../interfaces/User";

const CREDENTIALS_STORAGE = "user_bnb_bank";

export function useAuthentication() {

    const saveUserInStorage = (user: User | undefined ) => {
        // console.log(user)
        localStorage.setItem(CREDENTIALS_STORAGE, JSON.stringify(user))
    }

    const cleanStorage = () => {
        localStorage.removeItem(CREDENTIALS_STORAGE);
    }

    // const getUser = async() => {
    //     localStorage.getItem(CREDENTIALS_STORAGE)
    // }


    return {
        saveUserInStorage,
        cleanStorage,
        // getUser,
    };

}