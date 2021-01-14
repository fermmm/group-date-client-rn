import { RouteProp } from "@react-navigation/native";

export type RouteProps<T extends object> = RouteProp<{ p: T }, "p">;
