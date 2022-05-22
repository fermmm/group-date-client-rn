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
               El máximo es de 20 pero es poco probable que se alcance ese número
            </Text>
            <EmptySpace height={15} />
            <Text style={styles.text}>
               El tamaño de las citas depende de cuantas personas se gustan
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Por qué directo a lo grupal y no de a poco primero en pareja buscando trío?
            </TitleText>
            <Text style={styles.text}>
               No necesariamente lo mas fácil es en esa "escalera". Pensamos que el concepto de
               pareja impide avanzar al siguiente "escalón".
            </Text>
            <EmptySpace height={15} />
            <Text style={styles.text}>
               Por ejemplo una pareja donde se conocen y se entienden hace tiempo van a tener más
               control sobre todo lo que suceda que esa tercera persona que se les suma. Esa
               propuesta no solo es de trio si no también de jerarquía, por eso es difícil que
               aparezca esa tercera persona y se les dice "unicornio".
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Se pueden generar citas desequilibradas? Ej: 1 persona se gusta con 5 que no se
               gustan entre ellas (estilo harem)
            </TitleText>
            <Text style={styles.text}>
               No. Solo se generan grupos más o menos equilibrados, por ejemplo cuando se da un
               grupo de 100% heterosexuales la cantidad de mujeres y hombres siempre va a ser mas o
               menos equilibrada. Se debe a que no queremos generar jerarquías o situaciones
               injustas.
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
                  representativo: Los "gemidos sexuales" son un instinto que en su origen cumplía la
                  función de llamar a lxs que están cerca.
               </Text>
            </AnalyticsTrackWhenVisible>
            <EmptySpace height={15} />
            <Text style={styles.text}>
               Luego durante el neolítico aparecen tecnologías que hacen posible la riqueza y el
               comercio, se inventa la monogamia para casar a hijos por motivos comerciales y la
               familia pequeña favorece la acumulación personal de la riqueza, poniendo en un lugar
               hegemónico a las ideas de la monogamia y familia nuclear.
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
               No, esta app es y será siempre gratis, sin fines comerciales. Todavía no pensamos
               como generar ingresos, probablemente sea por donaciones.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Quienes hicieron esta app?
            </TitleText>
            <Text style={styles.text}>
               La idea inicial viene de un informático de Argentina quién también escribió el
               software, pero luego se agregaron múltiples detalles que multiplican su calidad y son
               colaboraciones de otras personas interesadas en el proyecto.
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
