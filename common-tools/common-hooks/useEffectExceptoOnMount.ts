import React from "react";

/**
 * Identical to React.useEffect, except that it never runs on mount. This is
 * the equivalent of the componentDidUpdate lifecycle function.
 *
 * @param {function:function} effect - A useEffect effect.
 * @param {array} [dependencies] - useEffect dependency list.
 */
export const useEffectExceptOnMount = (
   effect: React.EffectCallback,
   deps?: React.DependencyList
) => {
   const mounted = React.useRef(false);
   React.useEffect(() => {
      if (mounted.current) {
         const unmount = effect();
         return () => unmount && unmount();
      } else {
         mounted.current = true;
      }
   }, deps);

   // Reset on unmount for the next mount.
   React.useEffect(() => {
      return () => (mounted.current = false);
   }, []);
};
