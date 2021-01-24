import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

/**
 * Hook to determine if the app it's minimized or not or the specific status value.
 */
export function useAppState(): UseAppState {
   const appStateRef = useRef(AppState.currentState);
   const [appState, setAppState] = useState(appStateRef.current);

   const _handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
      appStateRef.current = nextAppState;
      setAppState(appStateRef.current);
   }, []);

   useEffect(() => {
      AppState.addEventListener("change", _handleAppStateChange);

      return () => {
         AppState.removeEventListener("change", _handleAppStateChange);
      };
   }, []);

   return {
      appState,
      isActive: appStateRef.current.match(/inactive|background/) == null
   };
}

export interface UseAppState {
   appState: AppStateStatus;
   isActive: boolean;
}
