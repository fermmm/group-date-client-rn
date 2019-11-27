import React, { Component } from "react";
import { StyleSheet, View, Image, Linking } from "react-native";
import { withTheme, Card, Title, Paragraph, Button } from "react-native-paper";
import { Themed, ThemeExt } from "../../../common-tools/themes/types/Themed";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import TitleText from "../../common/TitleText/TitleText";
import TitleSmallText from "../../common/TitleSmallText/TitleSmallText";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { fakeTestingEvents } from "../../../server-api/tools/debug-tools/fakeTestingEvents";
import { withNavigation, NavigationScreenProp, NavigationInjectedProps } from "react-navigation";

export interface EventsPageProps extends Themed, NavigationInjectedProps { }
export interface EventsPageState { }

class EventsPage extends Component<EventsPageProps, EventsPageState> {

   render(): JSX.Element {
      const { colors }: ThemeExt = this.props.theme as unknown as ThemeExt;
      const { navigate }: NavigationScreenProp<{}> = this.props.navigation;
      
      return (
         <BasicScreenContainer>
            <View style={styles.topContainer}>
               <TitleText extraMarginLeft extraSize>
                  Eventos
               </TitleText>
               <TitleSmallText style={styles.titleSmall}>
                  Eventos organizados por agrupaciones de poliamor cercanas a tu zona
               </TitleSmallText>
               <Button
                  onPress={
                     () => navigate("Chat", {
                        contactChat: true, 
                        introDialogText: "Envianos en este chat el link a tu evento de Facebook o página de Facebook que publica eventos."
                     })
                  } 
                  style={styles.addButton}
               >
                  Agregar mis eventos
               </Button>
            </View>
            {
               fakeTestingEvents.map((event, i) =>
                  <Card style={styles.card} key={i}>
                     <Image
                        source={{ uri: event.imageLink }}
                        style={{ width: "100%", height: 200, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
                     />
                     <Card.Content style={styles.cardContent}>
                        <Title>{event.title}</Title>
                        <View style={styles.entryContainer}>
                           <Icon name={"calendar-star"} size={18} style={styles.entryIcon} />
                           <Paragraph>
                              {event.time}
                           </Paragraph>
                        </View>
                        <View style={styles.entryContainer}>
                           <Icon name={"map-marker"} size={18} style={styles.entryIcon} />
                           <Paragraph>
                              {event.address}
                           </Paragraph>
                        </View>
                        <Paragraph>
                           {event.description}
                        </Paragraph>
                     </Card.Content>
                     <Card.Actions style={styles.cardButtons}>
                        <Button onPress={() => Linking.openURL(event.link)}>
                           Ver más información
                        </Button>
                        <Button onPress={() => console.log("Pressed")}>
                           Recibir notificaciónes del evento
                        </Button>
                     </Card.Actions>
                  </Card>
               )
            }
         </BasicScreenContainer>
      );
   }
}

const styles: Styles = StyleSheet.create({
   topContainer: {
      marginBottom: 10
   },
   addButton: {
      width: 230
   },
   card: {
      borderRadius: 16,
      marginBottom: 30
   },
   cardContent: {
      
   },
   entryContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingRight: 30,
      marginBottom: 10
   },
   entryIcon: {
      marginRight: 10
   },
   cardButtons: {
      flexDirection: "column"
   },
});

export default withNavigation(withTheme(EventsPage));