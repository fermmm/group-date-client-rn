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
            <TitleText extraSize style={styles.title}>
               ¿Si solo me gusta un género, significa que en la cita grupal van a ser todxs de ese
               género?
            </TitleText>
            <Text>
               No necesariamente. Para estar en una cita grupal te tienes que gustar con un mínimo
               de 2 de sus integrantes, es probable que haya algunas personas en una cita con
               quienes no te gustas, que pueden ser de cualquier género y sexualidad.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Se pueden generar citas desequilibradas? (Ej: 1 persona se gusta con 5 que no se
               gustan entre ellxs)
            </TitleText>
            <Text>
               No, un requisito para que se forme una cita grupal es que sean grupos mas o menos
               equilibrados y razonables
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Es fácil que se genere una cita grupal?
            </TitleText>
            <Text>
               Es igual o más fácil que se genere una cita en esta app que en las de monogamia (como
               Tinder y OKCupid). Esto es así por varios motivos que se suman, uno de ellos es que
               en las apps de monogamia los usuarios que reciben una buena cantidad de likes dejan
               de usar la app, consiguen lo que quieren y dejan su perfil visible pero inactivo. En
               esta app puedes recibir muchos likes pero eso no tiene por que hacer que consigas una
               cita más rápido que los demás, tiene que haber una coincidencia grupal, por lo que
               hay mas gente activa viendo perfiles y dando sus likes, lo que aumenta las
               posibilidades de una coincidencia grupal. Otro motivo es que en las apps de monogamia
               se busca "la persona ideal", que va a ser la única en la cita por lo que tiene que
               tener una buena cantidad de características deseadas por la otra persona, esto hace
               escasear los likes para una buena cantidad de usuarios, en cambio en una cita grupal
               nadie tiene que "tenerlo todo", por lo que en esta app se tiende a ser mas flexible
               al dar likes y por eso también aumentan las posibilidades de una coincidencia grupal.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Ésta aplicación es gratis?
            </TitleText>
            <Text>
               Es y será siempre gratis, sin fines comerciales. Financiada con donaciones a
               voluntad, el único fin es hacer que iniciarse en el poliamor sea mas fácil en la
               práctica y ayudar a modificar la idea de que las citas son únicamente de a dos.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Quién hizo la aplicación?
            </TitleText>
            <Text>
               Un programador argentino interesado en sexualidad y poliamor es quien tuvo la idea,
               realizó el desarrollo de software y el diseño gráfico, pero las diferentes partes y
               los detalles que la hacen viable son el producto de ideas de varias personas
               interesadas en el proyecto, gente perteneciente a organizaciones de amor libre en
               Argentina y otros profesionales de diferentes disciplinas: desde ciencias sociales
               hasta otros ingenieros de software.
            </Text>
            <TitleText extraSize style={styles.title}>
               ¿Cómo surgió la idea?
            </TitleText>
            <Text>
               Si se sabe la historia de la sexualidad humana, la idea de esta aplicación suena muy
               viable y mas natural que las de monogamia. Hay grandes libros para recomendar como
               los de "Christopher Ryan" en primer lugar o algunos de "Engels" (El origen de la
               familia, la propiedad privada y el estado). Aquí vamos con un resumen:
            </Text>
            <EmptySpace height={15} />
            <Text>
               El ser humano primitivo (cazador recolector) vivía en tribus donde se compartía la
               comida, la crianza de los hijos y el sexo, los padres de los hijos eran todxs. El
               sexo era variado y/o grupal con mucho mas frecuencia de lo que tienen sexo las
               personas mas sexuales en nuestra sociedad. La comida se obtenía principalmente de
               forma auto suficiente, la vida en comunidad mejoraba la existencia pero para comer y
               sobrevivir no era obligatorio recurrir a nadie, por lo que no podían producirse
               estructuras de poder verticales (division del trabajo).
            </Text>
            <EmptySpace height={15} />
            <Text>
               También es así la vida del primate más genéticamente similar al humano: el poco
               conocido y pacífico "Bonobo", un primate hyper sexual con una sociedad levemente
               matriarcal. Los antropólogos y primatólogos manejan muchas pruebas de que la vida del
               ser humano inteligente (cazador recolector) era muy similar y somos físicamente muy
               similares, incluidos los genitales, cuyas características tienen mucho protagonismo
               en la intensidad de nuestro deseo sexual.
            </Text>
            <EmptySpace height={15} />
            <Text>
               Que hayamos evolucionado siendo como los bonobos, significa que nuestro cuerpo nos
               pide una sexualidad acorde, por ejemplo cuando vemos porno: No vemos siempre a una
               persona preferida (sería aburrido) si no que buscamos contenido nuevo con personas
               nuevas, esto muestra que nuestro deseo sexual pide variedad. Los gemidos aparecen en
               nuestro instinto para llamar a los que están cerca a que se unan a nuestra
               experiencia sexual y se convierta en una experiencia grupal (por diferentes motivos,
               al igual que en los bonobos). El pene es un instrumento con una forma específica para
               succionar alejando del útero el semen de un "competidor" que estuvo ahí poco tiempo
               antes y favorecer el propio, nada muy monógamo.
            </Text>
            <EmptySpace height={15} />
            <Text>
               En nuestra cultura cuando se instala la monogamia, no sucede por que esta tenga
               alguna ventaja emocional o sea mas profunda en las relaciones afectivas o sexuales,
               si no solo por cuestiones comerciales, casar hijos como contrato comercial, acumular
               riqueza de forma personal sin compartir con la tribu, etc. Surge durante la abolición
               de lo colectivo en favor de la propiedad privada, específicamente en la revolución
               neolítica.
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
