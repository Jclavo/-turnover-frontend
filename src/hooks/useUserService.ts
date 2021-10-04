import axios from 'axios';

//Interfaces
import { Response } from "../interfaces/Response";
import { User } from "../interfaces/User";

const apiKEY = "http://localhost:8000/api/";

export function useUserService() {

    const userLogin = async (user : User | undefined) => {
        const URL = apiKEY + "login";
        const res = await axios.post(URL, user);
        return res.data as unknown as Response;
    };


    return {
        userLogin
    };
}
