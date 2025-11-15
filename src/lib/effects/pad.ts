interface PadOptions {
  x?: number // horizontal padding
  y?: number // vertical padding
}

export function pad(str: string, { x = 0, y = 0 }: PadOptions = {}): string {
  const lines = str.split("\n")
  const padX = " ".repeat(x)
  const paddedLines = lines.map(line => padX + line + padX)
  const padY = "\n".repeat(y)
  return padY + paddedLines.join("\n") + padY
}
