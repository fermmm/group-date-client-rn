import React, { useState, FC, useCallback, useRef } from "react";
import {
   StyleSheet,
   View,
   TouchableHighlight,
   Keyboard,
   TextStyle,
   StyleProp,
   KeyboardTypeOptions,
   TextInput as NativeTextInput,
   Modal
} from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { TextInput } from "react-native-paper";
import ButtonStyled from "../ButtonStyled/ButtonStyled";
import color from "color";
import { currentTheme } from "../../../config";
import TitleMediumText from "../TitleMediumText/TitleMediumText";

export interface TextInputExtendedProps {
   title?: string;
   titleLine2?: string;
   errorText?: string;
   multiline?: boolean;
   style?: StyleProp<TextStyle>;
   mode?: "flat" | "outlined";
   keyboardType?: KeyboardTypeOptions;
   // tslint:disable-next-line: ban-types
   onChangeText?: ((text: string) => void) & Function;
   value: string;
}

const TextInputExtended: FC<TextInputExtendedProps> = props => {
   const {
      title,
      titleLine2,
      errorText,
      multiline,
      mode,
      keyboardType,
      value,
      onChangeText,
      style
   }: TextInputExtendedProps = props;

   const [fullScreenMode, setFullScreenMode] = useState(false);
   const [canShowError, setCanShowError] = useState(false);
   const fullScreenInputRef = useRef<NativeTextInput>();

   const disableEditMode = useCallback(() => {
      if (fullScreenMode) {
         setCanShowError(true);
         setFullScreenMode(false);
      }
   }, [fullScreenMode]);

   React.useEffect(() => {
      Keyboard.addListener("keyboardDidHide", disableEditMode);
      return () => {
         Keyboard.removeListener("keyboardDidHide", disableEditMode);
      };
   }, [fullScreenMode]);

   return (
      <>
         <View style={styles.mainContainer}>
            {title && <TitleMediumText style={styles.title}>{title}</TitleMediumText>}
            {titleLine2 && (
               <TitleMediumText style={styles.titleLine2}>{titleLine2}</TitleMediumText>
            )}
            <TouchableHighlight
               onPress={() => setFullScreenMode(true)}
               underlayColor={color("white").alpha(0.5).string()}
               activeOpacity={1}
            >
               <TextInput
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
                           multiline
                              ? {
                                   paddingTop: 8,
                                   paddingBottom: 8
                                }
                              : null
                        ]}
                     />
                  )}
                  disabled
               />
            </TouchableHighlight>
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
                     Guardar
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
