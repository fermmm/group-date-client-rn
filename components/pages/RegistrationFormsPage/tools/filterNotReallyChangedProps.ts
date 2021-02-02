import { User } from "../../../../api/server/shared-tools/endpoints-interfaces/user";
import { EditableUserProps } from "../../../../api/server/shared-tools/validators/user";

/**
 * Some props like location coordinates are slightly different numbers each time they are retrieved, the difference
 * is not relevant and equality check it's not useful anymore. This special comparator is required then to know when
 * the user made real changes.
 */
export function filterNotReallyChangedProps(
   propsGathered: EditableUserProps,
   user: Partial<User>
): EditableUserProps {
   if (user == null) {
      return propsGathered;
   }
   const result: EditableUserProps = {};
   const keysToKeep: string[] = Object.keys(propsGathered ?? {}).filter(key => {
      if (user[key] == null) {
         return true;
      }

      if (propsGathered[key] == null) {
         return false;
      }

      if (Array.isArray(propsGathered[key])) {
         return propsGathered[key].join() !== user[key].join();
      }
      if (typeof propsGathered[key] === "number") {
         let reducedNumber1 = String(Math.abs(propsGathered[key])).substring(0, 5);
         let reducedNumber2 = String(Math.abs(user[key])).substring(0, 5);
         return reducedNumber1 !== reducedNumber2;
      }
      return propsGathered[key] !== user[key];
   });
   keysToKeep.forEach(key => (result[key] = propsGathered[key]));
   return result;
}
