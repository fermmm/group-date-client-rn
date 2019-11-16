import React, { Component } from "react";
import { StyleSheet, View, Modal, TouchableHighlight, Keyboard, StatusBar } from 'react-native';
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { TextInput, TextInputProps, Portal } from "react-native-paper";
import ButtonStyled from "../ButtonStyled/ButtonStyled";
import color from "color";
import { currentTheme } from "../../../config";
import TitleMediumText from "../TitleMediumText/TitleMediumText";
import KeyboardSpacer from "react-native-keyboard-spacer";

export interface TextInputExtendedProps extends TextInputProps {
   title?: string;
   titleLine2?: string;
}
export interface TextInputExtendedState {
   fullScreenMode: boolean;
}

class TextInputExtended extends Component<TextInputExtendedProps, TextInputExtendedState> {
   state: TextInputExtendedState = {
      fullScreenMode: false
   };
   modalInput: TextInput;

   componentDidMount(): void {
      Keyboard.addListener("keyboardDidHide", this.onKeyboardClose);
   }

   render(): JSX.Element {
      const { title, titleLine2, multiline }: TextInputExtendedProps = this.props;

      return (
         <>
            <View style={styles.mainContainer}>
               {
                  title &&
                  <TitleMediumText style={styles.title}>
                     {title}
                  </TitleMediumText>
               }
               {
                  titleLine2 &&
                  <TitleMediumText style={styles.titleLine2}>
                     {titleLine2}
                  </TitleMediumText>
               }
               <TouchableHighlight
                  onPress={() => this.setState({ fullScreenMode: true })}
                  underlayColor={color("white").alpha(0.5).string()}
                  activeOpacity={1}
               >
                  <TextInput
                     {...this.props}
                     disabled
                  />
               </TouchableHighlight>
            </View>
            {
               this.state.fullScreenMode &&
                  <Portal>
                     <View style={styles.modal}>
                        {
                           title &&
                              <TitleMediumText style={styles.title}>
                                 {title}
                              </TitleMediumText>
                        }
                        {
                           titleLine2 &&
                              <TitleMediumText style={styles.titleLine2}>
                                 {titleLine2}
                              </TitleMediumText>
                        }
                        <TextInput
                           {...this.props}
                           autoFocus
                           style={[this.props.style, {flex: multiline ? 1 : 0}]}
                           ref={component => this.modalInput = component}
                           onBlur={() => this.setState({ fullScreenMode: false })}
                        />
                        <ButtonStyled
                           onPress={() => this.setState({ fullScreenMode: false })}
                           style={styles.buttonSave}
                           color={currentTheme.colors.text2}
                        >
                           Guardar
                        </ButtonStyled>
                        <KeyboardSpacer />
                     </View>
                  </Portal>
            }
         </>
      );
   }

   onKeyboardClose = () => {
      if (this.state.fullScreenMode) {
         this.setState({ fullScreenMode: false });
      }
   }

   componentWillUnmount(): void {
      Keyboard.removeListener("keyboardDidHide", this.onKeyboardClose);
   }
}

const styles: Styles = StyleSheet.create({
   mainContainer: {
      marginBottom: 18
   },
   title: {
      marginBottom: 0
   },
   titleLine2: {
      marginBottom: 0,
      fontFamily: currentTheme.fonts.extraLight
   },
   modal: {
      position: "absolute",
      backgroundColor: currentTheme.colors.background,
      padding: 10,
      paddingBottom: 30,
      paddingTop: StatusBar.currentHeight + 15,
      zIndex: 100,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
   },
   buttonSave: {
      marginTop: 15,
      backgroundColor: currentTheme.colors.primary,
   }
});

export default TextInputExtended;