import {
    IonPage
} from '@ionic/react';

import { RouteComponentProps } from 'react-router';
import React from 'react';


const Page404: React.FC<RouteComponentProps> = (props) => {

    return (
        <IonPage>
            You are lost.        
        </IonPage>
    );
};

export default Page404;
