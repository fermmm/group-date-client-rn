import React, { FC } from "react";
import ProfileCard from "../../common/ProfileCard/ProfileCard";
import ButtonBack from "../../common/ButtonBack/ButtonBack";
import { User } from "../../../api/server/shared-tools/endpoints-interfaces/user";
import { useRoute } from "@react-navigation/native";
import { RouteProps } from "../../../common-tools/ts-tools/router-tools";
import { useUser } from "../../../api/server/user";
import { LoadingAnimation, RenderMethod } from "../../common/LoadingAnimation/LoadingAnimation";

export interface ParamsProfilePage {
   user?: User;
}

const ProfilePage: FC = () => {
   const { params } = useRoute<RouteProps<ParamsProfilePage>>();
   const { data: localUser, isLoading } = useUser();

   const { user: UserFromParams } = params ?? {};
   const user = UserFromParams ?? localUser;
   const editMode: boolean = UserFromParams == null;

   return (
      <>
         <ButtonBack />
         {isLoading ? (
            <LoadingAnimation renderMethod={RenderMethod.FullScreen} />
         ) : (
            <ProfileCard user={user} editMode={editMode} statusBarPadding />
         )}
      </>
   );
};

export default ProfilePage;
