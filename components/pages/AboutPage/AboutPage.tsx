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
               personas no son posibles en esta app. Tu primera cita grupal es probable que sea
               entre pocos usuarios y las siguientes con más, ya que se necesita mas tiempo para que
               se den coincidencias mas numerosas.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Si solo me gusta un género, significa que en la cita grupal van a ser todxs de ese
               género?
            </TitleText>
            <Text>
               No. Para estar en una cita grupal te tienes que gustar con un mínimo de 2 de sus
               integrantes y no necesariamente con la totalidad, asi que es muy probable que haya
               algunas personas en tus citas con quienes no te gustes, que pueden ser de cualquier
               género y sexualidad.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Se pueden generar citas desequilibradas? (Ej: 1 persona se gusta con 5 que no se
               gustan entre ellxs)
            </TitleText>
            <Text>
               No. Un requisito para que se forme una cita grupal es que sean grupos mas o menos
               equilibrados. Esto lleva a que por ejemplo en un grupo 100% heterosexual la cantidad
               de mujeres y hombres siempre va a ser mas o menos la misma.
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
               En las "citas de monogamia" uno puede pasar varias horas con una única persona por lo
               que esta tiene que tener una buena cantidad de características o coincidencias
               buscadas, esto hace escasear los likes, en cambio en una cita grupal nadie tiene que
               "tenerlo todo", por lo que en esta app se tiende a ser mas flexible al dar likes y
               por eso también aumentan las posibilidades de una coincidencia grupal.
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
               ¿No es demasiado rara esta aplicación?
            </TitleText>
            <Text>
               Relacionarnos como en pareja pero en grupo es a menudo una experiencia
               sorprendente-mente fluida y cómoda, muy presente en la historia de la sexualidad. Hay
               grandes libros de divulgación científica sobre el tema para recomendar como los de
               "Christopher Ryan" en primer lugar o algunos de "Friedrich Engels" como "El origen de
               la familia, la propiedad privada y el estado". Aquí vamos con un resumen histórico
               que puede resultarles interesante y util para saber más sobre sexualidad y comprender
               lo interesante de este tipo de proyectos:
            </Text>
            <EmptySpace height={15} />
            <Text>
               El ser humano primitivo inteligente (el cazador recolector) vivía en tribus donde se
               compartía la comida, la crianza de lxs hijxs y el sexo. Lxs padres de lxs hijxs eran
               todxs, el sexo y el afecto eran de tipo no monógamo y/o grupal, la comida todxs
               sabían obtenerla, por lo que no se recurría a nadie en particular para sobrevivir si
               no a toda la tribu, debido a esto último no podían producirse estructuras de poder
               verticales y violentas como las de hoy en día: patriarcado, explotación, etc.
            </Text>
            <EmptySpace height={15} />
            <Text>
               Más para atrás en la historia, durante nuestra evolución tuvimos esta misma forma de
               vida. Esto es importante por que la sexualidad de cada persona esta influenciada en
               gran medida por su cuerpo y su cuerpo por la evolución. Nuestra cultura nos impone
               una "sexualidad cultural" pero también tenemos una "sexualidad física". Por ejemplo:
               El porno, extremadamente popular, donde se busca siempre contenido nuevo con personas
               nuevas, donde muchas personas a la vez participando en una misma escena es algo
               normal, donde nadie elige ver a una persona preferida y abandonar por años el resto
               del contenido, muestra que cuando somos libres de elegir y nadie nos ve, preferimos
               nuestra sexualidad física. Los "gemidos sexuales" aparecen en nuestro instinto para
               llamar a los que están cerca a que se unan a la experiencia y se convierta en una
               experiencia grupal, este instinto y sus efectos fueron observados en varias especies
               ademas del humano, es otro ejemplo de la sexualidad física.
            </Text>
            <EmptySpace height={15} />
            <Text>
               Cuando se instala la monogamia, no sucede por que esta tenga alguna ventaja emocional
               o por ser mas profunda en las relaciones afectivas o sexuales, al contrario, sucede
               por cuestiones comerciales: casar hijxs como contrato comercial entre padres,
               acumular riqueza de forma personal sin compartir con la tribu, etc. La monogamia es
               uno de los muchos fenómenos de la revolución neolítica, la que trajo la imagen del
               ser humano primitivo que era violento y patriarcal, la imagen más difundida pero la
               que menos tiempo ocupa en nuestra historia y evolución.
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
