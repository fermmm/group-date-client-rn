export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

// Converts a union of two types into an intersection
// i.e. A | B -> A & B
export type UnionToIntersection<U> = (U extends {} ? (k: U) => void : never) extends (
   k: infer I
) => void
   ? I
   : never;

// Flattens two union types into a single type with optional values
// i.e. FlattenUnion<{ a: number, c: number } | { b: string, c: number }> = { a?: number, b?: string, c: number }
export type Flatten<T> = {
   [K in keyof UnionToIntersection<T>]: K extends keyof T
      ? T[K] extends []
         ? T[K]
         : T[K] extends {}
         ? Flatten<T[K]>
         : T[K]
      : UnionToIntersection<T>[K] | undefined;
};

/**
 * Check if an object is of type T by looking for a member inside of it.
 *
 * @param obj The object to check
 * @param memberName: The name of the member the object needs to have in order to be considered of type T
 */
// tslint:disable-next-line: no-any
export function checkTypeByMember<T>(obj: any, memberName: keyof T): obj is T {
   return memberName in obj;
}
