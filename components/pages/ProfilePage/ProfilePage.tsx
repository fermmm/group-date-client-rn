import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { withTheme } from "react-native-paper";
import { Themed } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { StackScreenProps } from "@react-navigation/stack";
import ProfileCard from "../../common/ProfileCard/ProfileCard";
import ButtonBack from "../../common/ButtonBack/ButtonBack";
import { Route } from "@react-navigation/native";
import { User } from "../../../api/server/shared-tools/endpoints-interfaces/user";

export interface Props extends Themed, StackScreenProps<{}> {}
export interface State {}
interface RouteParams {
   user: User;
   editMode: boolean;
}

class ProfilePage extends Component<Props, State> {
   static defaultProps: Partial<Props> = {};
   route: Route<string, RouteParams> = this.props.route as Route<string, RouteParams>;

   render(): JSX.Element {
      const { user, editMode }: RouteParams = this.route.params;

      return (
         <>
            <ButtonBack />
            <ProfileCard user={user} editMode={editMode} statusBarPadding />
         </>
      );
   }
}

const styles: Styles = StyleSheet.create({});

export default withTheme(ProfilePage);
