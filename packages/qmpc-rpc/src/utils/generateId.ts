const hex = () => ((Math.random() * 0xff) & 0x0f).toString(16).toUpperCase();

export function generateId(n: number): string {
  let result = '';
  while (n-- > 0) {
    result += hex();
  }
  return result;
}
