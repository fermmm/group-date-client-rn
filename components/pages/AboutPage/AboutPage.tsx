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
               Tu primera cita grupal es probable que tenga un tamaño de 3 a 6 personas, es probable
               que las siguientes sean de más, con el tiempo se va generando la cantidad de
               coincidencias necesaria para grupos mas grandes.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Es fácil que se genere una cita grupal?
            </TitleText>
            <Text style={styles.text}>
               Si, matemáticamente es igual de fácil que se generen citas en esta app en comparación
               con las tradicionales, quienes están acostumbradxs a tener de inmediato muchos
               "matches" en esas apps, aquí van a tener que ser mas pacientes y seguir intentando ya
               que no es tan importante recibir muchos likes si no que se de una coincidencia
               grupal.
            </Text>
            <EmptySpace height={15} />
            <Text style={styles.text}>
               Algo que ayuda es que en la lógica de la monogamia te ves con una sola persona por lo
               que esta tiene que "tenerlo todo" pero en las citas de esta app hay multiples
               personas por lo que se puede evaluar perfiles con una mentalidad más relajada y
               abierta, generando más likes y coincidencias.
            </Text>
            <EmptySpace height={15} />
            <TitleText extraSize style={styles.title}>
               ¿Permite la app una cita tradicional de 2 personas?
            </TitleText>
            <Text style={styles.text}>
               No, esta app esta pensada para citas de poliamor grupal y no de poliamor de parejas,
               existen aplicaciones conocidas que puedes descargar para ese tipo de citas.
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
               ¿Si solo me gusta un género, significa que en la cita grupal van a ser todxs de ese
               género?
            </TitleText>
            <Text style={styles.text}>
               No. Para estar en una cita grupal te tienes que gustar con un mínimo de 2 de sus
               integrantes, no necesariamente con la totalidad, es probable que haya personas en tus
               citas que pueden ser de cualquier género y sexualidad.
            </Text>
            <TitleText extraSize style={styles.title}>
               Datos interesantes sobre la importancia del poliamor grupal
            </TitleText>
            <Text style={styles.text}>
               El poliamor grupal es la manera original en la que se relacionaba el ser humano y
               define el modelo de familia. Hasta hace 9.000 años los padres de lxs hijxs eran todas
               las personas de un grupo afectivo, se compartía el cuidado y la comida de forma
               igualitaria entre todxs, potenciado por el sexo que solía ser grupal, muy abundante y
               probablemente más divertido. Este pasado de poliamor grupal lo tenemos todxs presente
               en la sexualidad biológica de nuestro cuerpo, por ejemplo: Los "gemidos sexuales" son
               un instinto que en las otras especies que lo tienen (primates) tiene el efecto de
               llamar a lxs que están cerca.
            </Text>
            <EmptySpace height={15} />
            <Text style={styles.text}>
               Hay grandes libros de divulgación científica sobre el tema para recomendar, algunos
               conocidos y respaldados por la comunidad científica como los de Cacilda Jethá y
               Christopher Ryan en primer lugar y "El origen de la familia, la propiedad privada y
               el estado" de Friedrich Engels.
            </Text>
            <EmptySpace height={15} />
            <Text style={styles.text}>
               La monogamia, con ella las parejas como única forma posible de relación y la familia
               nuclear son algunos de los muchos fenómenos culturales provenientes de la revolución
               neolítica, una revolución costosa que trajo al patriarcado, las diferencias de clase,
               explotación, avance contra la ecología, etc. Problemáticas que se van revirtiendo
               lentamente a medida que las vamos cuestionando.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Es anti natural conocer gente en una app?
            </TitleText>
            <Text style={styles.text}>
               Probablemente si, pero sirven como una herramienta más dentro de nuestra cultura y
               forma de vida que no le queda mucho de natural u original. En particular esta app
               puede ser muy útil al menos para poder tomarse vacaciones de nuestra cultura y
               aprender algo nuevo.
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
