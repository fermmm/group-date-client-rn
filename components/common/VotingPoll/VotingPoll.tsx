import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { withTheme, Text, Button } from "react-native-paper";
import { Themed, ThemeExt } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import SurfaceStyled from "../SurfaceStyled/SurfaceStyled";
import { currentTheme } from "../../../config";
import ProgressBar from "../ProgressBar/ProgressBar";
import {
   DayOption,
   Group,
   IdeaOption
} from "../../../api/server/shared-tools/endpoints-interfaces/groups";
import { dayAndMonthFromUnixDate } from "../../../common-tools/dates/dates-tools";
import { getGroupMember } from "../../../api/tools/groupTools";

export interface VotingPollProps extends Themed {
   group: Group;
   votingOptions: Array<DayOption | IdeaOption>;
}
export interface VotingPollState {}

class VotingPoll extends Component<VotingPollProps, VotingPollState> {
   static defaultProps: Partial<VotingPollProps> = {};

   render(): JSX.Element {
      const { votingOptions, group }: Partial<VotingPollProps> = this.props;
      const { colors }: ThemeExt = (this.props.theme as unknown) as ThemeExt;

      return (
         <>
            {votingOptions.map((votingOption: DayOption | IdeaOption, i) => (
               <SurfaceStyled key={i}>
                  <Text style={styles.textLine1}>
                     {"date" in votingOption
                        ? dayAndMonthFromUnixDate(votingOption.date)
                        : getGroupMember(votingOption.ideaOfUser, group).dateIdea}
                  </Text>
                  {/* {votingOption.textLine2 && (
                     <Text style={styles.textLine2}>{votingOption.textLine2}</Text>
                  )} */}
                  <View style={styles.rowContainer}>
                     <ProgressBar
                        progress={votingOption.votersUserId.length / group.members.length}
                        fillColor={colors.primary}
                     />
                     <Button
                        compact
                        onPress={() => console.log("vote pressed")}
                        uppercase={false}
                        icon={"add"}
                     >
                        Votar
                     </Button>
                  </View>
                  {votingOption.votersUserId.length > 0 && (
                     <View style={styles.rowContainer}>
                        <Text style={styles.votesAmountText}>
                           {votingOption.votersUserId.length}{" "}
                           {votingOption.votersUserId.length > 1 ? "votos" : "voto"}
                           {":"}
                        </Text>
                        <Text style={styles.votersText}>
                           {votingOption.votersUserId
                              .map(id => getGroupMember(id, group).name)
                              .join(", ")}
                        </Text>
                     </View>
                  )}
               </SurfaceStyled>
            ))}
         </>
      );
   }
}

const styles: Styles = StyleSheet.create({
   textLine1: {
      fontFamily: currentTheme.font.regular,
      fontSize: 15,
      marginBottom: 5
   },
   textLine2: {
      fontFamily: currentTheme.font.light,
      fontSize: 12
   },
   rowContainer: {
      flexDirection: "row",
      alignItems: "center"
   },
   resultBar: {
      flex: 1
   },
   votesAmountText: {
      fontFamily: currentTheme.font.regular,
      fontSize: 12,
      marginRight: 7
   },
   votersText: {
      flex: 1,
      fontFamily: currentTheme.font.thin,
      fontSize: 12
   }
});

export default withTheme(VotingPoll);
