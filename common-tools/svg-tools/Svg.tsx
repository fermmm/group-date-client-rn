import React, { FC, memo } from "react";
import { SvgXml } from "react-native-svg";

export interface PropsSvg {
   src: string;
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
const Svg: FC<PropsSvg> = props => <SvgXml width="100%" height="100%" xml={props.src} />;

export default memo(Svg);
