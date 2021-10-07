import {
    IonContent, IonHeader, IonPage, IonTitle,
    IonToolbar, IonItem, IonInput, IonLabel, IonRow, IonCol,
    IonGrid, IonButton, IonAlert, IonImg
} from '@ionic/react';

import { RouteComponentProps, useParams } from 'react-router';
import React, { useEffect, useRef, useState } from 'react';

//CSS
import './DepositDetailPage.css';

//Interfaces
import { Response } from "../../../interfaces/Response";
import { Deposit } from "../../../interfaces/Deposit";

//Hooks
import { useDepositService } from "../../../hooks/useDepositService";
import { useUserService } from "../../../hooks/useUserService";

const DepositDetailPage: React.FC<RouteComponentProps> = (props) => {

    const { id } = useParams<{ id: string; }>();

    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [messageAlert, setMessageAlert] = useState<string>();

    const { depositGetById, depositUpdateStatus } = useDepositService();

    const [deposit, setDeposit] = useState<Deposit>();

    //useEffect when page loads 
    useEffect(() => {
        getDepositById(id as unknown as number);
    }, []);

    //useEffect when deposit changes
    useEffect(() => {
        updateStatus();
    }, [deposit]);

    const getDepositById = (id: number) => {

        if (id <= 0) return;
        depositGetById(id).then((response: Response) => {
            if (response?.status) {
                setDeposit(response?.result as Deposit)
            }
        });
    }

    const updateStatus = () => {

        if(deposit?.status_id == process.env.REACT_APP_DEPOSIT_TYPE_PENDING) return;
        if(deposit === undefined) return;

        console.log(deposit)
        depositUpdateStatus(deposit).then((response: Response) => {
            if (response?.status) {
                props.history.push('/deposits');
            } else {
                showCustomAlert(response?.message)
            }
        });
    }

    const setStatus = (status: string | undefined) => {
        setDeposit((prevState: any) => ({
            ...prevState,
            ['status_id']: status,
        }));
    }

    const showCustomAlert = (message: string) => {
        setMessageAlert(message);
        setShowAlert(true);
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle><strong>Check Details</strong></IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>

                <IonGrid>
                    <IonRow className="ion-align-items-center">
                        <IonCol size="6" offset="3">
                            <IonItem>
                                <IonLabel position="stacked"><strong>CUSTOMER</strong></IonLabel>
                                <IonInput value={deposit?.user.username} name="username" readonly> </IonInput>
                            </IonItem>
                        </IonCol>
                    </IonRow>

                    <IonRow className="ion-align-items-center">
                        <IonCol size="6" offset="3">
                            <IonItem>
                                <IonLabel position="stacked"><strong>CUSTOMER EMAIL</strong></IonLabel>
                                <IonInput value={deposit?.user.email} name="email" readonly> </IonInput>
                            </IonItem>
                        </IonCol>
                    </IonRow>

                    <IonRow className="ion-align-items-center">
                        <IonCol size="6" offset="3">
                            <IonItem>
                                <IonLabel position="stacked"><strong>DEPOSIT</strong></IonLabel>
                                <IonInput value={deposit?.amount} name="amount" readonly> </IonInput>
                            </IonItem>
                        </IonCol>
                    </IonRow>

                    <IonRow className="ion-align-items-center">
                        <IonCol size="6" offset="3">
                            <IonImg src={process.env.REACT_APP_API_URL_IMAGE + deposit?.image} />
                        </IonCol>
                    </IonRow>

                    <IonRow className="ion-align-items-center">
                        <IonCol size="6" offset="3">
                            <IonButton color="primary" expand="full" shape="round" onClick={() => setStatus(process.env.REACT_APP_DEPOSIT_TYPE_ACCEPTED)}>ACCEPT</IonButton>
                        </IonCol>
                    </IonRow>
                    <IonRow className="ion-align-items-center">
                        <IonCol size="6" offset="3">
                            <IonButton color="danger" expand="full" shape="round" onClick={() => setStatus(process.env.REACT_APP_DEPOSIT_TYPE_REJECTED)}>REJECT</IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>

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

export default DepositDetailPage;
