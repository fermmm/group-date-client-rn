export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

// Converts a union of two types into an intersection 
// i.e. A | B -> A & B
export type UnionToIntersection<U> = 
   (U extends {} ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never; 

// Flattens two union types into a single type with optional values
// i.e. FlattenUnion<{ a: number, c: number } | { b: string, c: number }> = { a?: number, b?: string, c: number }
export type Flatten<T> = {
   [K in keyof UnionToIntersection<T>]: K extends keyof T ?
   T[K] extends [] ? T[K]
   : T[K] extends {} ? Flatten<T[K]>
   : T[K]
   : UnionToIntersection<T>[K] | undefined
};
