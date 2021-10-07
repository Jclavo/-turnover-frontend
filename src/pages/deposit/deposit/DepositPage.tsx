import {
    IonContent, IonHeader, IonPage, IonTitle,
    IonToolbar, IonItem, IonInput, IonLabel, IonRow, IonCol,
    IonGrid, IonButton, IonAlert, IonDatetime, IonTextarea, IonBadge, IonImg
} from '@ionic/react';

import { RouteComponentProps } from 'react-router';
import React, { useEffect, useRef, useState } from 'react';
import { format } from "date-fns";

//CSS
import './DepositPage.css';

//Interfaces
import { Response } from "../../../interfaces/Response";
import { Deposit } from "../../../interfaces/Deposit";

//Hooks
import { useDepositService } from "../../../hooks/useDepositService";
import { useUserService } from "../../../hooks/useUserService";
import { cloudUpload } from 'ionicons/icons';

const DepositPage: React.FC<RouteComponentProps> = (props) => {

    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [messageAlert, setMessageAlert] = useState<string>();

    const { depositCreate } = useDepositService();
    const { userGetBalance } = useUserService();

    const [balance, setBalance] = useState<number>(0);
    const [deposit, setDeposit] = useState<Deposit>();

    const fileInput = useRef(null);

    const handleChange = (e: any) => {

        let { name, value } = e.target;

        setDeposit((prevState: any) => ({
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

        depositCreate(deposit).then((response: Response) => {
            showCustomAlert(response?.message)
            if (response?.status) {
                setDeposit(undefined);
                props.history.push('/my-deposits');
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

    const uploadImage = (e: any) => {

        convertBase64(e.target.files?.item(0)).then(
            data => {
                setDeposit((prevState: any) => ({
                    ...prevState,
                    ['image']: data
                }));
            }
        );
    }

    const convertBase64 = (file: any) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
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
                    <IonTitle><strong>Check Deposit</strong></IonTitle>
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
                                <IonInput value={deposit?.amount} placeholder="Amount" name="amount" onIonBlur={e => handleChange(e)} clearInput> </IonInput>
                            </IonItem>
                        </IonCol>
                    </IonRow>

                    <IonRow className="ion-align-items-center">
                        <IonCol size="6" offset="3">
                            <IonItem>
                                <IonLabel position="stacked"><strong>DESCRIPTION</strong></IonLabel>
                                <IonTextarea value={deposit?.description} placeholder="Description" name="description" onIonBlur={e => handleChange(e)} > </IonTextarea>
                            </IonItem>
                        </IonCol>
                    </IonRow>

                    <IonRow className="ion-align-items-center">
                        <IonCol size="6" offset="3">
                            
                                <input
                                    ref={fileInput}
                                    hidden
                                    type="file"
                                    accept="image/*"
                                    onChange={e => uploadImage(e)}
                                />

                                <IonButton
                                    color="light"
                                    onClick={() => {
                                        // @ts-ignore
                                        fileInput?.current?.click();
                                        // setBackgroundOption(BackgroundOptionType.Gradient);
                                    }}>
                                    UPLOAD CHECK PICTURE
                                </IonButton>
                        </IonCol>
                    </IonRow>

                    <IonRow className="ion-align-items-center">
                        <IonCol size="6" offset="3">
                            <IonImg src={deposit?.image} />
                        </IonCol>
                    </IonRow>

                    <IonRow className="ion-align-items-center">
                        <IonCol size="6" offset="3">
                            <IonButton color="primary" expand="full" shape="round" onClick={() => create()}>DEPOSIT CHECK</IonButton>
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

export default DepositPage;
