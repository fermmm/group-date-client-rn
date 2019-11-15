import React, { Component } from "react";
import { StyleSheet, View, Modal, TouchableHighlight, Keyboard, StatusBar } from 'react-native';
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { TextInput, TextInputProps, Portal } from "react-native-paper";
import ButtonStyled from "../ButtonStyled/ButtonStyled";
import color from "color";
import { currentTheme } from "../../../config";
import TitleMediumText from "../TitleMediumText/TitleMediumText";

export interface TextInputExtendedProps extends TextInputProps {
   title?: string;
   titleLine2?: string;
}
export interface TextInputExtendedState {
   fullScreenMode: boolean;
}
/**
 * TODO:
 * 1) Mejorar los estilos del modal
 * 3) Mejorar los colores del input original
 * 4) Ponerle un background y mejores colores al boton de guardar
 * 5) Cambiar todos los inputs por esta clase
 */
class TextInputExtended extends Component<TextInputExtendedProps, TextInputExtendedState> {
   state: TextInputExtendedState = {
      fullScreenMode: false
   };
   modalInput: TextInput;

   componentDidMount(): void {
      Keyboard.addListener("keyboardDidHide", this.onKeyboardClose);
   }

   render(): JSX.Element {
      const { title, titleLine2 }: TextInputExtendedProps = this.props;

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
                           ref={component => this.modalInput = component}
                           onBlur={() => this.setState({ fullScreenMode: false })}
                        />
                        <ButtonStyled
                           onPress={() => this.setState({ fullScreenMode: false })}
                           style={styles.buttonSave}
                        >
                           Guardar
                           </ButtonStyled>
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
      marginTop: 18
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
      backgroundColor: "white",
      padding: 10,
      paddingTop: StatusBar.currentHeight + 15,
      zIndex: 100,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
   },
   buttonSave: {
      marginTop: 15
   }
});

export default TextInputExtended;