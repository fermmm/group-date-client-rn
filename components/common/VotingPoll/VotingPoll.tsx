import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Text, Button } from "react-native-paper";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import SurfaceStyled from "../SurfaceStyled/SurfaceStyled";
import { currentTheme } from "../../../config";
import ProgressBar from "../ProgressBar/ProgressBar";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";
import { User } from "../../../api/server/shared-tools/endpoints-interfaces/user";
import { toFirstUpperCase } from "../../../common-tools/js-tools/js-tools";

export interface VotingPollProps {
   votingOptions: VotingOption[];
   potentialVoters: User[];
   userId: string;
   onVoteChange: (userVotes: Array<string | number>, specificChange: VoteChange) => void;
}

const VotingPoll: FC<VotingPollProps> = props => {
   const { votingOptions, potentialVoters, userId, onVoteChange } = props;
   const { colors } = useTheme();

   const isVoted = (votingOption: VotingOption, userId: string) => {
      return votingOption.voters?.includes(userId) === true;
   };

   const handleVotePress = (id: string | number) => {
      const userVotes = votingOptions.filter(op => isVoted(op, userId)).map(op => op.id);
      const alreadyVoted = userVotes.includes(id);

      // If the option is already voted it means the user wanted to remove the vote
      if (alreadyVoted) {
         userVotes.splice(userVotes.indexOf(id), 1);
      } else {
         userVotes.push(id);
      }

      onVoteChange(userVotes, { id, removed: alreadyVoted });
   };

   return (
      <>
         {votingOptions?.map((votingOption: VotingOption, i) => (
            <SurfaceStyled key={i}>
               <Text style={styles.textLine1}>{votingOption.name}</Text>
               <View style={styles.rowContainer}>
                  <ProgressBar
                     progress={(votingOption.voters?.length ?? 0) / potentialVoters.length}
                     fillColor={colors.primary}
                  />
                  <Button
                     compact
                     onPress={() => handleVotePress(votingOption.id)}
                     uppercase={false}
                     icon={isVoted(votingOption, userId) ? "minus" : "plus"}
                  >
                     {isVoted(votingOption, userId) ? "Quitar voto" : "Votar"}
                  </Button>
               </View>
               {votingOption.voters?.length > 0 && (
                  <View style={styles.rowContainer}>
                     <Text style={styles.votesAmountText}>
                        {votingOption.voters.length}{" "}
                        {votingOption.voters.length > 1 ? "votos" : "voto"}
                        {":"}
                     </Text>
                     <Text style={styles.votersText}>
                        {votingOption.voters
                           .map(id =>
                              toFirstUpperCase(potentialVoters.find(v => v.userId === id).name)
                           )
                           .join(", ")}
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

export interface VotingOption {
   name: string;
   id: string | number;
   voters?: string[];
}

export interface VoteChange {
   id: string | number;
   removed: boolean;
}
