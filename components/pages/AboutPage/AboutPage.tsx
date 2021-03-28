import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { Text } from "react-native-paper";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import EmptySpace from "../../common/EmptySpace/EmptySpace";
import TitleText from "../../common/TitleText/TitleText";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import { currentTheme } from "../../../config";
import { useGoBackExtended } from "../../../common-tools/navigation/useGoBackExtended";

const AboutPage: FC = () => {
   const { goBack } = useGoBackExtended({
      whenBackNotAvailable: { goToRoute: "Main" }
   });

   return (
      <>
         <AppBarHeader onBackPress={goBack} />
         <BasicScreenContainer style={styles.mainContainer}>
            <TitleText extraSize style={styles.title}>
               ¿De cuántas personas son las citas grupales de la app?
            </TitleText>
            <Text style={styles.text}>
               El mínimo de personas necesario son 3, el máximo es de 20.
            </Text>
            <EmptySpace height={15} />
            <Text style={styles.text}>
               Las citas tradicionales de 2 personas no son posibles en esta app ya que es solo de
               poliamor grupal. El poliamor de multiples parejas y la monogamia tienen sus
               respectivas apps.
            </Text>
            <EmptySpace height={15} />
            <Text style={styles.text}>
               Con el paso del tiempo las citas van siendo de mas personas ya que se necesita tiempo
               dando likes para generar mas coincidencias.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Es fácil que se genere una cita grupal?
            </TitleText>
            <Text style={styles.text}>
               Si, matemáticamente es igual de fácil que en las apps tradicionales. Quienes reciben
               un resultado instantáneo en esas apps aquí aveces necesitarán paciencia ya que muchos
               likes recibidos no siempre se traducen en un resultado de coincidencia grupal.
            </Text>
            <EmptySpace height={15} />
            <Text style={styles.text}>
               Que las citas sean grupales ayuda: en la lógica de conocerse en pareja te ves con una
               sola persona por lo que tiene que "tener todo lo posible en uno" pero en las citas de
               poliamor grupal hay otra lógica donde se puede generar más likes y coincidencias.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Se pueden generar citas desequilibradas? Ej: 1 persona se gusta con 5 que no se
               gustan entre ellas
            </TitleText>
            <Text style={styles.text}>
               No. Solo se generan grupos más o menos equilibrados. Esto también genera que en las
               citas 100% heterosexuales la cantidad de mujeres y hombres siempre va a ser mas o
               menos la misma.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿En la cita grupal van a ser todxs del género que me gusta?
            </TitleText>
            <Text style={styles.text}>
               No. Para estar en una cita grupal te tienes que gustar con un mínimo porcentaje de
               sus integrantes y no necesariamente con la totalidad, es probable que haya personas
               en tus citas que pueden ser de cualquier género y sexualidad.
            </Text>
            <TitleText extraSize style={styles.title}>
               Breve historia del poliamor grupal
            </TitleText>
            <Text style={styles.text}>
               El poliamor grupal es la manera original en la que todxs nos relacionábamos en el
               pasado. En la prehistoria del humano inteligente los padres de lxs hijxs eran todas
               las personas de una comunidad, compartían la crianza y los recursos de forma
               igualitaria, potenciado por el sexo que solía ser grupal y muy abundante. Este pasado
               nos acompañó durante toda nuestra evolución por lo que se puede ignorar pero no
               eliminar, un ejemplo representativo: Los "gemidos sexuales" son un instinto que en
               las otras especies (primates) tiene el efecto de llamar a lxs que están cerca.
            </Text>
            <EmptySpace height={15} />
            <Text style={styles.text}>
               Las parejas como única forma posible de relación y con ella la familia nuclear
               aparecen durante la costosa revolución neolítica, la que trajo por primera vez muchas
               problemáticas como las diferencias de clase, patriarcado, explotación, avance contra
               la ecología, etc. Problemas que se van abordando a medida que se genera conciencia.
            </Text>
            <EmptySpace height={15} />
            <Text style={styles.text}>
               Hay grandes libros de divulgación sobre el tema respaldados por la comunidad
               científica, algunos muy conocidos como los de Cacilda Jethá y Christopher Ryan en
               primer lugar o de Friedrich Engels: "El origen de la familia, la propiedad privada y
               el estado"
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Es anti natural conocer gente en una app?
            </TitleText>
            <Text style={styles.text}>
               Probablemente si, pero sirve como una herramienta más en nuestra forma de vida
               moderna que no le queda mucho de natural u original.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Hay que pagar algo?
            </TitleText>
            <Text style={styles.text}>
               No, esta app es y será siempre gratis, sin fines comerciales, de código abierto y
               financiada con donaciones a voluntad.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Quienes hicieron esta app?
            </TitleText>
            <Text style={styles.text}>
               La idea viene de un informático argentino quién también escribió el software, pero
               los múltiples detalles que multiplican su calidad son ideas de varias personas
               interesadas en el proyecto, personas pertenecientes a organizaciones de poliamor,
               amor libre, feminismo, profesionales de diferentes disciplinas: desde ciencias
               sociales hasta otrxs informáticxs.
            </Text>
            <EmptySpace height={80} />
         </BasicScreenContainer>
      </>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      paddingLeft: 18,
      paddingRight: 18
   },
   title: {
      fontFamily: currentTheme.font.extraLight,
      fontSize: 24,
      lineHeight: 28,
      marginBottom: 25,
      marginTop: 25
   },
   text: {
      fontSize: 16,
      lineHeight: 21
   }
});

export default AboutPage;
