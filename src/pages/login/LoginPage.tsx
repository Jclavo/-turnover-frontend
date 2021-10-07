import {
    IonContent, IonHeader, IonPage, IonTitle,
    IonToolbar, IonItem, IonInput, IonLabel, IonRow, IonCol,
    IonGrid, IonButton, IonAlert, useIonViewDidEnter
} from '@ionic/react';

import { RouteComponentProps } from 'react-router';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

//CSS
import './LoginPage.css';

//Interfaces
import { Response } from "../../interfaces/Response";
import { User } from "../../interfaces/User";

//Hooks
import { useUserService } from "../../hooks/useUserService";
import { useAuthentication } from "../../hooks/useAuthentication";


const LoginPage: React.FC<RouteComponentProps> = (props) => {

    const [user, setUser] = useState<User>();


    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [messageAlert, setMessageAlert] = useState<string>();

    const location = useLocation();
    const { userLogin } = useUserService();
    const { saveUserInStorage, cleanStorage, getUserType } = useAuthentication();


    useIonViewDidEnter(() => {
        // if (props.history.length > 1) {
        //     // props.history.go(-(props.history.length - 1))
        //     props.history.go(1)
        // }

        cleanStorage();
    });


    const handleChange = (e: any) => {

        let { name, value } = e.target;

        setUser((prevState: any) => ({
            ...prevState,
            [name]: value
        }));

    }

    const login = () => {

        // Validations
        if (formValidation(user)) return;

        userLogin(user).then((response: Response) => {
            if (response?.status) {
                saveUserInStorage(response?.result as User);

                console.log()
                if (getUserType() == process.env.REACT_APP_USER_TYPE_ADMIN) {
                    props.history.push('/deposits');
                }else{
                    props.history.push('/balance');
                }

            }else{
                showCustomAlert(response?.message)
            }
        });

    }

    const showCustomAlert = (message: string) => {
        setMessageAlert(message);
        setShowAlert(true);
    }

    const formValidation = (user: User | undefined): boolean => {

        /***
         * validation zone by fields
         */

        //email
        if (!user?.email) {
            showCustomAlert('Email is mandatory.');
            return true;
        }

        //email
        if (!user?.password) {
            showCustomAlert('Password is mandatory.');
            return true;
        }

        // if everything goes well
        return false;
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
                    {/* <IonRow className="ion-align-items-center">
                        <IonCol size="6" offset="3">
                            <IonItem>
                                <IonLabel position="stacked"><strong>USERNAME</strong></IonLabel>
                                <IonInput value={user?.email} placeholder="Username" name="username" clearInput> </IonInput>
                            </IonItem>
                        </IonCol>
                    </IonRow> */}
                    <IonRow className="ion-align-items-center">
                        <IonCol size="6" offset="3">
                            <IonItem>
                                <IonLabel position="stacked"><strong>EMAIL</strong></IonLabel>
                                <IonInput value={user?.email} placeholder="Email" name="email" onIonBlur={e => handleChange(e)}> </IonInput>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow className="ion-align-items-center">
                        <IonCol size="6" offset="3">
                            <IonItem>
                                <IonLabel position="stacked"><strong>PASSWORD</strong></IonLabel>
                                <IonInput value={user?.password} placeholder="Password" type="password" name="password" onIonBlur={e => handleChange(e)}> </IonInput>
                            </IonItem>
                        </IonCol>
                    </IonRow>

                    <IonRow className="ion-align-items-center">
                        <IonCol size="6" offset="3">
                            <IonButton color="primary" expand="full" shape="round" onClick={() => login()}>Login</IonButton>
                        </IonCol>
                    </IonRow>

                    <IonRow className="ion-align-items-center">
                        <IonCol size="6" offset="3">
                            <IonButton color="light" expand="full" shape="round" onClick={() => props.history.push('/user')}>Create User</IonButton>
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

export default LoginPage;
