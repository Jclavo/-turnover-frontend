import {
    IonContent, IonHeader, IonPage, IonTitle,
    IonToolbar, IonItem, IonLabel,
    IonButton, IonAlert, IonDatetime,
    IonBadge, IonCard, IonIcon, IonCardHeader, IonCardSubtitle,
} from '@ionic/react';
import { cashOutline, arrowDown } from 'ionicons/icons';
import { RouteComponentProps, useLocation } from 'react-router';
import React, { useState, useEffect } from 'react';
import { format } from "date-fns";
//CSS
import './BalancePage.css';

//Interfaces
import { Response } from "../../interfaces/Response";
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
    const { userGetBalance } = useUserService();

    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [messageAlert, setMessageAlert] = useState<string>();

    const [balance, setBalance] = useState<number>(0);
    const [incomes, setIncomes] = useState<number>(0);
    const [expenses, setExpenses] = useState<number>(0);

    const [purchase, setPurchase] = useState<Purchase>();
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [deposit, setDeposit] = useState<Deposit>();
    const [deposits, setDeposits] = useState<Deposit[]>([]);


    const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

    //useEffect when page loads and selectedDate changes
    useEffect(() => {

        if(!location.pathname.startsWith('/balance')) return; //Only run useEffect when it is in page route
        
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

        //get user balance
        getUserBalance()

    }, [props, selectedDate]);

    //useEffect to get purchases
    useEffect(() => {
        if(!location.pathname.startsWith('/balance')) return; //Only run useEffect when it is in page route
        
        getPurchases();
    }, [purchase]);

    //useEffect to get update expenses 
    useEffect(() => {
        if(!location.pathname.startsWith('/balance')) return; //Only run useEffect when it is in page route
        
        let sumExpenses = 0
        purchases.forEach((element: Purchase) => {
            sumExpenses += Number(element.amount);
        });
        setExpenses(sumExpenses)
    }, [purchases]);

     //useEffect to get deposits
     useEffect(() => {
        if(!location.pathname.startsWith('/balance')) return; //Only run useEffect when it is in page route
        
        getDeposits();
    }, [deposit]);

    //useEffect to get update incomes
    useEffect(() => {
        if(!location.pathname.startsWith('/balance')) return; //Only run useEffect when it is in page route
        
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

    const getUserBalance = () => {

        userGetBalance().then((response: Response) => {
            if (response?.status) {
                setBalance(response?.result)
            } else {
                showCustomAlert(response?.message)
            }
        });
    }

    const showCustomAlert = (message: string) => {
        setMessageAlert(message);
        setShowAlert(true);
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle><strong>Balance</strong></IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>

                <IonItem>
                    <IonDatetime displayFormat="YYYY-MM-DD" placeholder="Select Date" value={selectedDate} onIonChange={e => setSelectedDate(e.detail.value!)} ></IonDatetime>
                </IonItem>

                <IonItem>
                    <IonLabel>BALANCE</IonLabel>
                    <IonBadge slot="end" color="warning">$ {balance}</IonBadge>
                </IonItem>

                <IonCard>
                    <IonItem>
                        <IonIcon icon={cashOutline} slot="start" />
                        <IonLabel>INCOMES</IonLabel>
                        <IonBadge slot="end">$ {incomes}</IonBadge>
                        <IonButton fill="outline" slot="end" routerLink="/deposit/">Deposit a check</IonButton>
                    </IonItem>
                </IonCard>

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
                {deposits.length == 0 ?  <IonButton expand="full" color="ligth"><IonLabel color="danger">No records</IonLabel></IonButton>: ''}

                <IonCard>
                    <IonItem>
                        <IonIcon icon={arrowDown} slot="start" />
                        <IonLabel>EXPENSES</IonLabel>
                        <IonBadge slot="end">$ {expenses}</IonBadge>
                        <IonButton fill="outline" slot="end" routerLink="/purchase/">Purchase</IonButton>
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

{purchases.length == 0 ?  <IonButton expand="full" color="ligth"><IonLabel color="danger">No records</IonLabel></IonButton>: ''}


                
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

