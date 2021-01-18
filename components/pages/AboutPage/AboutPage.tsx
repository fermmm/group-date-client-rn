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
               personas no son posibles en esta app. La primera coincidencia grupal es probable que
               sea entre pocos usuarios y las siguientes con más, ya que se necesita mas tiempo para
               que se den más coincidencias.
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
               de mujeres y varones siempre va a ser mas o menos la misma.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Es fácil que se genere una cita grupal?
            </TitleText>
            <Text>
               Es igual o más fácil que se genere una cita en esta app que en las de monogamia (como
               Tinder y OKCupid). Esto es así por varios motivos que se suman, a continuación vamos
               a mencionar 3:
            </Text>
            <EmptySpace height={15} />
            <Text>
               Uno de ellos es que en las apps de monogamia los usuarios que reciben una buena
               cantidad de likes dejan de usar la app, consiguen rápido lo que quieren y dejan su
               perfil visible pero inactivo. En esta app puedes recibir muchos likes pero eso no
               tiene por que hacer que conozcas gente más rápido que los demás por que tiene que
               haber una coincidencia grupal, por lo que no faltan usuarios activos evaluando
               perfiles hasta que se dan las coincidencias.
            </Text>
            <EmptySpace height={15} />
            <Text>
               Otro motivo es que en las "citas de monogamia" se pasa horas con una sola persona por
               lo que esta tiene que tener una buena cantidad de características deseadas por la
               persona, esto hace escasear los likes, en cambio en una cita grupal nadie tiene que
               "tenerlo todo", por lo que en esta app se tiende a ser mas flexible al dar likes y
               por eso también aumentan las posibilidades de una coincidencia grupal.
            </Text>
            <EmptySpace height={15} />
            <Text>
               Otro motivo es que no existe ninguna app de citas de monogamia que no este concebida
               para enriquecer a sus dueños y esto frustra a sus usuarios. Si los usuarios consiguen
               lo que quieren se van de la app, por lo que sus dueños hacen que la app no funcione
               de la mejor manera, generando mas necesidad de pagar funciones premium. Este fenómeno
               esta detallado en el libro "El algoritmo del amor" de "Judith Duportail", una
               investigación donde la autora muestra como acceder a las patentes de Tinder y difunde
               su información la cual revela cómo esta app funciona internamente, asi como otras de
               la misma empresa llamada "Match Group" como OkCupid.
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
               La idea viene de un desarrollador de software argentino interesado en la opresión en
               nuestra sociedad y la historia de la sexualidad. Realizó el desarrollo de software y
               el diseño gráfico, pero las diferentes partes y detalles que lo hacen viable son
               ideas de varias personas interesadas en el proyecto, gente perteneciente a
               organizaciones de poliamor, amor libre, feminismo, profesionales de diferentes
               disciplinas: desde ciencias sociales hasta otrxs ingenieros de software.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Cómo surgió la idea?
            </TitleText>
            <Text>
               Si se sabe la historia de la sexualidad humana, la idea de esta aplicación suena muy
               viable y mas natural que las de monogamia. Hay grandes libros para recomendar como
               los de "Christopher Ryan" en primer lugar o algunos de "Engels" como "El origen de la
               familia, la propiedad privada y el estado". Aquí vamos con un resumen:
            </Text>
            <EmptySpace height={15} />
            <Text>
               El ser humano primitivo inteligente (cazador recolector) vivía en tribus donde se
               compartía la comida, la crianza de lxs hijxs y el sexo, lxs padres de lxs hijxs eran
               todxs. El sexo era variado y/o grupal con mucho mas frecuencia de lo que tienen sexo
               las personas mas sexuales en nuestra sociedad, así como el nivel de sociabilidad
               tampoco tenía punto de comparación. La comida todxs sabían obtenerla, no era
               obligatorio recurrir a nadie en particular para sobrevivir si no a toda la tribu, por
               lo que no podían producirse estructuras de poder verticales como las de hoy en día:
               patriarcado, explotación, etc.
            </Text>
            <EmptySpace height={15} />
            <Text>
               También es así la vida del primate más genéticamente similar al humano: el poco
               conocido y pacífico "bonobo", un primate hyper sexual con una sociedad levemente
               matriarcal. Lxs antropólogos y primatólogos manejan muchas pruebas de que la forma de
               vida del ser humano inteligente (cazador recolector) era muy similar y somos
               físicamente muy similares, incluidos los genitales, cuyas características tienen
               mucho protagonismo en la intensidad de nuestro deseo sexual.
            </Text>
            <EmptySpace height={15} />
            <Text>
               Que hayamos evolucionado siendo como los bonobos, significa que nuestro cuerpo nos
               pide una sexualidad acorde, por ejemplo cuando vemos porno: No vemos siempre a una
               persona preferida (sería aburrido) si no que buscamos contenido nuevo con personas
               nuevas, esto muestra que la sexualidad de todxs pide variedad. Los gemidos aparecen
               en nuestro instinto para llamar a los que están cerca a que se unan a la experiencia
               sexual y se convierta en una experiencia grupal (al igual que en los bonobos). El
               pene es un instrumento con una forma específica para succionar alejando del útero el
               semen de un competidor reproductivo que estuvo ahí poco tiempo antes y favorecer el
               propio, nada muy monógamo.
            </Text>
            <EmptySpace height={15} />
            <Text>
               En nuestra cultura cuando se instala la monogamia, no sucede por que esta tenga
               alguna ventaja emocional o sea mas profunda en las relaciones afectivas o sexuales,
               al contrario, fue solo por cuestiones comerciales: casar hijxs como contrato
               comercial, acumular riqueza de forma personal sin compartir con la tribu, etc. Surge
               al mismo tiempo que se da la abolición de lo colectivo en favor de la propiedad
               privada, específicamente en la revolución neolítica.
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
