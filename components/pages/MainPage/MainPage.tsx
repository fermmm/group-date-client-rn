import React, { Component } from "react";
import NavigationBar from "../../common/NavigationBar/NavigationBar";
import CardsPage from "../CardsPage/CardsPage";
import GroupsListPage from "../GroupsListPage/GroupsListPage";
import SettingsPage from "../SettingsPage/SettingsPage";
import EventsPage from "../EventsPage/EventsPage";
import { NavigationContainerProps } from "react-navigation";

export default class MainPage extends Component<NavigationContainerProps> {
   render(): JSX.Element { 
      return (
         <NavigationBar
            sections={{
               cards: () => <CardsPage />,
               groups: () => <GroupsListPage />,
               events: () => <EventsPage />,
               settings: () => <SettingsPage />,
            }}
            routes={[
               { key: "cards", icon: "cards" },
               { key: "groups", icon: "infinity" },
               { key: "events", icon: "calendar" },
               { key: "settings", icon: "account-settings" },
            ]}
         />
      );
   }
}
