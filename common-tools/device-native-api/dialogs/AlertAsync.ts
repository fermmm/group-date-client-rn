import { Alert, AlertOptions } from "react-native";

export async function AlertAsync<T>(props: AlertAsyncProps<T>) {
   let resolvePromise: (bool: T) => void;
   const promise = new Promise<T>(resolve => (resolvePromise = resolve));

   Alert.alert(
      props.title ?? "",
      props.message ?? "",
      props.buttons.map(button => ({
         text: button.text,
         onPress: () => {
            if (button.onPressReturns != null) {
               resolvePromise(button.onPressReturns);
            }

            if (button.onPress) {
               resolvePromise(button.onPress());
            }
         }
      })),
      props.options
   );

   return promise;
}

export interface AlertAsyncProps<T> {
   title?: string;
   message?: string;
   buttons: AlertAsyncButton<T>[];
   options?: AlertOptions;
}

export interface AlertAsyncButton<T> {
   text: string;
   onPressReturns?: T;
   style?: "default" | "cancel" | "destructive";
   onPress?: () => T;
}
