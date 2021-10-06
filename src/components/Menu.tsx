import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import { cashOutline, heartSharp, arrowDown, book } from 'ionicons/icons';
import './Menu.css';

//hooks
import { useAuthentication } from "../hooks/useAuthentication";

interface AppPage {
  url: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [

  {
    title: 'Balance',
    url: '/balance',
    mdIcon: heartSharp
  },

  {
    title: 'Expenses',
    url: '/expenses',
    mdIcon: arrowDown
  },
  {
    title: 'Checks',
    url: '/checks',
    mdIcon: cashOutline
  },

];

const Menu: React.FC = (props) => {
  const location = useLocation();

  const { getUserName, getUserEmail } = useAuthentication();



  return (
    <IonMenu contentId="main" type="overlay" hidden={location.pathname === '/login' || location.pathname === '/user' ? true : false}>
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>{getUserName()}</IonListHeader>
          <IonNote>{getUserEmail()}</IonNote>
          {appPages.map((appPage, index) => {
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

      </IonContent>
    </IonMenu>
  );
};

export default Menu;
