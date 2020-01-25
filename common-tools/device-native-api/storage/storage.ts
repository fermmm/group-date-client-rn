import * as SecureStore from "expo-secure-store";
import { AsyncStorage } from "react-native";

export async function saveOnDeviceSecure(key: string, value: string): Promise<void> {
   const secureStorageAvaiable: boolean = await isSecureStorageAvaiable();
   if (secureStorageAvaiable) {
      return SecureStore.setItemAsync(key, value);
   } else {
      return AsyncStorage.setItem(key, value);
   }
}

export async function loadFromDeviceSecure(key: string): Promise<string> {
   const secureStorageAvaiable: boolean = await isSecureStorageAvaiable();
   if (secureStorageAvaiable) {
      return SecureStore.getItemAsync(key);
   } else {
      return AsyncStorage.getItem(key);
   }
}

export async function saveOnDevice(key: string, value: string): Promise<void> {
   return AsyncStorage.setItem(key, value);
}

export async function loadFromDevice(key: string): Promise<string> {
   return AsyncStorage.getItem(key);
}

async function isSecureStorageAvaiable(): Promise<boolean> {
   await SecureStore.setItemAsync("test", "1234");
   return Promise.resolve(await SecureStore.getItemAsync("test") === "1234");
}