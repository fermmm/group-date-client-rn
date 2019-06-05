import React, { Component } from "react";
import { StyleSheet, Dimensions, StatusBar } from "react-native";
import { TabView, SceneMap, TabBar, Route } from "react-native-tab-view";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Styles } from "../../../common-tools/ts-tools/Styles";

interface INavBarProps {
    sections: { [key: string]: () => JSX.Element };
    routes: Route[];
}

interface INavBarState {
    index: number;
}

export default class NavigationBar extends Component<INavBarProps, INavBarState> {
    state: INavBarState = {
        index: 0,
    };

    render(): JSX.Element {
        return (
            <TabView
                swipeEnabled={false}
                navigationState={{index: this.state.index, routes: this.props.routes}}
                renderScene={SceneMap(this.props.sections)}
                onIndexChange={index => this.setState({ index })}
                initialLayout={{ width: Dimensions.get("window").width }}
                renderTabBar={props =>
                    <TabBar
                        {...props}
                        indicatorStyle={{ backgroundColor: "white" }}
                        style={styles.tabBar}
                        renderIcon={({ route, focused, color }) =>
                            <Icon
                                name={route.icon}
                                color={color}
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
        backgroundColor: "#01B3A2",
        paddingTop: StatusBar.currentHeight,
    },
});
