/** Single-line JSON on stdout for Hermes / automation. Logs go to stderr. */
export function emitToolResult(data: unknown, exitCode = 0): never {
  process.stdout.write(`${JSON.stringify(data)}\n`)
  process.exit(exitCode)
}

export function emitToolError(
  message: string,
  extra?: Record<string, unknown>,
): never {
  emitToolResult({ ok: false, error: message, ...extra }, 1)
}
