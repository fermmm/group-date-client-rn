import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveOnDeviceSecure(key: string, value: string): Promise<void> {
   const secureStorageAvailable: boolean = await isSecureStorageAvailable();
   if (secureStorageAvailable) {
      return SecureStore.setItemAsync(key, value);
   } else {
      return saveOnDevice(key, value);
   }
}

export async function loadFromDeviceSecure(key: string): Promise<string> {
   const secureStorageAvailable: boolean = await isSecureStorageAvailable();
   if (secureStorageAvailable) {
      return SecureStore.getItemAsync(key);
   } else {
      return loadFromDevice(key);
   }
}

export async function removeFromDeviceSecure(key: string): Promise<void> {
   const secureStorageAvailable: boolean = await isSecureStorageAvailable();
   if (secureStorageAvailable) {
      return SecureStore.deleteItemAsync(key);
   } else {
      return removeFromDevice(key);
   }
}

export async function saveOnDevice(key: string, value: string): Promise<void> {
   return AsyncStorage.setItem(key, value);
}

export async function loadFromDevice(key: string): Promise<string> {
   return AsyncStorage.getItem(key);
}

export async function removeFromDevice(key: string): Promise<void> {
   return AsyncStorage.removeItem(key);
}

async function isSecureStorageAvailable(): Promise<boolean> {
   await SecureStore.setItemAsync("test", "1234");
   return Promise.resolve((await SecureStore.getItemAsync("test")) === "1234");
}
