import React, { FC, useEffect, useState } from "react";
import { Dimensions } from "react-native";
import CardsPage from "../../pages/CardsPage/CardsPage";
import GroupsListPage from "../../pages/GroupsListPage/GroupsListPage";
import NotificationsPage from "../../pages/NotificationsPage/NotificationsPage";
import SettingsPage from "../../pages/SettingsPage/SettingsPage";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNotificationsInfo } from "../../pages/NotificationsPage/tools/useNotificationsInfo";
import { TagsPage } from "../TagsPage/TagsPage";
import CustomTabBar from "./CustomTabBar/CustomTabBar";

const Tab = createMaterialTopTabNavigator();

const MainPage: FC = () => {
   const { notSeenNotifications } = useNotificationsInfo();
   const [badgeNumbers, setBadgeNumbers] = useState<Record<string, number>>({
      Cards: 0,
      Notifications: 0,
      Groups: 0,
      Settings: 0
   });

   useEffect(() => {
      setBadgeNumbers({ ...badgeNumbers, Notifications: notSeenNotifications?.length ?? 0 });
   }, [notSeenNotifications]);

   return (
      <Tab.Navigator
         initialRouteName={"Cards"}
         swipeEnabled={false}
         initialLayout={{
            height: 0,
            width: Dimensions.get("window").width
         }}
         tabBar={props => <CustomTabBar {...props} badgeNumbers={badgeNumbers} />}
      >
         <Tab.Screen name="Cards" component={CardsPage} />
         <Tab.Screen name="Groups" component={GroupsListPage} />
         <Tab.Screen name="Notifications" component={NotificationsPage} />
         <Tab.Screen name="Tags" component={TagsPage} />
         <Tab.Screen name="Settings" component={SettingsPage} />
      </Tab.Navigator>
   );
};

export default MainPage;
