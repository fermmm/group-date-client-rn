import React, { FC } from "react";
import CardsPage from "../CardsPage/CardsPage";
import GroupsListPage from "../GroupsListPage/GroupsListPage";
import SettingsPage from "../SettingsPage/SettingsPage";
import NotificationsPage from "../NotificationsPage/NotificationsPage";
import GraphSvg2 from "../../../assets/GraphSvg2";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";
import { NavigationBar } from "../../common/NavigationBar/NavigationBar";

const MainPage: FC = () => {
   const { colors } = useTheme();

   return (
      <NavigationBar
         sections={{
            cards: () => <CardsPage />,
            notifications: () => <NotificationsPage />,
            groups: () => <GroupsListPage />,
            settings: () => <SettingsPage />
         }}
         routes={[
            {
               key: "cards",
               iconNameOrComp: "cards"
            },
            {
               key: "notifications",
               iconNameOrComp: "bell",
               badgeNumber: 3
            },
            {
               key: "groups",
               iconNameOrComp: (
                  <GraphSvg2
                     circleColor={colors.text2}
                     lineColor={colors.text2}
                     style={{
                        width: 20
                     }}
                  />
               ),
               badgeNumber: 2
            },
            {
               key: "settings",
               iconNameOrComp: "account-settings"
            }
         ]}
      />
   );
};
export default MainPage;
