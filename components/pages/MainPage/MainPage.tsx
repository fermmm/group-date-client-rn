import React, { Component } from "react";
import { NavigationContainerProps } from "@react-navigation/native";
import NavigationBar from "../../common/NavigationBar/NavigationBar";
import CardsPage from "../CardsPage/CardsPage";
import GroupsListPage from "../GroupsListPage/GroupsListPage";
import SettingsPage from "../SettingsPage/SettingsPage";
import NotificationsPage from "../NotificationsPage/NotificationsPage";
import GraphSvg2 from "../../../assets/GraphSvg2";
import { Themed, ThemeExt } from "../../../common-tools/themes/types/Themed";
import { withTheme } from "react-native-paper";

class MainPage extends Component<NavigationContainerProps & Themed> {
   render(): JSX.Element {
      const { colors }: ThemeExt = (this.props.theme as unknown) as ThemeExt;

      return (
         <NavigationBar
            sections={{
               cards: () => <CardsPage />,
               notifications: () => <NotificationsPage />,
               groups: () => <GroupsListPage />,
               settings: () => <SettingsPage />
            }}
            routes={[
               { key: "cards", icon: "cards" },
               { key: "notifications", icon: "bell", badgeText: "3" },
               {
                  key: "groups",
                  icon: (
                     <GraphSvg2
                        circleColor={colors.text2}
                        lineColor={colors.text2}
                        style={{ width: 20 }}
                     />
                  ),
                  badgeText: "2"
               },
               { key: "settings", icon: "account-settings" }
            ]}
         />
      );
   }
}

export default withTheme(MainPage);
