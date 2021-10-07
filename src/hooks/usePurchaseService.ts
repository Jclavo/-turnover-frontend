import axios from 'axios';

//Interfaces
import { Response } from "../interfaces/Response";
import { Purchase } from "../interfaces/Purchase";

import { useUtils } from "../hooks/useUtils";

const API_URL = process.env.REACT_APP_API_URL;
const MODEL = "purchases"

export function usePurchaseService() {

    const { getHeader } = useUtils();

    const purchasePagination = async (purchase : Purchase | undefined) => {
        const URL = API_URL + MODEL + '/' + 'pagination';

        const res = await axios.post(URL, purchase, getHeader());
        return res.data as unknown as Response;
    };

    const purchaseCreate = async (purchase : Purchase | undefined) => {
        const URL = API_URL + MODEL;

        const res = await axios.post(URL, purchase, getHeader());
        return res.data as unknown as Response;
    };

    return {
        purchasePagination,
        purchaseCreate
    };
}
