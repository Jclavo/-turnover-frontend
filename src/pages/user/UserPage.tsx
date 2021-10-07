import {
    IonContent, IonHeader, IonPage, IonTitle,
    IonToolbar, IonItem, IonInput, IonLabel, IonRow, IonCol,
    IonGrid, IonButton, IonAlert, useIonViewDidEnter
} from '@ionic/react';

import { RouteComponentProps } from 'react-router';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

//CSS
import './UserPage.css';

//Interfaces
import { Response } from "../../interfaces/Response";
import { User } from "../../interfaces/User";

//Hooks
import { useUserService } from "../../hooks/useUserService";
import { useAuthentication } from "../../hooks/useAuthentication";


const UserPage: React.FC<RouteComponentProps> = (props) => {

    const [user, setUser] = useState<User>();


    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [messageAlert, setMessageAlert] = useState<string>();

    const location = useLocation();
    const { userCreate } = useUserService();
    const { cleanStorage } = useAuthentication();


    useIonViewDidEnter(() => {
        // set type_id 
        setUser((prevState: any) => ({
            ...prevState,
            ['type_id']: process.env.REACT_APP_USER_TYPE_CUSTOMER
        }));

        cleanStorage();
    });


    const handleChange = (e: any) => {

        let { name, value } = e.target;

        setUser((prevState: any) => ({
            ...prevState,
            [name]: value
        }));

    }

    const create = () => {

        if (user == undefined) return;

        userCreate(user).then((response: Response) => {
            showCustomAlert(response?.message)
            if (response?.status) {
                setUser(undefined);
                props.history.push('/login');
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

                <IonGrid>
                    <IonRow className="ion-align-items-center">
                        <IonCol size="6" offset="3">
                            <IonItem>
                                <IonLabel position="stacked"><strong>USERNAME</strong></IonLabel>
                                <IonInput value={user?.username} placeholder="Username" name="username" onIonBlur={e => handleChange(e)}  clearInput> </IonInput>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow className="ion-align-items-center">
                        <IonCol size="6" offset="3">
                            <IonItem>
                                <IonLabel position="stacked"><strong>EMAIL</strong></IonLabel>
                                <IonInput value={user?.email} placeholder="Email" name="email" onIonBlur={e => handleChange(e)} clearInput> </IonInput>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow className="ion-align-items-center">
                        <IonCol size="6" offset="3">
                            <IonItem>
                                <IonLabel position="stacked"><strong>PASSWORD</strong></IonLabel>
                                <IonInput value={user?.password} placeholder="Password" type="password" name="password" onIonBlur={e => handleChange(e)} clearInput> </IonInput>
                            </IonItem>
                        </IonCol>
                    </IonRow>

                    <IonRow className="ion-align-items-center">
                        <IonCol size="6" offset="3">
                            <IonButton color="primary" expand="full" shape="round" onClick={() => create()}>Create</IonButton>
                        </IonCol>
                    </IonRow>

                    <IonRow className="ion-align-items-center">
                        <IonCol size="6" offset="3">
                            <IonButton color="light" expand="full" shape="round" onClick={() => props.history.push('/login')}>Log in</IonButton>
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

export default UserPage;
