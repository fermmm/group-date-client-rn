import React, { useState, FC, useCallback, useRef, useEffect } from "react";
import {
   StyleSheet,
   View,
   Keyboard,
   TextStyle,
   StyleProp,
   KeyboardTypeOptions,
   TextInput as NativeTextInput,
   Modal,
   ViewStyle
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { TextInput } from "react-native-paper";
import ButtonStyled from "../ButtonStyled/ButtonStyled";
import { currentTheme } from "../../../config";
import TitleMediumText from "../TitleMediumText/TitleMediumText";
import { ViewTouchable } from "../ViewTouchable/ViewTouchable";
import { useTheme } from "../../../common-tools/themes/useTheme/useTheme";

export interface TextInputExtendedProps {
   title?: string;
   titleLine2?: string;
   placeholderText?: string;
   errorText?: string;
   fullScreenTyping?: boolean;
   multiline?: boolean;
   saveButtonText?: string;
   style?: StyleProp<TextStyle>;
   containerStyle?: StyleProp<ViewStyle>;
   mode?: "flat" | "outlined";
   small?: boolean;
   keyboardType?: KeyboardTypeOptions;
   // tslint:disable-next-line: ban-types
   onChangeText?: ((text: string) => void) & Function;
   iconButton?: string;
   onIconButtonPress?: () => void;
   value: string;
}

const TextInputExtended: FC<TextInputExtendedProps> = props => {
   const {
      title,
      titleLine2,
      placeholderText,
      errorText,
      fullScreenTyping = true,
      multiline,
      saveButtonText = "Guardar",
      mode = "outlined",
      small,
      keyboardType,
      value,
      onChangeText,
      iconButton,
      onIconButtonPress,
      style,
      containerStyle
   }: TextInputExtendedProps = props;
   const theme = useTheme();
   const [fullScreenMode, setFullScreenMode] = useState(false);
   const [canShowError, setCanShowError] = useState(false);
   const fullScreenInputRef = useRef<NativeTextInput>();

   const disableEditMode = useCallback(() => {
      if (fullScreenMode) {
         setCanShowError(true);
         setFullScreenMode(false);
      }
   }, [fullScreenMode]);

   useEffect(() => {
      Keyboard.addListener("keyboardDidHide", disableEditMode);
      return () => {
         Keyboard.removeListener("keyboardDidHide", disableEditMode);
      };
   }, [fullScreenMode]);

   return (
      <>
         <View style={[styles.mainContainer, containerStyle]}>
            {title && <TitleMediumText style={styles.title}>{title}</TitleMediumText>}
            {titleLine2 && (
               <TitleMediumText style={styles.titleLine2}>{titleLine2}</TitleMediumText>
            )}
            <ViewTouchable
               onPress={fullScreenTyping ? () => setFullScreenMode(true) : null}
               defaultAlpha={0.15}
            >
               <TextInput
                  dense={small}
                  placeholder={placeholderText}
                  mode={mode}
                  keyboardType={keyboardType}
                  value={value}
                  onChangeText={onChangeText}
                  style={[
                     style,
                     {
                        textAlignVertical: "top"
                     }
                  ]}
                  multiline={multiline}
                  render={innerProps => (
                     <NativeTextInput
                        {...innerProps}
                        style={[
                           innerProps.style,
                           iconButton && { paddingRight: 45 },
                           multiline
                              ? {
                                   paddingTop: 8,
                                   paddingBottom: 8
                                }
                              : null
                        ]}
                     />
                  )}
                  disabled={fullScreenTyping}
               />
            </ViewTouchable>
            {iconButton && (
               <ViewTouchable
                  style={{
                     position: "absolute",
                     justifyContent: "center",
                     alignItems: "center",
                     right: 30,
                     width: 35,
                     top: 3,
                     height: "100%"
                  }}
                  onPress={onIconButtonPress}
               >
                  <Icon name={iconButton} color={theme.colors.primary} size={22} />
               </ViewTouchable>
            )}
            {errorText && canShowError && (
               <TitleMediumText style={styles.errorText}>{errorText}</TitleMediumText>
            )}
         </View>
         {fullScreenMode && (
            <Modal
               animationType="fade"
               onShow={() => fullScreenInputRef?.current?.focus()}
               onRequestClose={disableEditMode}
               visible
               transparent
            >
               <View style={styles.modal}>
                  {title && <TitleMediumText style={styles.title}>{title}</TitleMediumText>}
                  {titleLine2 && (
                     <TitleMediumText style={styles.titleLine2}>{titleLine2}</TitleMediumText>
                  )}
                  <TextInput
                     mode={mode}
                     onBlur={disableEditMode}
                     keyboardType={keyboardType}
                     value={value}
                     multiline={multiline}
                     onChangeText={onChangeText}
                     numberOfLines={200}
                     style={{ flex: multiline ? 1 : 0 }}
                     ref={fullScreenInputRef}
                  />
                  {errorText && canShowError && (
                     <TitleMediumText style={styles.errorText}>{errorText}</TitleMediumText>
                  )}
                  <ButtonStyled
                     onPress={disableEditMode}
                     style={styles.buttonSave}
                     color={currentTheme.colors.text2}
                  >
                     {saveButtonText}
                  </ButtonStyled>
               </View>
            </Modal>
         )}
      </>
   );
};

const styles: Styles = StyleSheet.create({
   mainContainer: {
      marginBottom: 18
   },
   title: {
      marginBottom: 0
   },
   titleLine2: {
      marginBottom: 0,
      fontFamily: currentTheme.font.extraLight
   },
   errorText: {
      marginBottom: 0,
      marginTop: 6,
      fontFamily: currentTheme.font.medium,
      color: currentTheme.colors.error
   },
   modal: {
      position: "absolute",
      backgroundColor: currentTheme.colors.background,
      padding: 10,
      paddingBottom: 0,
      zIndex: 100,
      top: 0,
      left: 0,
      width: "100%",
      height: "100%"
   },
   buttonSave: {
      marginTop: 15,
      backgroundColor: currentTheme.colors.primary
   }
});

export default TextInputExtended;
