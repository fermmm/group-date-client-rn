import { LocalStorageKey } from "../../strings/LocalStorageKey";
import { removeFromDevice } from "./storage";

export function removeAllLocalStorage() {
   Object.values(LocalStorageKey).forEach(value => {
      removeFromDevice(value);
      removeFromDevice(value, { secure: true });
   });
}
