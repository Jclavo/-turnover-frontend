import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import { cashOutline, heartSharp, arrowDown, book, logOut } from 'ionicons/icons';
import './Menu.css';

//hooks
import { useAuthentication } from "../hooks/useAuthentication";
import { useEffect, useState } from 'react';

interface AppPage {
  url: string;
  mdIcon: string;
  title: string;
}

const menuCustomer: AppPage[] = [

  {
    title: 'Balance',
    url: '/balance',
    mdIcon: heartSharp
  },

  {
    title: 'Expenses',
    url: '/purchases',
    mdIcon: arrowDown
  },
  {
    title: 'Checks',
    url: '/my-deposits',
    mdIcon: cashOutline
  },

];

const menuAdmin: AppPage[] = [
  {
    title: 'Checks Control',
    url: '/deposits',
    mdIcon: cashOutline
  },

];

const Menu: React.FC = (props) => {
  const location = useLocation();

  const { getUserName, getUserEmail, getUserType, cleanStorage } = useAuthentication();

  const logout = () => {
    cleanStorage();
  }

  return (
    <IonMenu contentId="main" type="overlay" hidden={['/login','/user','/page-404'].includes(location.pathname.toLowerCase())}>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle><strong>BNB Bank</strong></IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>{getUserName()}</IonListHeader>
          <IonNote>{getUserEmail()}</IonNote>
          {
            (getUserType() == process.env.REACT_APP_USER_TYPE_ADMIN) ? menuAdmin.map((appPage, index) => {
              return (
                <IonMenuToggle key={index} autoHide={false}>
                  <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                    <IonIcon slot="start" md={appPage.mdIcon} />
                    <IonLabel>{appPage.title}</IonLabel>
                  </IonItem>
                </IonMenuToggle>
              );
            }) : menuCustomer.map((appPage, index) => {
              return (
                <IonMenuToggle key={index} autoHide={false}>
                  <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                    <IonIcon slot="start" md={appPage.mdIcon} />
                    <IonLabel>{appPage.title}</IonLabel>
                  </IonItem>
                </IonMenuToggle>
              );
            })}
        </IonList>

        <IonList id="labels-list">
          {/* <IonListHeader></IonListHeader> */}
            <IonItem lines="none" routerLink="/login" onClick={() => logout()} >
              <IonIcon slot="start" icon={logOut} color="danger" />
              <IonLabel>Sair</IonLabel>
            </IonItem>
        </IonList>

      </IonContent>
    </IonMenu>
  );
};

export default Menu;
