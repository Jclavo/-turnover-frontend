import {
    IonContent, IonHeader, IonPage, IonTitle,
    IonToolbar, IonItem, IonLabel,
    IonAlert, IonDatetime,
    IonBadge, IonCard, IonIcon, IonCardHeader, IonCardSubtitle, IonFab, IonFabButton,
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { RouteComponentProps } from 'react-router';
import React, { useState, useEffect } from 'react';
import { format } from "date-fns";
//CSS
import './PurchasesListPage.css';

//Interfaces
import { Response } from "../../../interfaces/Response";
import { Purchase } from "../../../interfaces/Purchase";

//Hooks
import { usePurchaseService } from "../../../hooks/usePurchaseService";
import { useUserService } from "../../../hooks/useUserService";

const PurchasesListPage: React.FC<RouteComponentProps> = (props) => {

    const { purchasePagination } = usePurchaseService();
    const { userGetBalance } = useUserService();

    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [messageAlert, setMessageAlert] = useState<string>();
    
    const [balance, setBalance] = useState<number>(0);

    const [purchase, setPurchase] = useState<Purchase>();
    const [purchases, setPurchases] = useState<Purchase[]>([]);


    const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

    //useEffect when page loads and selectedDate changes
    useEffect(() => {

        //for purchases
        setPurchase((prevState: any) => ({
            ...prevState,
            ['created_at']: selectedDate
        }));
        setPurchases([])

        //get user balance
        getUserBalance()

    }, [props, selectedDate]);

    //useEffect to get purchases
    useEffect(() => {
        getPurchases();
    }, [purchase]);


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
                    <IonTitle><strong>Expenses</strong></IonTitle>
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

                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => props.history.push('/purchase')}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>

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

export default PurchasesListPage;

