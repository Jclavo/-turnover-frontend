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
import { DepositStatus } from "../../../interfaces/DepositStatus";

//Hooks
import { useDepositService } from "../../../hooks/useDepositService";
import { useDepositStatusService } from "../../../hooks/useDepositStatusService";

const DepositsListPage: React.FC<RouteComponentProps> = (props) => {

    const { depositPagination } = useDepositService();
    const { purchaseGetAll } = useDepositStatusService();

    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [messageAlert, setMessageAlert] = useState<string>();

    const [deposit, setDeposit] = useState<Deposit>();
    const [deposits, setDeposits] = useState<Deposit[]>([]);


    const [depositStatus, setdepositStatus] = useState<number>(1); //process.env.REACT_APP_DEPOSIT_TYPE_ACCEPTED
    const [depositStatuses, setdepositStatuses] = useState<DepositStatus[]>([]);


    const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

    //useEffect when page loads and selectedDate changes
    useEffect(() => {
        getDepositStatuses();

    }, []);

    //useEffect when page loads and selectedDate/depositStatus changes
    useEffect(() => {

        // for deposits
        setDeposit((prevState: any) => ({
            ...prevState,
            ['status_id']: depositStatus,
            ['created_at']: selectedDate,
        }));
        setDeposits([]);

    }, [selectedDate, depositStatus]);

    //useEffect to get deposits
    useEffect(() => {
        getDeposits();
    }, [deposit]);


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

    const getDepositStatuses = () => {

        purchaseGetAll().then((response: Response) => {
            if (response?.status) {
                setdepositStatuses(response?.result as DepositStatus[] ?? [])
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
                    <IonTitle><strong>BNB Bank</strong></IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>

                <IonItem>
                    <IonDatetime displayFormat="YYYY-MM-DD" placeholder="Select Date" value={selectedDate} onIonChange={e => setSelectedDate(e.detail.value!)} ></IonDatetime>
                </IonItem>
                <IonItem>
                    <IonLabel>Status</IonLabel>
                    <IonSelect value={depositStatus} onIonChange={e => setdepositStatus(e.detail.value!)} >
                        {depositStatuses.map(depositStatus => (
                            <IonSelectOption key={depositStatus.id} value={depositStatus.code}>
                                {depositStatus.name}
                            </IonSelectOption>
                        ))}
                    </IonSelect>
                </IonItem>

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

                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => props.history.push('/deposit')}>
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

export default DepositsListPage;

