export function u32 (num: number): number {
  return num >>> 0
}

export function toU32Hex (num: number): string {
  const str = u32(num).toString(16).toUpperCase().padStart(8, '0')
  return `0x${str}`
}

export function toMinutes (ms: number): string {
  return (ms / 1000 / 60).toFixed(1)
}
