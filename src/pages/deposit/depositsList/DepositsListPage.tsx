import {
    IonContent, IonHeader, IonPage, IonTitle,
    IonToolbar, IonItem, IonLabel,
    IonButton, IonAlert, IonDatetime,
    IonBadge, IonCard, IonIcon, IonCardHeader, IonCardSubtitle, IonSelect, IonSelectOption, IonFabButton, IonFab,
} from '@ionic/react';
import { cashOutline, arrowDown, add } from 'ionicons/icons';
import { RouteComponentProps } from 'react-router';
import React, { useState, useEffect } from 'react';
import { format } from "date-fns";
//CSS
import './DepositsListPage.css';

//Interfaces
import { Response } from "../../../interfaces/Response";
import { Deposit } from "../../../interfaces/Deposit";

//Hooks
import { useDepositService } from "../../../hooks/useDepositService";

const DepositsListPage: React.FC<RouteComponentProps> = (props) => {

    const { depositPagination } = useDepositService();

    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [messageAlert, setMessageAlert] = useState<string>();

    const [deposits, setDeposits] = useState<Deposit[]>([]);

    //useEffect when page loads and selectedDate/depositStatus changes
    useEffect(() => {
        getDeposits();
    }, [props]);

    const getDeposits = () => {

        depositPagination(undefined).then((response: Response) => {
            if (response?.status) {
                setDeposits(response?.result as Deposit[] ?? [])
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
                    <IonTitle><strong>CHECKS CONTROL</strong></IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>

                {deposits.map((deposit, idx) =>
                    <IonCard key={idx}>
                        <IonItem>
                            <IonLabel>{deposit.user.username}</IonLabel>
                            <IonBadge slot="end" color="success">$ {deposit.amount}</IonBadge>
                            <IonButton fill="outline" slot="end" routerLink={`/check-details/${deposit.id}`} >DETAILS</IonButton>
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

export default DepositsListPage;

