
import { useAuthentication } from "../hooks/useAuthentication";

export function useUtils() {

    const { getToken } = useAuthentication();

    const getHeader = () => {
        return {
            headers: {
                Authorization: 'Bearer ' + getToken() //the token is a variable which holds the token
            }
        }
    };

    return {
        getHeader
    };
}
