import axios from 'axios';

//Interfaces
import { Response } from "../interfaces/Response";
import { Purchase } from "../interfaces/Purchase";

import { useUtils } from "./useUtils";

const API_URL = process.env.REACT_APP_API_URL;
const MODEL = "deposit-statuses/"

export function useDepositStatusService() {

    const { getHeader } = useUtils();

    const purchaseGetAll = async () => {
        const URL = API_URL + MODEL ;

        const res = await axios.get(URL, getHeader());
        return res.data as unknown as Response;
    };

    return {
        purchaseGetAll
    };
}
