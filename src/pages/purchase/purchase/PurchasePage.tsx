import {
    IonContent, IonHeader, IonPage, IonTitle,
    IonToolbar, IonItem, IonInput, IonLabel, IonRow, IonCol,
    IonGrid, IonButton, IonAlert, useIonViewDidEnter, IonDatetime, IonTextarea
} from '@ionic/react';

import { RouteComponentProps } from 'react-router';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { format } from "date-fns";

//CSS
import './PurchasePage.css';

//Interfaces
import { Response } from "../../../interfaces/Response";
import { Purchase } from "../../../interfaces/Purchase";

//Hooks
import { usePurchaseService } from "../../../hooks/usePurchaseService";


const PurchasePage: React.FC<RouteComponentProps> = (props) => {

    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [messageAlert, setMessageAlert] = useState<string>();

    const { purchaseCreate } = usePurchaseService();

    const [purchase, setPurchase] = useState<Purchase>();



    const handleChange = (e: any) => {

        let { name, value } = e.target;

        setPurchase((prevState: any) => ({
            ...prevState,
            [name]: value
        }));

    }

    const create = () => {

        purchaseCreate(purchase).then((response: Response) => {
            showCustomAlert(response?.message)
            if (response?.status) {
                setPurchase(undefined);
                props.history.push('/expenses');
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
