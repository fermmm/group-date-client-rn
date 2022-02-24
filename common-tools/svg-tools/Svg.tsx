import React, { FC, memo } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { NumberProp, SvgXml } from "react-native-svg";

export interface PropsSvg {
   src: string;
   width?: NumberProp;
   height?: NumberProp;
   style?: StyleProp<ViewStyle>;
}

/**
 * Renders an SVG imported using import line.
 * @example
 *    import testSvg from "./test-svg.svg";
 *       ...
 *    <Svg src={testSvg} />
 *
 * @param props
 * @returns
 */
const Svg: FC<PropsSvg> = props => {
   const { src, width = "100%", height = "100%", style } = props;

   return <SvgXml width={width} height={height} xml={src} style={style} />;
};

export default memo(Svg);
