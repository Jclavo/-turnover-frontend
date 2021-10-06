import axios from 'axios';

//Interfaces
import { Response } from "../interfaces/Response";
import { User } from "../interfaces/User";

import { useUtils } from "../hooks/useUtils";

const API_URL = process.env.REACT_APP_API_URL;
const MODEL = "users/"

export function useUserService() {

    const { getHeader } = useUtils();

    const userLogin = async (user : User | undefined) => {
        const URL = API_URL + "login";
        const res = await axios.post(URL, user);
        return res.data as unknown as Response;
    };

    const userCreate = async (user : User | undefined) => {
        const URL = API_URL + MODEL;
        const res = await axios.post(URL, user);
        return res.data as unknown as Response;
    };

    const userGetInfo = async () => {
        const URL = API_URL + MODEL + 'get-info';
        const res = await axios.get(URL, getHeader());
        return res.data as unknown as Response;
    };


    return {
        userLogin,
        userCreate,
        userGetInfo
    };
}
