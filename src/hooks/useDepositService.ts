import axios from 'axios';

//Interfaces
import { Response } from "../interfaces/Response";
import { Deposit } from "../interfaces/Deposit";

import { useUtils } from "../hooks/useUtils";

const API_URL = process.env.REACT_APP_API_URL;
const MODEL = "deposits"

export function useDepositService() {

    const { getHeader } = useUtils();

    const depositPagination = async (deposit : Deposit | undefined) => {
        const URL = API_URL + MODEL + '/' + 'pagination';

        const res = await axios.post(URL, deposit, getHeader());
        return res.data as unknown as Response;
    };

    const depositCreate = async (deposit : Deposit | undefined) => {
        const URL = API_URL + MODEL;

        const res = await axios.post(URL, deposit, getHeader());
        return res.data as unknown as Response;
    };

    const depositGetById = async (id : number | undefined) => {
        const URL = API_URL + MODEL + '/' + id;

        const res = await axios.get(URL, getHeader());
        return res.data as unknown as Response;
    };

    const depositUpdateStatus = async (deposit : Deposit | undefined) => {
        const URL = API_URL + MODEL + '/' + 'update-status';

        const res = await axios.post(URL, deposit, getHeader());
        return res.data as unknown as Response;
    };

    return {
        depositPagination,
        depositCreate,
        depositGetById,
        depositUpdateStatus
    };
}
