import {
    IonContent, IonHeader, IonPage, IonTitle,
    IonToolbar, IonItem, IonInput, IonLabel, IonRow, IonCol,
    IonGrid, IonButton, IonAlert, useIonViewDidEnter, IonDatetime,
    IonBadge, IonCard, IonIcon, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
} from '@ionic/react';
import { cashOutline, cart } from 'ionicons/icons';
import { RouteComponentProps } from 'react-router';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { format } from "date-fns";
//CSS
import './BalancePage.css';

//Interfaces
import { Response } from "../../interfaces/Response";
import { User } from "../../interfaces/User";
import { Purchase } from "../../interfaces/Purchase";
import { Deposit } from "../../interfaces/Deposit";
import { Transaction } from "../../interfaces/Transaction";

//Hooks
import { usePurchaseService } from "../../hooks/usePurchaseService";
import { useDepositService } from "../../hooks/useDepositService";
import { useUserService } from "../../hooks/useUserService";


const BalancePage: React.FC<RouteComponentProps> = (props) => {

    const location = useLocation();
    const { purchasePagination } = usePurchaseService();
    const { depositPagination } = useDepositService();
    const { userGetInfo } = useUserService();

    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [messageAlert, setMessageAlert] = useState<string>();

    const [user, setUser] = useState<User>();
    const [incomes, setIncomes] = useState<number>(0);
    const [expenses, setExpenses] = useState<number>(0);

    const [purchase, setPurchase] = useState<Purchase>();
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [deposit, setDeposit] = useState<Deposit>();
    const [deposits, setDeposits] = useState<Deposit[]>([]);




    const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

    //useEffect when page loads and selectedDate changes
    useEffect(() => {

        //for purchases
        setPurchase((prevState: any) => ({
            ...prevState,
            ['created_at']: selectedDate
        }));
        setPurchases([])

         //for deposits
         setDeposit((prevState: any) => ({
            ...prevState,
            ['status_id']: process.env.REACT_APP_DEPOSIT_TYPE_ACCEPTED,
            ['created_at']: selectedDate,
        }));
        setDeposits([])

        //for user
        getUserInfo()

    }, [props, selectedDate]);

    //useEffect to get purchases
    useEffect(() => {
        getPurchases();
    }, [purchase]);

    //useEffect to get update expenses 
    useEffect(() => {
        let sumExpenses = 0
        purchases.forEach((element: Purchase) => {
            sumExpenses += Number(element.amount);
        });
        setExpenses(sumExpenses)
    }, [purchases]);

     //useEffect to get deposits
     useEffect(() => {
        getDeposits();
    }, [deposit]);

    //useEffect to get update incomes
    useEffect(() => {
        let sumIncomes = 0
        deposits.forEach((element: Purchase) => {
            sumIncomes += Number(element.amount);
        });
        setIncomes(sumIncomes)
    }, [deposits]);

    const getPurchases = () => {

        if (purchase === undefined) return;
        purchasePagination(purchase).then((response: Response) => {
            if (response?.status) {
                setPurchases(response?.result as Purchase[] ?? [])
            } else {
                showCustomAlert(response?.message)
            }
        });
    }

    const getDeposits = () => {

        if (deposit === undefined) return;
        depositPagination(deposit).then((response: Response) => {
            if (response?.status) {
                setDeposits(response?.result as Deposit[] ?? [])
            } else {
                showCustomAlert(response?.message)
            }
        });
    }

    const getUserInfo = () => {

        userGetInfo().then((response: Response) => {
            if (response?.status) {
                setUser(response?.result as User)
            } else {
                showCustomAlert(response?.message)
            }
        });
    }



    const create = () => {

        // // set type_id 
        // setUser((prevState: any) => ({
        //     ...prevState,
        //     ['type_id']: process.env.REACT_APP_USER_TYPE_CUSTOMER
        // }));

        // userCreate(user).then((response: Response) => {
        //     showCustomAlert(response?.message)
        //     if (response?.status) {
        //         props.history.push('/login');
        //     }
        // });

    }

    const showCustomAlert = (message: string) => {
        setMessageAlert(message);
        setShowAlert(true);
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle><strong>BNB Bank</strong></IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>

                <IonItem>
                    <IonDatetime displayFormat="YYYY-MM-DD" placeholder="Select Date" value={selectedDate} onIonChange={e => setSelectedDate(e.detail.value!)} ></IonDatetime>
                </IonItem>

                <IonItem>
                    {/* <IonBadge slot="start">$</IonBadge> */}
                    <IonLabel>BALANCE</IonLabel>
                    <IonBadge slot="end" color="light">$ {user?.balance}</IonBadge>
                    {/* <IonBadge slot="end">0</IonBadge> */}
                </IonItem>

                <IonCard>
                    <IonItem>
                        <IonIcon icon={cashOutline} slot="start" />
                        <IonLabel>INCOMES</IonLabel>
                        <IonBadge slot="end">$ {incomes}</IonBadge>
                        <IonButton fill="outline" slot="end">Deposit a check</IonButton>
                    </IonItem>
                </IonCard>
                <IonCard>
                    <IonItem>
                        <IonIcon icon={cart} slot="start" />
                        <IonLabel>EXPENSES</IonLabel>
                        <IonBadge slot="end">$ {expenses}</IonBadge>
                        <IonButton fill="outline" slot="end">Purchase</IonButton>
                    </IonItem>
                </IonCard>


                {purchases.map((purchase, idx) =>
                    <IonCard key={idx}>
                        <IonItem>
                            <IonLabel>{purchase.description}</IonLabel>
                            <IonBadge slot="end" color="danger">-$ {purchase.amount}</IonBadge>
                        </IonItem>

                        <IonCardHeader>
                            <IonCardSubtitle>{format(new Date(purchase.created_at), "yyyy-MM-dd, h:mm a")}</IonCardSubtitle>
                        </IonCardHeader>

                    </IonCard>
                )}

                {deposits.map((deposit, idx) =>
                    <IonCard key={idx}>
                        <IonItem>
                            <IonLabel>{deposit.description}</IonLabel>
                            <IonBadge slot="end" color="success">$ {deposit.amount}</IonBadge>
                        </IonItem>

                        <IonCardHeader>
                            <IonCardSubtitle>{format(new Date(deposit.created_at), "yyyy-MM-dd, h:mm a")}</IonCardSubtitle>
                        </IonCardHeader>

                    </IonCard>
                )}


                {/* Alert component */}
                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    cssClass='my-custom-class'
                    header={'Message'}
                    message={messageAlert}
                    buttons={['OK']}
                />


            </IonContent>
        </IonPage>
    );
};

export default BalancePage;

