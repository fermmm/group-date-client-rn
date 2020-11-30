import React, { useState, FC, useCallback } from "react";
import {
   StyleSheet,
   View,
   TouchableHighlight,
   Keyboard,
   StatusBar,
   TextStyle,
   StyleProp,
   KeyboardTypeOptions,
   TextInput as NativeTextInput
} from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { TextInput, Portal } from "react-native-paper";
import ButtonStyled from "../ButtonStyled/ButtonStyled";
import color from "color";
import { currentTheme } from "../../../config";
import TitleMediumText from "../TitleMediumText/TitleMediumText";
import KeyboardSpacer from "react-native-keyboard-spacer";

export interface TextInputExtendedProps {
   title?: string;
   titleLine2?: string;
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
      multiline,
      mode,
      keyboardType,
      value,
      onChangeText,
      style
   }: TextInputExtendedProps = props;

   const [fullScreenMode, setFullScreenMode] = useState(false);

   React.useEffect(() => {
      Keyboard.addListener("keyboardDidHide", onKeyboardClose);
      return () => {
         Keyboard.removeListener("keyboardDidHide", onKeyboardClose);
      };
   }, []);

   const onKeyboardClose = useCallback(() => {
      setFullScreenMode(false);
   }, []);

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
         </View>
         {fullScreenMode && (
            <Portal>
               <View style={styles.modal}>
                  {title && <TitleMediumText style={styles.title}>{title}</TitleMediumText>}
                  {titleLine2 && (
                     <TitleMediumText style={styles.titleLine2}>{titleLine2}</TitleMediumText>
                  )}
                  <TextInput
                     mode={mode}
                     style={[{ flex: 0 }]}
                     onBlur={() => setFullScreenMode(false)}
                     keyboardType={keyboardType}
                     value={value}
                     multiline={multiline}
                     onChangeText={onChangeText}
                     numberOfLines={20}
                     autoFocus
                  />
                  <ButtonStyled
                     onPress={() => setFullScreenMode(false)}
                     style={styles.buttonSave}
                     color={currentTheme.colors.text2}
                  >
                     Guardar
                  </ButtonStyled>
                  <KeyboardSpacer />
               </View>
            </Portal>
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
   modal: {
      position: "absolute",
      backgroundColor: currentTheme.colors.background,
      padding: 10,
      paddingBottom: 75,
      paddingTop: StatusBar.currentHeight + 15,
      zIndex: 100,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
   },
   buttonSave: {
      marginTop: 15,
      backgroundColor: currentTheme.colors.primary
   }
});

export default TextInputExtended;
