export function timeoutAsync(ms: number): Promise<void> {
   return new Promise(resolve => setTimeout(resolve, ms));
}
