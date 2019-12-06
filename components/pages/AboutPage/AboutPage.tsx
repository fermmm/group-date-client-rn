import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { withTheme, Text } from "react-native-paper";
import { Themed } from "../../../common-tools/themes/types/Themed";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import EmptySpace from "../../common/EmptySpace/EmptySpace";
import TitleText from "../../common/TitleText/TitleText";
import { withNavigation, NavigationInjectedProps } from "react-navigation";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";

export interface AboutPageProps extends Themed, NavigationInjectedProps { }

class AboutPage extends Component<AboutPageProps> {
   render(): JSX.Element {      
      return (
         <>
            <AppBarHeader title={"Sobre la app y más"}/>
            <BasicScreenContainer style={styles.mainContainer}>
               <TitleText extraSize style={styles.title}>
                  ¿Ésta aplicación es gratis?
               </TitleText>
               <Text>
                  Es y será siempre gratis, sin fines comerciales. El único fin es ayudar a deconstruir la idea de que
                  las citas son únicamente de a dos. ¿No te suena a mononorma eso?
               </Text>
               <TitleText extraSize style={styles.title}>
                  Cómo logramos hacer la aplicación sin pagar nada
               </TitleText>
               <Text>
                  La idea surje de un programador de aplicaciones argentino, interesado en la antropología y el
                  amor libre. Que sea la iniciativa de un programador permitió que nadie tenga que
                  poner las grandes cantidades de dinero que cobran los programadores
                  para hacer una aplicación como ésta, por lo tanto no hizo falta un negocio ni un
                  interés de ganar dinero. Mas adelante cuando tengamos una cantidad de usuarios
                  que implique un costo monetario importante, seguramente vamos a pedirles donaciones a
                  voluntad para sostener el costo de los servidores.
               </Text>
               <TitleText extraSize style={styles.title}>
                  Cómo se construyó en detalle la aplicación
               </TitleText>
               <Text>
                  Los detalles de la aplicación son el producto de ideas de varias personas interesadas en el proyecto,
                  gente perteneciente a organizaciones de amor libre y poliamor en Argentina y otros profesionales
                  de diferentes disciplinas.
               </Text>
               <TitleText extraSize style={styles.title}>
                  Cómo surgió la idea
               </TitleText>
               <Text>
                  Es muy facil que surja la idea de esta herramienta después de haber leido sobre como se relacionaba
                  el ser humano antes de ser monógamo. Para saber eso tenemos la antropología, sus descubrimientos nos
                  transportan a la época anterior al uso de la agricultura:
               </Text>
               <EmptySpace height={15} />
               <Text> 
                  De esa época para atrás el ser humano vivia en tribus sexoafectivas donde se compartía la comida, 
                  la crianza de los hijos y el sexo. Los padres de los hijos eran todos. El sexo era variado y/o grupal,
                  la comida se obtenía principalmente de forma autosuficiente, no dependíamos de lo que pase con sistemas
                  políticos y económicos para poder vivir.
               </Text> 
               <EmptySpace height={15} />
               <Text> 
                  Asi vivimos siempre, incluso desde que éramos simios, igual que nuestros primos los Chimpances y los Bonobos. Cuando evolucionamos 
                  hacia nuestra inteligencia actuál continuamos así durante más del 92% de nuestra historia. La historia 
                  de las civilizaciones y los imperios que todos conocemos es solo el último 8% (aprox.) de los 350.000 años de 
                  historia del ser humano inteligente.
               </Text>
               <EmptySpace height={15} /> 
               <Text> 
                  Que hayamos evolucionado de esta forma significa que nuestro cuerpo nos va a pedir una sexualidad acorde, por ejemplo cuando 
                  vemos porno: No vemos siempre a una persona preferida si no que buscamos contenido nuevo con personas nuevas, 
                  esto muestra que nuestro deseo sexual pide variedad. Los gemidos aparecen en nuestro instinto para llamar a los
                  que estan cerca a que se unan a nuestra experiencia sexual y se convierta en una experiencia grupal (por diferentes
                  motivos). El pene es un instrumento con una forma específica para succionar alejando del útero el cemen de un competidor
                  que estuvo ahí poco tiempo antes, nada muy monógamo.
               </Text>
               <EmptySpace height={15} />
               <Text> 
                  Pensando en éstos y mas datos comprobables sobre nuestra
                  sexualidad original, es bastate facil que surja la idea de crear esta o cualquier otra herramienta que nos ayude
                  a poder elegir una sexualidad de acuerdo a nuestro instinto y no de acuerdo a nuestra cultura. En nuestra cultura cuando se impone
                  la monogamia, no sucede por que esta tenga alguna ventaja emocional en las relaciones afectivas o sexuales, se impone por cuestiones 
                  comerciales de herencias y por la abolición de lo colectivo en favor de la propiedad privada.
               </Text>
               <EmptySpace height={15} />
               <Text>
                  Si te interesan estos datos son recomendables libros como "Sex at dawn" (En español: "En el principio era el sexo") o
                  "El origen de la familia, la propiedad privada y el estado" libro firmado por Engels pero escrito por ambos, Marx y Engels.
                  También son recomendables muchas otras lecturas sobre antropología en general, específicamente sobre la vida antes de la agricultura.
               </Text>
               <EmptySpace height={80} />
            </BasicScreenContainer>
         </>
      );
   }
}

const styles: Styles = StyleSheet.create({
   mainContainer: {
      paddingLeft: 18, 
      paddingRight: 18,
   },
   title: {
      marginBottom: 25,
      marginTop: 25
   },
});

export default withNavigation(withTheme(AboutPage));
