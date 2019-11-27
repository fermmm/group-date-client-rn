import React, { Component } from "react";
import NavigationBar from "../../common/NavigationBar/NavigationBar";
import CardsPage from "../CardsPage/CardsPage";
import GroupsListPage from "../GroupsListPage/GroupsListPage";
import SettingsPage from "../SettingsPage/SettingsPage";
import { NavigationContainerProps } from "react-navigation";
import NotificationsPage from "../NotificationsPage/NotificationsPage";

export default class MainPage extends Component<NavigationContainerProps> {
   render(): JSX.Element { 
      return (
         <NavigationBar
            sections={{
               cards: () => <CardsPage />,
               groups: () => <GroupsListPage />,
               notifications: () => <NotificationsPage />,
               settings: () => <SettingsPage />,
            }}
            routes={[
               { key: "cards", icon: "cards" },
               { key: "groups", icon: "infinity", badgeText: "2" },
               { key: "notifications", icon: "bell", badgeText: "3" },
               { key: "settings", icon: "account-settings" },
            ]}
         />
      );
   }
}
