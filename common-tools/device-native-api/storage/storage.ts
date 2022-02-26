import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveOnDevice<T extends any = string>(
   key: string,
   value: T,
   settings?: { secure?: boolean }
): Promise<void> {
   const secureStorageAvailable: boolean = await isSecureStorageAvailable();
   let finalValue: string;

   if (typeof value === "string") {
      finalValue = value;
   } else {
      finalValue = JSON.stringify(value);
   }

   if (settings?.secure && secureStorageAvailable) {
      return SecureStore.setItemAsync(key, finalValue);
   } else {
      return AsyncStorage.setItem(key, finalValue);
   }
}

export async function loadFromDevice<T extends any = string>(
   key: string,
   settings?: { secure?: boolean }
): Promise<T> {
   const secureStorageAvailable: boolean = await isSecureStorageAvailable();
   let result: string;

   if (settings?.secure && secureStorageAvailable) {
      result = await SecureStore.getItemAsync(key);
   } else {
      result = await AsyncStorage.getItem(key);
   }

   let parsedResult: T;

   try {
      parsedResult = JSON.parse(result);
   } catch {
      parsedResult = result as T;
   }

   return parsedResult as T;
}

export async function removeFromDevice(
   key: string,
   settings?: { secure?: boolean }
): Promise<void> {
   const secureStorageAvailable: boolean = await isSecureStorageAvailable();

   if (settings?.secure && secureStorageAvailable) {
      return SecureStore.deleteItemAsync(key);
   } else {
      return AsyncStorage.removeItem(key);
   }
}

async function isSecureStorageAvailable(): Promise<boolean> {
   await SecureStore.setItemAsync("__test___", "1234");
   const canRead = (await SecureStore.getItemAsync("__test___")) === "1234";
   return Promise.resolve(canRead);
}
