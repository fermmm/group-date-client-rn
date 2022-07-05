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
import AnalyticsTrackWhenVisible from "../../common/AnalyticsTrackWhenVisible/AnalyticsTrackWhenVisible";
import { logPolyHistory } from "../../../common-tools/analytics/aboutPage/logPolyHistory";

const AboutPage: FC = () => {
   const { goBack } = useGoBackExtended({
      whenBackNotAvailable: { goToRoute: "Main" }
   });

   return (
      <>
         <AppBarHeader onBackPress={goBack} />
         <BasicScreenContainer style={styles.mainContainer}>
            <TitleText extraSize style={styles.title}>
               ¿Cual es el máximo de personas en una cita?
            </TitleText>
            <Text style={styles.text}>
               El máximo es de 20 pero es casi imposible que se de la casualidad de un grupo tan
               grande
            </Text>
            <EmptySpace height={15} />
            <Text style={styles.text}>
               El tamaño de las citas depende de cuantas personas se gustan
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Por qué directo a lo grupal y no de a poco primero en pareja buscando trío?
            </TitleText>
            <Text style={styles.text}>
               No necesariamente lo más fácil es esa escalera. Pensamos que el concepto de pareja
               impide avanzar al siguiente paso.
            </Text>
            <EmptySpace height={15} />
            <Text style={styles.text}>
               Por ejemplo una pareja donde se conocen y se entienden hace tiempo van a tener más
               control en todo lo que suceda sobre esa tercera persona que se les suma, es una
               propuesta de trio pero también de jerarquía oculta. Es difícil encontrar a esa
               tercera persona y se les dice "unicornio".
            </Text>
            <EmptySpace height={15} />
            <Text style={styles.text}>
               El swinger tiene más éxito pero también es problemático por el concepto de pareja.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Se pueden generar citas desequilibradas? Ej: 1 persona se gusta con 5 que no se
               gustan entre ellas (estilo harem)
            </TitleText>
            <Text style={styles.text}>
               No. Solo se generan grupos más o menos equilibrados, por ejemplo cuando se da un
               grupo 100% heterosexual la cantidad de mujeres y hombres siempre va a ser mas o menos
               igual. Si no funcionara así habrían casos al azar de situaciones injustas o
               jerarquías no solicitadas.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿En la cita grupal van a ser todxs del género y sexualidad que me gusta?
            </TitleText>
            <Text style={styles.text}>
               Probablemente no. Te tienes que gustar con una cantidad mínima de sus integrantes y
               no necesariamente con la totalidad, es probable que haya personas en tus citas que
               pueden ser de cualquier género y sexualidad.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Es fácil que se genere una cita grupal?
            </TitleText>
            <Text style={styles.text}>Si, es igual de fácil que en las apps tradicionales.</Text>
            <EmptySpace height={15} />
            <Text style={styles.text}>
               También la no-monogamia ayuda: en las citas tradicionales vas a estar con una sola
               persona y por eso es importante que esa persona tenga todo lo que buscas, en cambio
               sin monogamia te ves con multiples personas y eso suele afectar el criterio para dar
               like.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿No es como "de otro mundo" esta propuesta?
            </TitleText>
            <Text style={styles.text}>
               Proponemos divertirnos y ya, pero para que no se considere como "de otro mundo"
               divulgamos un poco sobre su historia por si a alguien le interesa:
            </Text>
            <EmptySpace height={15} />
            <AnalyticsTrackWhenVisible
               onLogShouldSend={logPolyHistory}
               maxSecondsToRegister={60}
               secondPeriods={6}
            >
               <Text style={styles.text}>
                  Antes que aparezca la monogamia siempre vivimos en culturas donde los padres de
                  lxs hijxs eran todas las personas de una comunidad, compartían la crianza y
                  recursos de forma igualitaria, potenciado por el sexo que era mucho más abundante
                  con opciones grupales. Si bien esto quedó en la historia, no es algo que
                  desapareció realmente, por ejemplo: Los "gemidos sexuales" aparecen originalmente
                  para llamar a lxs que están cerca y todavía existen aunque las personas sean
                  monógamas.
               </Text>
            </AnalyticsTrackWhenVisible>
            <EmptySpace height={15} />
            <Text style={styles.text}>
               En el neolítico aparece la monogamia por que convenía para casar hijxs por motivos
               comerciales y la familia pequeña favorece la acumulación personal de la riqueza. Pero
               es durante la inquisición cuando queda la monogamia como la única opción luego de ser
               impuesta a la fuerza por la clase dominante debido a que la sexualidad grupal,
               familia grupal y otras formas de agrupación generaban vínculos entre personas que
               decantaban en cooperación e intercambio sin dinero, haciendo menos necesario el
               salario y menos necesario el trabajar para la clase dominante a cambio de ese
               salario.
            </Text>
            <EmptySpace height={15} />
            <Text style={styles.text}>
               Esta información se encuentra una y otra vez en muchos libros de historia como los de
               Cacilda Jethá y Christopher Ryan, diversas autoras feministas o el libro de Marx y
               Engels: "El origen de la familia, la propiedad privada y el estado".
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Hay que pagar algo?
            </TitleText>
            <Text style={styles.text}>
               No, esta app es y será siempre gratis, sin fines comerciales. Tal vez pidamos
               donaciones en algún momento.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Quienes hicieron este proyecto?
            </TitleText>
            <Text style={styles.text}>
               La idea y dirección es de un informático de Argentina, junto con el trabajo de otros
               informáticos que colaboran ig: @group.date. Ilustraciones por "Fiebre" ig:
               @fiebrediseno. Presencia en redes por "Amor Libre y Memes" ig: @amorlibreymemes
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿En base a que criterios me recomienda personas la app?
            </TitleText>
            <Text style={styles.text}>
               El algoritmo busca un grupo de usuarios activos al azar que te pusieron like y otro
               que aún no, luego combina ambos en una sola lista con orden al azar, luego pone en
               primer lugar a quienes tienen mas tags en común o tags bloqueados en común.
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
      lineHeight: 21,
      fontWeight: "300",
      fontFamily: null // This restores the system font, which is more legible for this cases where the user is reading big text blocks.
   }
});

export default AboutPage;
