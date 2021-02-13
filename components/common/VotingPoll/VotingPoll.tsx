import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Text, Button } from "react-native-paper";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import SurfaceStyled from "../SurfaceStyled/SurfaceStyled";
import { currentTheme } from "../../../config";
import ProgressBar from "../ProgressBar/ProgressBar";
import { Group } from "../../../api/server/shared-tools/endpoints-interfaces/groups";
import { dayAndMonthFromUnixDate } from "../../../common-tools/dates/dates-tools";
import { getGroupMember } from "../../../api/tools/groupTools";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";

export interface VotingPollProps {
   group: Group;
   subject: VoteSubject;
   onDayOptionVote: () => void;
   onIdeaVote: () => void;
}

const VotingPoll: FC<VotingPollProps> = props => {
   const { subject, group } = props;
   const { colors } = useTheme();

   let votingOptions: VotingOption[] = [];
   if (subject === VoteSubject.Date) {
      votingOptions = group.dayOptions.map(o => ({
         name: dayAndMonthFromUnixDate(o.date),
         id: o.date,
         voters: o.votersUserId
      }));
   }

   return (
      <>
         {votingOptions.map((votingOption: VotingOption, i) => (
            <SurfaceStyled key={i}>
               <Text style={styles.textLine1}>{votingOption.name}</Text>
               {/* {votingOption.textLine2 && (
                     <Text style={styles.textLine2}>{votingOption.textLine2}</Text>
                  )} */}
               <View style={styles.rowContainer}>
                  <ProgressBar
                     progress={votingOption.voters?.length ?? 0 / group.members.length}
                     fillColor={colors.primary}
                  />
                  <Button
                     compact
                     onPress={() => console.log("vote pressed")}
                     uppercase={false}
                     icon={"plus"}
                  >
                     Votar
                  </Button>
               </View>
               {votingOption.voters.length > 0 && (
                  <View style={styles.rowContainer}>
                     <Text style={styles.votesAmountText}>
                        {votingOption.voters.length}{" "}
                        {votingOption.voters.length > 1 ? "votos" : "voto"}
                        {":"}
                     </Text>
                     <Text style={styles.votersText}>
                        {votingOption.voters.map(id => getGroupMember(id, group).name).join(", ")}
                     </Text>
                  </View>
               )}
            </SurfaceStyled>
         ))}
      </>
   );
};

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

export default VotingPoll;

export enum VoteSubject {
   Date,
   Idea
}

interface VotingOption {
   name: string;
   id: string | number;
   voters: string[];
}
