import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { Text } from "react-native-paper";
import BasicScreenContainer from "../../common/BasicScreenContainer/BasicScreenContainer";
import EmptySpace from "../../common/EmptySpace/EmptySpace";
import TitleText from "../../common/TitleText/TitleText";
import AppBarHeader from "../../common/AppBarHeader/AppBarHeader";

const AboutPage: FC = () => {
   return (
      <>
         <AppBarHeader />
         <BasicScreenContainer style={styles.mainContainer}>
            <TitleText extraSize style={styles.title}>
               ¿De cuántas personas son las citas?
            </TitleText>
            <Text>
               El mínimo de personas necesario para que se genere una cita son 3 personas y 4 para
               grupos que sean 100% heterosexuales. El máximo es de 20. Las citas tradicionales de 2
               personas no son posibles en esta app.
            </Text>
            <EmptySpace height={15} />
            <Text>
               Tu primera cita grupal es probable que sea entre pocos usuarios, por ejemplo de 3
               personas o tal vez 6, pero las siguientes serán de más, ya que se necesita mas tiempo
               para que se den coincidencias mas numerosas.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Si solo me gusta un género, significa que en la cita grupal van a ser todxs de ese
               género?
            </TitleText>
            <Text>
               No. Para estar en una cita grupal te tienes que gustar con un mínimo de 2 de sus
               integrantes, no necesariamente con la totalidad, por lo que es muy probable que haya
               algunas personas en tus citas con quienes no te gustes, que pueden ser de cualquier
               género y sexualidad.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Se pueden generar citas desequilibradas? (Ej: 1 persona se gusta con 5 que no se
               gustan entre ellas)
            </TitleText>
            <Text>
               No. Un requisito para que se forme una cita grupal es que sean grupos mas o menos
               equilibrados. Esto también genera que en las citas 100% heterosexuales la cantidad de
               mujeres y hombres siempre va a ser mas o menos la misma.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Es fácil que se genere una cita grupal?
            </TitleText>
            <Text>
               Es igual o más fácil que se genere una cita en esta app que en las de monogamia (como
               Tinder y OKCupid). Esto es así por varios motivos que se suman, a continuación vamos
               a explicar 2:
            </Text>
            <EmptySpace height={15} />
            <Text>
               En las "citas de monogamia" unx pasa el tiempo con otra persona durante al menos
               muchas horas, por lo que la persona buscada debería reunir todas las características
               deseadas en una sola, ya que no va a haber otra. Esto hace escasear los likes en esas
               apps, en una cita grupal en cambio, nadie tiene que "tenerlo todo en uno", por lo que
               en esta app se tiende a ser mas flexible al dar likes y por eso también aumentan las
               posibilidades de una coincidencia grupal.
            </Text>
            <EmptySpace height={15} />
            <Text>
               Otro motivo es que no existe ninguna app de citas popular de monogamia que no este
               concebida para enriquecer a sus dueños frustrando a sus usuarios intencionalmente. Si
               los usuarios consiguen lo que quieren se van de la app, por lo que sus dueños hacen
               que la app no funcione de la mejor manera, generando mas necesidad de pagar funciones
               premium. Este fenómeno esta detallado en el libro "El algoritmo del amor" de "Judith
               Duportail", una investigación donde la autora muestra como acceder a las patentes de
               Tinder y difunde su información la cual revela cómo esta app funciona internamente,
               asi como otras de la misma empresa llamada "Match Group" como OkCupid.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Hay que pagar algo?
            </TitleText>
            <Text>
               Esta app es y será siempre gratis, sin fines comerciales y muy pronto de código
               abierto. Financiada con donaciones a voluntad, el único fin es hacer que iniciarse en
               el poliamor sea mas fácil en la práctica y ayudar a modificar la idea de que las
               citas son únicamente de a dos.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Quién hizo esta aplicación?
            </TitleText>
            <Text>
               La idea viene de un desarrollador de software argentino interesado en las formas de
               opresión que hay en nuestra sociedad y la historia de la sexualidad. Realizó el
               desarrollo de software, la ingeniería de software y el diseño gráfico, pero las
               diferentes partes y detalles que multiplican su calidad son ideas de varias personas
               interesadas en el proyecto, gente perteneciente a organizaciones de poliamor, amor
               libre, feminismo, profesionales de diferentes disciplinas: desde ciencias sociales
               hasta otrxs ingenieros de software.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Tienen sentido las citas grupales?
            </TitleText>
            <Text>
               El afecto puede tomar cualquier forma, pero si hablamos de sexualidad, el sexo grupal
               es a menudo una experiencia sorprendente-mente cómoda y fluida, se siente normal a
               pesar de que no lo sea en nuestra cultura. Sin embargo esta muy presente en la
               historia de la sexualidad y en nuestro cuerpo, por ejemplo: Los "gemidos sexuales"
               son un instinto que las otras especies que también lo tienen (primates) lo usan para
               llamar a los que están cerca, de la misma manera funcionaba originalmente en nuestra
               especie, la sexualidad que podemos experimentar en nuestra cultura esta muy alejada
               del tipo de sexualidad que nos pide nuestro cuerpo y su evolución. Hay grandes libros
               de divulgación científica sobre el tema para recomendar, algunos muy conocidos como
               los de Christopher Ryan en primer lugar o también el de Friedrich Engels: "El origen
               de la familia, la propiedad privada y el estado".
            </Text>
            <EmptySpace height={15} />
            <Text>
               Cuando se instala la monogamia en nuestra cultura, no sucede por que esta tenga mas
               sentido, alguna ventaja emocional, ni por ser mas profunda o duradera en las
               relaciones afectivas o sexuales ya que no lo es, aparece por necesidades comerciales:
               casar hijxs como contrato comercial entre familias, acumular riqueza de forma
               personal sin compartir con la tribu, etc. La monogamia y la familia nuclear son dos
               de los muchos fenómenos de la revolución neolítica, la misma que trajo por primera
               vez a las clases sociales, patriarcado y otras opresiones de la humanidad.
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
      marginBottom: 25,
      marginTop: 25
   }
});

export default AboutPage;
