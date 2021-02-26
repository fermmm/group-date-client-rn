import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { Text } from "react-native-paper";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import EmptySpace from "../../common/EmptySpace/EmptySpace";
import TitleText from "../../common/TitleText/TitleText";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";
import { currentTheme } from "../../../config";

const AboutPage: FC = () => {
   return (
      <>
         <AppBarHeader />
         <BasicScreenContainer style={styles.mainContainer}>
            <TitleText extraSize style={styles.title}>
               ¿De cuántas personas son las citas grupales de la app?
            </TitleText>
            <Text style={styles.text}>
               El mínimo de personas necesario son 3, el máximo es de 20.
            </Text>
            <EmptySpace height={15} />
            <Text style={styles.text}>
               Las citas tradicionales de 2 personas no son posibles en esta app.
            </Text>
            <EmptySpace height={15} />
            <Text style={styles.text}>
               Tu primera cita grupal es probable que sea pequeña, por ejemplo de 3 personas o tal
               vez 6, es probable que las siguientes sean de más, ya que se necesita tiempo para que
               se den coincidencias más numerosas.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Es fácil que se genere una cita grupal?
            </TitleText>
            <Text style={styles.text}>
               Si, es igual de fácil que se generen citas en esta app en comparación con las
               tradicionales, pero quienes están acostumbradxs a tener de inmediato muchos "matches"
               en esas apps, aquí van a tener que ser mas pacientes y seguir intentando ya que no es
               tan importante recibir muchos likes si no que se de una coincidencia grupal.
            </Text>
            <EmptySpace height={15} />
            <Text style={styles.text}>
               Algo que ayuda es que en la lógica de la monogamia te ves con una sola persona por lo
               que esta tiene que "tenerlo todo" pero en las citas de esta app hay multiples
               personas por lo que se puede evaluar perfiles con una mentalidad más relajada y
               abierta, generando más likes y coincidencias.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Se pueden generar citas desequilibradas? (Ej: 1 persona se gusta con 5 que no se
               gustan entre ellas)
            </TitleText>
            <Text style={styles.text}>
               No. Solo se generan grupos más o menos equilibrados. Esto también genera que en las
               citas 100% heterosexuales la cantidad de mujeres y hombres siempre va a ser mas o
               menos la misma.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Si solo me gusta un género, significa que en la cita grupal van a ser todxs de ese
               género?
            </TitleText>
            <Text style={styles.text}>
               No. Para estar en una cita grupal te tienes que gustar con un mínimo de 2 de sus
               integrantes, no necesariamente con la totalidad, es probable que haya personas en tus
               citas que pueden ser de cualquier género y sexualidad.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Hay diferencias importantes entre las relaciones grupales y las tradicionales de 2
               personas?
            </TitleText>
            <Text style={styles.text}>
               Si, las relaciones afectivas y sexuales entre varias personas son la manera original
               en la que se relacionaba el ser humano y definen el concepto de familia. Hasta hace
               10.000 años la crianza era una actividad poco exigente, los padres de lxs hijxs eran
               todas las personas de un grupo afectivo, se compartía el cuidado y los recursos de
               forma igualitaria como una gran familia, potenciado por el sexo que solía ser grupal
               y muy abundante. Este pasado poliamoroso lo tenemos todxs presente en la sexualidad
               biológica de nuestro cuerpo, por ejemplo: Los "gemidos sexuales" son un instinto que
               las otras especies que lo tienen (primates) lo usan para llamar a lxs que están
               cerca, de la misma manera funcionaba en nuestra especie.
            </Text>
            <EmptySpace height={15} />
            <Text style={styles.text}>
               La sexualidad que podemos experimentar en nuestra cultura esta muy reprimida,
               desconocida y alejada del tipo de sexualidad que nos pide nuestro cuerpo y su
               evolución, este es el trasfondo de muchos problemas que surgen hoy en día a la hora
               de mantenernos motivados sexualmente y conectar con nuevas personas, algo similar
               puede suceder hasta con el afecto. Hay grandes libros de divulgación científica sobre
               el tema para recomendar, algunos muy conocidos y comentados por la comunidad
               científica como los de Cacilda Jethá y Christopher Ryan en primer lugar o también el
               de Friedrich Engels: "El origen de la familia, la propiedad privada y el estado".
            </Text>
            <EmptySpace height={15} />
            <Text style={styles.text}>
               En el último 3% de la historia del humano inteligente aparece la monogamia debido a
               necesidades comerciales: casar hijxs como contrato comercial entre familias, acumular
               riqueza de forma individual, herencias, etc. La monogamia y la familia de hoy en día
               (nuclear) son dos de los muchos fenómenos sociales de la revolución neolítica, la
               misma que trajo por primera vez a las clases sociales, patriarcado, explotación y
               jerarquías culturales.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Hay que pagar algo?
            </TitleText>
            <Text style={styles.text}>
               Esta app es y será siempre gratis, sin fines comerciales y muy pronto de código
               abierto. Financiada con donaciones a voluntad, el único fin es ayudar para que
               iniciarse en el poliamor sea mas fácil en la práctica y difundir la idea de que las
               citas pueden ser de mas de dos personas.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Quienes hicieron esta aplicación?
            </TitleText>
            <Text style={styles.text}>
               La idea viene de un informático argentino quién también escribió el software de la
               app, pero las diferentes partes y detalles que multiplican su calidad son ideas de
               varias personas interesadas en el proyecto, personas pertenecientes a organizaciones
               de poliamor, amor libre, feminismo, profesionales de diferentes disciplinas: desde
               ciencias sociales hasta otrxs informáticxs.
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
