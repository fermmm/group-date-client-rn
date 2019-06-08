import React, { Component } from "react";
import { StyleSheet, Dimensions, StatusBar } from "react-native";
import { TabView, SceneMap, TabBar, Route } from "react-native-tab-view";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Styles } from "../../../common-tools/ts-tools/Styles";
import { IThemed } from "../../../common-tools/ts-tools/Themed";
import { withTheme } from "react-native-paper";
import { Theme } from "react-native-paper/typings";

interface INavBarProps extends IThemed {
    sections: { [key: string]: () => JSX.Element };
    routes: Route[];
}

interface INavBarState {
    index: number;
}

class NavigationBar extends Component<INavBarProps, INavBarState> {
    state: INavBarState = {
        index: 0,
    };

    render(): JSX.Element {
        const { routes }: INavBarProps = this.props;
        const { colors }: Theme = this.props.theme;
        const { index }: INavBarState = this.state;

        return (
            <TabView
                swipeEnabled={false}
                navigationState={{index, routes}}
                renderScene={SceneMap(this.props.sections)}
                onIndexChange={i => this.setState({ index: i })}
                initialLayout={{ width: Dimensions.get("window").width }}
                renderTabBar={props =>
                    <TabBar
                        {...props}
                        indicatorStyle={{ backgroundColor: colors.primary }}
                        style={[styles.tabBar, {backgroundColor: colors.surface}]}
                        renderIcon={({ route, focused }) =>
                            <Icon
                                name={route.icon}
                                color={focused ? colors.accent : colors.primary}
                                size={22}
                            />
                        }
                    />
                }
            />
        );
    }
}

const styles: Styles = StyleSheet.create({
    tabBar: {
        paddingTop: StatusBar.currentHeight,
    },
});

export default withTheme(NavigationBar);
