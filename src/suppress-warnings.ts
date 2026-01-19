// Suppress punycode and url.parse deprecation warnings
const originalEmit = process.emit;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
process.emit = function (name: any, data: any, ...args: any[]): boolean {
  if (
    name === "warning" &&
    typeof data === "object" &&
    data &&
    data.name === "DeprecationWarning" &&
    data.message &&
    (data.message.includes("punycode") || data.message.includes("url.parse"))
  ) {
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  return (originalEmit as Function).apply(process, [name, data, ...args]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;
