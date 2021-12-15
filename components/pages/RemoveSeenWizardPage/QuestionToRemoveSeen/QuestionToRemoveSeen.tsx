import React, { FC } from "react";
import {
   StyleSheet,
   Dimensions,
   ImageSourcePropType,
   ImageProps,
   ImageBackground,
   Image,
   Platform
} from "react-native";
import { useUser } from "../../../../api/server/user";
import { useImageFullUrl } from "../../../../api/tools/useImageFullUrl";
import { useTheme } from "../../../../common-tools/themes/useTheme/useTheme";
import { Styles } from "../../../../common-tools/ts-tools/Styles";
import { currentTheme } from "../../../../config";
import BasicScreenContainer from "../../../common/BasicScreenContainer/BasicScreenContainer";
import ButtonStyled from "../../../common/ButtonStyled/ButtonStyled";
import ImagesScroll from "../../../common/ImagesScroll/ImagesScroll";
import { LoadingAnimation } from "../../../common/LoadingAnimation/LoadingAnimation";
import TitleText from "../../../common/TitleText/TitleText";

interface PropsQuestionToRemoveSeen {
   userId: string;
   onAnswer: (include: boolean) => void;
}

const QuestionToRemoveSeen: FC<PropsQuestionToRemoveSeen> = props => {
   const { userId, onAnswer } = props;
   const { colors } = useTheme();
   const { data: user, isLoading: userLoading } = useUser({ requestParams: { userId } });
   const { getImageFullUrl, isLoading: imagesFullUrlLoading } = useImageFullUrl();
   const finalImages = user?.images?.map(uri => getImageFullUrl(uri)) ?? [];

   const isLoading = userLoading || imagesFullUrlLoading;

   if (isLoading) {
      return <LoadingAnimation />;
   }

   return (
      <BasicScreenContainer
         style={styles.mainContainer}
         contentContainerStyle={styles.scrollContentContainer}
      >
         <ImagesScroll
            images={finalImages}
            style={[styles.galleryScroll]}
            renderImage={(
               image: ImageSourcePropType,
               imageProps: ImageProps,
               key: string | number
            ) => (
               <ImageBackground
                  style={{ width: "100%", height: "100%" }}
                  source={image}
                  blurRadius={Platform.OS === "ios" ? 120 : 60}
               >
                  <Image {...imageProps} resizeMethod={"resize"} resizeMode={"contain"} key={key} />
               </ImageBackground>
            )}
         />
         <TitleText style={styles.questionTitle}>
            ¿Quieres incluir a{" "}
            <TitleText style={styles.questionTitleHighlighted}>{user.name}</TitleText> en tu próxima
            cita grupal?
         </TitleText>
         <TitleText style={styles.questionExtraText}>
            Si no se han podido conocer en persona recomendamos tocar "Incluir a {user.name}"
         </TitleText>
         <ButtonStyled
            color={colors.text}
            style={styles.button}
            contentStyle={styles.buttonContent}
            onPress={() => onAnswer(true)}
         >
            Incluir a {user.name}
         </ButtonStyled>
         <ButtonStyled
            color={colors.text}
            style={styles.button}
            contentStyle={styles.buttonContent}
            onPress={() => onAnswer(false)}
         >
            No incluir
         </ButtonStyled>
      </BasicScreenContainer>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {},
   galleryScroll: {
      height: Dimensions.get("window").height * 0.4 // This controls the height of the images area.
   },
   scrollContentContainer: {
      paddingTop: 0
   },
   questionTitle: {
      marginTop: 20,
      marginBottom: 10,
      paddingLeft: 8,
      paddingRight: 8
   },
   questionTitleHighlighted: {
      fontFamily: currentTheme.font.medium
   },
   questionExtraText: {
      fontFamily: currentTheme.font.regular,
      fontSize: 16,
      paddingLeft: 8,
      paddingRight: 8,
      marginBottom: 30
   }
});

export default QuestionToRemoveSeen;
