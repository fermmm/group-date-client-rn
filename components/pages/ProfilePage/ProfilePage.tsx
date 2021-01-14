import React, { FC } from "react";
import ProfileCard from "../../common/ProfileCard/ProfileCard";
import ButtonBack from "../../common/ButtonBack/ButtonBack";
import { User } from "../../../api/server/shared-tools/endpoints-interfaces/user";
import { useRoute } from "@react-navigation/native";
import { RouteProps } from "../../../common-tools/ts-tools/router-tools";

export interface ParamsProfilePage {
   user: User;
   editMode: boolean;
}

const ProfilePage: FC = () => {
   const {
      params: { user, editMode }
   } = useRoute<RouteProps<ParamsProfilePage>>();

   return (
      <>
         <ButtonBack />
         <ProfileCard user={user} editMode={editMode} statusBarPadding />
      </>
   );
};

export default ProfilePage;
