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
   requestFullInfo?: boolean;
   editMode?: boolean;
}

const ProfilePage: FC = () => {
   const { params } = useRoute<RouteProps<ParamsProfilePage>>();
   const { user: userFromParams, requestFullInfo, editMode } = params ?? {};
   const { data: userRequested } = useUser(
      requestFullInfo && userFromParams
         ? { requestParams: { userId: userFromParams.userId } }
         : null
   );
   const user = !requestFullInfo && userFromParams ? userFromParams : userRequested;

   return (
      <>
         <ButtonBack />
         {!user ? (
            <LoadingAnimation renderMethod={RenderMethod.FullScreen} />
         ) : (
            <ProfileCard user={user} editMode={editMode} statusBarPadding />
         )}
      </>
   );
};

export default ProfilePage;
