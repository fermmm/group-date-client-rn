import React, { FunctionComponent } from "react";
import Svg, { Path, SvgProps, G, Circle, Ellipse } from "react-native-svg";
import { View, StyleProp, ViewStyle } from "react-native";

export interface GraphSvg2Props extends SvgProps {
    lineColor?: string;
    circleColor?: string;
    svgStyle?: StyleProp<ViewStyle>;
}

const GraphSvg2: FunctionComponent<GraphSvg2Props> = (props: GraphSvg2Props = {lineColor: "#252525", circleColor: "#b3cc77"}) => (
    <View style={{ ...props.style as {}, aspectRatio: 1 }}>
        <Svg
            width={"100%"}
            height={"100%"}
            viewBox="0 0 118.667 118.711"
            fill={props.color}
            style={props.svgStyle}
            {...props}
        >
            <G transform="translate(-1.223 -1.143)">
                <Circle
                    cx={35.133}
                    cy={102.821}
                    r={12.829}
                    fill="none"
                    stroke={props.circleColor}
                    strokeWidth={8.408}
                    strokeLinejoin="bevel"
                />
                <Ellipse
                    cx={18.209}
                    cy={18.176}
                    rx={12.782}
                    ry={12.829}
                    fill="none"
                    stroke={props.circleColor}
                    strokeWidth={8.408}
                    strokeLinejoin="bevel"
                />
                <Ellipse
                    cx={85.895}
                    cy={26.653}
                    rx={12.782}
                    ry={12.829}
                    fill="none"
                    stroke={props.circleColor}
                    strokeWidth={8.408}
                    strokeLinejoin="bevel"
                />
                <Ellipse
                    cx={102.904}
                    cy={85.806}
                    rx={12.782}
                    ry={12.829}
                    fill="none"
                    stroke={props.circleColor}
                    strokeWidth={8.408}
                    strokeLinejoin="bevel"
                />
                <Path
                    d="M39.31 16.353l26.552 3.307c.049-.102-1.556 3.784-.945 8.315l-26.93-3.212c.03-.165 1.78-3.404 1.323-8.41zM95.469 45.224l5.68 19.511s-4.344-.067-7.952 2.138l-5.68-19.31s4.945-.2 7.952-2.339zM70.87 41.3L43.279 82.875s3.26 1.489 6.686 4.82l27.994-41.672s-4.253-.85-7.087-4.725zM81.643 86.656l-27.498 6.946s1.984 3.26 2.126 8.173l27.498-6.898s-1.654-2.079-2.126-8.22z"
                    fill={props.lineColor}
                />
            </G>
        </Svg>
    </View>
);

export default GraphSvg2;
