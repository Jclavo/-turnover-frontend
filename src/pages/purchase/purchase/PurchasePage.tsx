import {
    IonContent, IonHeader, IonPage, IonTitle,
    IonToolbar, IonItem, IonInput, IonLabel, IonRow, IonCol,
    IonGrid, IonButton, IonAlert, useIonViewDidEnter, IonDatetime, IonTextarea, IonBadge
} from '@ionic/react';

import { RouteComponentProps } from 'react-router';
import React, { useEffect, useState } from 'react';
import { format } from "date-fns";

//CSS
import './PurchasePage.css';

//Interfaces
import { Response } from "../../../interfaces/Response";
import { Purchase } from "../../../interfaces/Purchase";

//Hooks
import { usePurchaseService } from "../../../hooks/usePurchaseService";
import { useUserService } from "../../../hooks/useUserService";

const PurchasePage: React.FC<RouteComponentProps> = (props) => {

    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [messageAlert, setMessageAlert] = useState<string>();

    const { purchaseCreate } = usePurchaseService();
    const { userGetBalance } = useUserService();

    const [balance, setBalance] = useState<number>(0);
    const [purchase, setPurchase] = useState<Purchase>();

    const handleChange = (e: any) => {

        let { name, value } = e.target;

        setPurchase((prevState: any) => ({
            ...prevState,
            [name]: value
        }));

    }

    //useEffect when page loads and selectedDate changes
    useEffect(() => {

        //get user balance
        getUserBalance()

    }, [props]);

    const create = () => {

        purchaseCreate(purchase).then((response: Response) => {
            showCustomAlert(response?.message)
            if (response?.status) {
                setPurchase(undefined);
                props.history.push('/purchases');
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
                    <IonTitle><strong>Purchase</strong></IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>

                <IonItem>
                    <IonLabel>BALANCE</IonLabel>
                    <IonBadge slot="end" color="warning">$ {balance}</IonBadge>
                </IonItem>

                <IonGrid>
                    <IonRow className="ion-align-items-center">
                        <IonCol size="6" offset="3">
                            <IonItem>
                                <IonLabel position="stacked"><strong>AMOUNT $</strong></IonLabel>
                                <IonInput value={purchase?.amount} placeholder="Amount" name="amount" onIonBlur={e => handleChange(e)} clearInput> </IonInput>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow className="ion-align-items-center">
                        <IonCol size="6" offset="3">
                            <IonItem>
                                <IonLabel position="stacked"><strong>DATE</strong></IonLabel>
                                <IonDatetime displayFormat="YYYY-MM-DD" placeholder="Select Date" value={format(new Date(), 'yyyy-MM-dd')} readonly></IonDatetime>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow className="ion-align-items-center">
                        <IonCol size="6" offset="3">
                            <IonItem>
                                <IonLabel position="stacked"><strong>DESCRIPTION</strong></IonLabel>
                                <IonTextarea value={purchase?.description} placeholder="Description" name="description" onIonBlur={e => handleChange(e)} > </IonTextarea>
                            </IonItem>
                        </IonCol>
                    </IonRow>

                    <IonRow className="ion-align-items-center">
                        <IonCol size="6" offset="3">
                            <IonButton color="primary" expand="full" shape="round" onClick={() => create()}>ADD PURCHASE</IonButton>
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

export default PurchasePage;
