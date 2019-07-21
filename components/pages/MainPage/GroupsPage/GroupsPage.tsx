import React, { Component } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { withTheme, List } from "react-native-paper";
import { Themed, ThemeExt } from "../../../../common-tools/ts-tools/Themed";
import GraphSvg from "../../../../assets/GraphSvg";

export interface GroupsPageProps extends Themed {}
export interface GroupsPageState {}

class GroupsPage extends Component<GroupsPageProps, GroupsPageState> {
    
    render(): JSX.Element {
        const { colors }: ThemeExt = this.props.theme;

        return (
                <View style={[styles.scene, { backgroundColor: colors.background2 }]} >
                    <ScrollView>       
                        <List.Section>
                            <List.Subheader>Citas confirmadas</List.Subheader>
                            <List.Item
                                title="maria, raul, julia, tincho, mili, ayelen, romina, chen"
                                description="Cita dentro de 2 días"
                                left={props => <List.Icon {...props} icon={({ color: c }) => <GraphSvg color={c} style={styles.logo} />} />}
                                onPress={() => console.log("hola")}
                            />
                            <List.Item
                                title="ofelia26, malum, clau, matias, rocio, alberto, cristina"
                                description="Cita dentro de 3 semanas"
                                left={props => <List.Icon {...props} icon={({ color: c }) => <GraphSvg color={c} style={styles.logo} />} />}
                                onPress={() => console.log("hola")}
                            />
                        </List.Section>
                        <List.Section>
                            <List.Subheader>Se necesita tu voto</List.Subheader>     
                            <List.Item
                                title="paola6556, gerardo, juliana, lauta, diego, barbie, ana"
                                description="¡Se necesita tu voto.! | Votaron: 12 / 20"
                                left={props => <List.Icon {...props} icon={({ color: c }) => <GraphSvg color={c} style={styles.logo} />} />}
                                onPress={() => console.log("hola")}
                            /> 
                        </List.Section>
                        <List.Section>
                            <List.Subheader>Propuestas no vistas</List.Subheader>
                            <List.Item
                                title="matias666, paoli, toti, anibal, maria, fabian, lucia, raul"
                                description="¡Nueva propuesta de lugar no vista! | Votaron: 8 / 10"
                                left={props => <List.Icon {...props} icon={({ color: c }) => <GraphSvg color={c} style={styles.logo} />} />}
                                onPress={() => console.log("hola")}
                            />
                        </List.Section>
                        <List.Section>
                            <List.Subheader>Los demas grupos</List.Subheader>
                            <List.Item
                                title="amanda, nicolas, rocio, hector, cristian, ivana, florencia"
                                description="Votaron: 3 / 6"
                                left={props => <List.Icon {...props} icon={({ color: c }) => <GraphSvg color={c} style={styles.logo} />} />}
                                onPress={() => console.log("hola")}
                            />
                            <List.Item
                                title="paola6556, gerardo, juliana, lauta, diego, barbie, ana"
                                description="Votaron: 12 / 20"
                                left={props => <List.Icon {...props} icon={({ color: c }) => <GraphSvg color={c} style={styles.logo} />} />}
                                onPress={() => console.log("hola")}
                            />
                        </List.Section>
                    </ScrollView>
                </View>
        );
    }
}

const styles: Styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
});

export default withTheme(GroupsPage);
