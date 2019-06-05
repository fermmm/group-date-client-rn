import React, { Component } from "react";
import NavigationBar from "../../common/NavigationBar/NavigationBar";
import CardsPage from "./CardsPage/CardsPage";
import GroupsPage from "./GroupsPage/GroupsPage";
import SettingsPage from "./SettingsPage/SettingsPage";

export default class MainPage extends Component {
    render(): JSX.Element {
        return (
            <NavigationBar
                sections={{
                    cards: () => <CardsPage />,
                    groups: () => <GroupsPage />,
                    settings: () => <SettingsPage />,
                }}
                routes={[
                    { key: "cards", icon: "cards" },
                    { key: "groups", icon: "infinity" },
                    { key: "settings", icon: "account-settings" },
                ]}
            />
        );
    }
}
