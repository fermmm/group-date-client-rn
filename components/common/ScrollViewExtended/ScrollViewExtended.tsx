import React, { Component } from "react";
import { StyleSheet, ScrollView, ScrollViewProps, NativeScrollEvent, NativeSyntheticEvent, Animated, LayoutChangeEvent, View } from "react-native";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { LinearGradient } from "expo-linear-gradient";
import color from "color";

export interface ScrollViewExtendedProps extends ScrollViewProps {
    showBottomGradient?: boolean;
    bottomGradientColor?: string;
    /**
     * Triggered when the user scrolls to the bottom and when the user was in the 
     * bottom and scrolls upwards scrolledToBottom parameter indicates this.
     */
    onBottomDetector?: (scrolledToBottom: boolean) => void;
    /**
     * Triggered when the content size changes, detects whether or not the scroll is activated 
     * when the content is larger than the viewport or not. This information is in the 
     * scrollIsActivated parameter.
     */
    onScrollActivatedDetector?: (scrollIsActivated: boolean) => void;
}

export interface ScrollViewExtendedState {
    bottomFadeOpacity: Animated.Value;
    contentHeight: number;
    viewportHeight: number;
}

class ScrollViewExtended extends Component<ScrollViewExtendedProps, ScrollViewExtendedState> {
    static defaultProps: Partial<ScrollViewExtendedProps> = {
        bottomGradientColor: "black",
    };
    scrolledToBottom: boolean;
    state: ScrollViewExtendedState = {
        bottomFadeOpacity: new Animated.Value(0),
        contentHeight: 0,
        viewportHeight: 0,
    };

    render(): JSX.Element {
        const { bottomFadeOpacity }: Partial<ScrollViewExtendedState> = this.state;
        const { showBottomGradient, bottomGradientColor }: Partial<ScrollViewExtendedProps> = this.props;
        
        return (
            <View>
                <ScrollView
                    {...this.props}
                    onScroll={(e) => this.onScroll(e)}
                    onContentSizeChange={(w, h) => this.onContentSizeChange(w, h)}
                    onLayout={e => this.onLayout(e)}
                    scrollEventThrottle={0}
                >
                    {this.props.children}
                </ScrollView>
                {
                    showBottomGradient &&
                    <Animated.View style={{ opacity: bottomFadeOpacity }}>
                        <LinearGradient
                            locations={[0, 1.0]}
                            colors={[
                                color(bottomGradientColor).alpha(0).string(),
                                color(bottomGradientColor).alpha(0.85).darken(0.5).string(),
                            ]}
                            style={styles.bottomGradient}
                        />
                    </Animated.View>
                }
            </View>
        );
    }

    onScroll(event: NativeSyntheticEvent<NativeScrollEvent>): void {
        if (this.props.onScroll != null) {
            this.props.onScroll(event);
        }
        const isCloseToBottom: boolean = this.isCloseToBottom(event.nativeEvent);
        this.onBottomDetector(isCloseToBottom);
        this.props.onBottomDetector &&
            this.props.onBottomDetector(isCloseToBottom);
    }

    onContentSizeChange(contentWidth: number, contentHeight: number): void {
        this.setState({ contentHeight });
        this.props.onContentSizeChange &&
            this.props.onContentSizeChange(contentWidth, contentHeight);
    }

    onBottomDetector(scrolledToBottom: boolean): void {
        if (this.scrolledToBottom === scrolledToBottom) {
            return;
        }

        this.scrolledToBottom = scrolledToBottom;

        Animated.timing(
            this.state.bottomFadeOpacity,
            {
                toValue: scrolledToBottom ? 0 : 1,
                duration: 300,
            },
        ).start();
    }

    onLayout(event: LayoutChangeEvent): void {
        const { contentHeight }: Partial<ScrollViewExtendedState> = this.state;

        const vh: number = event.nativeEvent.layout.height;
        const scrolingActivated: boolean = contentHeight > vh;

        this.setState({ viewportHeight: vh });

        Animated.timing(
            this.state.bottomFadeOpacity,
            {
                toValue: scrolingActivated ? 1 : 0,
                duration: 300,
            },
        ).start();

        this.props.onScrollActivatedDetector &&
            this.props.onScrollActivatedDetector(scrolingActivated);
        this.props.onLayout &&
            this.props.onLayout(event);
    }

    isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }: NativeScrollEvent): boolean {
        const paddingToBottom: number = 1;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    }
}

const styles: Styles = StyleSheet.create({
    bottomGradient: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 55,                 // This controls the height of the bottom "fade gradient"
    },
});

export default ScrollViewExtended;
