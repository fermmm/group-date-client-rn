import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { withTheme, Text, Button } from "react-native-paper";
import { Themed, ThemeExt } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import SurfaceStyled from "../SurfaceStyled/SurfaceStyled";
import { currentTheme } from "../../../config";
import ProgressBar from "../ProgressBar/ProgressBar";
import { Group } from "../../../api/typings/Group";
import { VotingOption } from "../../../api/tools/debug-tools/testingFakeData";

export interface VotingPollProps extends Themed {
   group: Group;
   votingOptions: VotingOption[];
}
export interface VotingPollState { }

class VotingPoll extends Component<VotingPollProps, VotingPollState> {
   static defaultProps: Partial<VotingPollProps> = {};

   render(): JSX.Element {
      const { votingOptions, group }: Partial<VotingPollProps> = this.props;
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;

      return (
         <>
            {
               votingOptions.map((votingOption, i) =>
                  <SurfaceStyled key={i}>
                     <Text style={styles.textLine1}>
                        {votingOption.textLine1}
                     </Text>
                     {
                        votingOption.textLine2 &&
                           <Text style={styles.textLine2}>
                              {votingOption.textLine2}
                           </Text>
                     }
                     <View style={styles.rowContainer}>
                        <ProgressBar progress={votingOption.votersAmmount / group.members.length} fillColor={colors.primary} />
                        <Button compact onPress={() => console.log("vote pressed")} uppercase={false} icon={"add"}>
                           Votar
                        </Button>
                     </View>
                     {
                        votingOption.votersAmmount > 0 &&
                           <View style={styles.rowContainer}>
                              <Text style={styles.votesAmmountText}>
                                 {votingOption.votersAmmount} {" "}
                                 {
                                    votingOption.votersAmmount > 1 ?
                                       "votos" 
                                    :
                                       "voto"
                                 }
                                 {":"}
                              </Text>
                              <Text style={styles.votersText}>
                                 {votingOption.votersNames.join(", ")}
                              </Text>
                           </View>
                     }
                  </SurfaceStyled>
               )
            }
         </>
      );
   }
}

const styles: Styles = StyleSheet.create({
   textLine1: {
      fontFamily: currentTheme.fonts.regular,
      fontSize: 15,
      marginBottom: 5,
   },
   textLine2: {
      fontFamily: currentTheme.fonts.light,
      fontSize: 12,
   },
   rowContainer: {
      flexDirection: "row",
      alignItems: "center",
   },
   resultBar: {
      flex: 1,
   },
   votesAmmountText: {
      fontFamily: currentTheme.fonts.regular,
      fontSize: 12,
      marginRight: 7,
   },
   votersText: {
      flex: 1,
      fontFamily: currentTheme.fonts.thin,
      fontSize: 12,
   },
});

export default withTheme(VotingPoll);
