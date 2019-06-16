import React from "react";
import { ScrollView, Text, ScrollViewProps, NativeScrollEvent, NativeSyntheticEvent } from "react-native";

const isCloseToBottom: (props: NativeScrollEvent) => boolean = ({ layoutMeasurement, contentOffset, contentSize }: NativeScrollEvent) => {
    const paddingToBottom: number = 1;
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
};

export interface IScrollViewExtendedProps {
    onBottomDetector?: (scrolledToBottom: boolean) => void;
}

const ScrollViewExtended: React.FunctionComponent<ScrollViewProps & IScrollViewExtendedProps> = props => {
    return (
        <ScrollView
            {...props}
            onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
                if (props.onScroll != null) {
                    props.onScroll(e);
                }
                props.onBottomDetector(isCloseToBottom(e.nativeEvent));
            }}
            scrollEventThrottle={0}
        >
            {props.children}
        </ScrollView>
    );
}

export default ScrollViewExtended;
