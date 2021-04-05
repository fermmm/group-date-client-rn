import { loadFromDevice } from "../../../../common-tools/device-native-api/storage/storage";
import { useLocalStorage } from "../../../../common-tools/device-native-api/storage/useLocalStorage";
import { LocalStorageKey } from "../../../../common-tools/strings/LocalStorageKey";

export function useWelcomeShowed(): UseWelcomeShowed {
   const { value, setValue, isLoading } = useLocalStorage<boolean>(LocalStorageKey.WelcomeShowed);

   return {
      isLoading,
      showed: value ?? false,
      setAsShowed: () => setValue(true)
   };
}

interface UseWelcomeShowed {
   isLoading: boolean;
   showed: boolean;
   setAsShowed: () => void;
}

export async function welcomeWasShowed(): Promise<boolean> {
   return await loadFromDevice<boolean>(LocalStorageKey.WelcomeShowed);
}
