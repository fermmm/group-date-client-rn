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
               ¿De cuántas personas son las citas grupales?
            </TitleText>
            <Text style={styles.text}>
               El mínimo de personas necesario son 3, el máximo es de 20.
            </Text>
            <EmptySpace height={15} />
            <Text style={styles.text}>
               Con suficiente tiempo y coincidencias las citas irán aumentando en cantidad de
               personas.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Por qué directo a lo grupal y no de a poco primero en pareja buscando trío?
            </TitleText>
            <Text style={styles.text}>
               El concepto de pareja suele traer jerarquías, pensamos que detectar y evitar
               jerarquías conduce a lo bello y divertido de la vida.
            </Text>
            <EmptySpace height={15} />
            <Text style={styles.text}>
               Concretamente una pareja donde se conocen y se entienden hace tiempo, luego cuando
               quieren agregar una tercera persona le están proponiendo una jerarquía de forma
               inevitable, es raro que aparezca esa tercera persona que quiere algo así, por eso se
               les dice unicornio.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Se pueden generar citas desequilibradas? Ej: 1 persona se gusta con 5 que no se
               gustan entre ellas
            </TitleText>
            <Text style={styles.text}>
               No. Solo se generan grupos más o menos equilibrados, por ejemplo cuando se da un
               grupo de 100% heterosexuales la cantidad de mujeres y hombres siempre va a ser mas o
               menos la misma. Se debe a que no queremos promover jerarquías (mas info en la
               pregunta anterior).
            </Text>
            {/* This part is suspended until is required */}
            {/* <TitleText extraSize style={styles.title}>
               Sobre el comportamiento
            </TitleText>
            <Text style={styles.text}>
               Tenemos los mismos sistemas que las otras apps para denunciar. También puede ser de
               ayuda el funcionamiento de la app ya que genera citas equilibradas (mas info en la
               pregunta anterior).
            </Text>
            <EmptySpace height={15} />
            <Text style={styles.text}>
               Por último les compartimos una opinión personal nuestra:{" "}
            </Text>
            <Text style={styles.text}>
               Pensamos que las personas irrespetuosas prefieren apps de parejas y no esta, les
               interesan formas de relación donde pueden ejercer jerarquía fácilmente como en las
               parejas, multiples parejas o agregando una persona a su pareja, esta app solo fomenta
               citas grupales no-jerárquicas, más info en la pregunta anterior.
            </Text> */}
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
            <Text style={styles.text}>
               Si, matemáticamente es igual de fácil que en las apps tradicionales.
            </Text>
            <EmptySpace height={15} />
            <Text style={styles.text}>
               La no-monogamia ayuda: en las citas tradicionales te ves con una sola persona por lo
               que tiene que tener todo lo que buscas, en cambio sin monogamia te ves con multiples
               personas en una lógica diferente que genera más likes y coincidencias en la app.
            </Text>
            <TitleText extraSize style={styles.title}>
               Breve historia del poliamor (no-monogamia)
            </TitleText>
            <AnalyticsTrackWhenVisible
               onLogShouldSend={logPolyHistory}
               maxSecondsToRegister={60}
               secondPeriods={6}
            >
               <Text style={styles.text}>
                  En la prehistoria del humano inteligente los padres de lxs hijxs eran todas las
                  personas de una comunidad, compartían la crianza y el alimento de forma
                  igualitaria, potenciado por el sexo que era mucho más abundante, público y
                  generalmente grupal. Este pasado se puede ignorar pero existió durante toda
                  nuestra evolución por lo que no se va a ir de nuestro cuerpo, un ejemplo
                  representativo: Los "gemidos sexuales" son un instinto que en las otras especies
                  (primates) cumple la función de llamar a lxs que están cerca.
               </Text>
            </AnalyticsTrackWhenVisible>
            <EmptySpace height={15} />
            <Text style={styles.text}>
               Durante el neolítico aparecen tecnologías que hacen posible la riqueza y el comercio,
               los padres inculcan ideas monógamas para casar a sus hijos por motivos comerciales y
               la familia pequeña favorece la acumulación personal, poniendo en un lugar hegemónico
               a las ideas de la monogamia y familia nuclear.
            </Text>
            <EmptySpace height={15} />
            <Text style={styles.text}>
               Hay mucha ciencia dedicada al tema, en libros como los de Cacilda Jethá y Christopher
               Ryan, diversas autoras feministas o Marx y Engels: "El origen de la familia, la
               propiedad privada y el estado".
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Hay que pagar algo?
            </TitleText>
            <Text style={styles.text}>
               No, esta app es y será siempre gratis, sin fines comerciales y financiada con
               donaciones a voluntad.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Quienes hicieron esta app?
            </TitleText>
            <Text style={styles.text}>
               La idea inicial viene de un informático de Argentina quién también escribió el
               software, pero luego se agregaron múltiples detalles que multiplicaron su calidad y
               son colaboraciones de muchas personas interesadas en el proyecto pertenecientes a
               organizaciones de poliamor, amor libre, feminismo, profesionales de diferentes
               disciplinas: desde ciencias sociales hasta otrxs informáticxs.
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
