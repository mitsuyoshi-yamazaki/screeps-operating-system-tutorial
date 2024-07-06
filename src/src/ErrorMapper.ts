import { SourceMapConsumer } from "source-map"

const isSimulator = "sim" in Game.rooms
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sourceMapConsumer = new SourceMapConsumer(require("main.js.map"))
const mappedErrorCache: { [key: string]: string } = {}

export const ErrorMapper = {
  wrap<T>(loop: () => T): () => T | null {
    return () => {
      try {
        return loop()
      } catch (rawError) {
        const error = ((): Error => {
          if (rawError instanceof Error) {
            return rawError
          }
          return new Error(`${rawError}`)
        })()

        const outputs: string[] = [
          `${error}`,
        ]
        if (isSimulator === true) {
          if (error.stack != null) {
            outputs.push(error.stack)
          }
        } else {
          outputs.push(sourceMappedStackTrace(error))
        }
        console.log(`<span style='color:red'>${sanitize(outputs.join("\n"))}</span>`)
        return null
      }
    }
  },
}


const sourceMappedStackTrace = (error: Error): string => {
  if (error.stack == null) {
    return ""
  }
  const stack = error.stack
  const cachedResult = mappedErrorCache[stack]
  if (cachedResult != null) {
    return cachedResult
  }

  // eslint-disable-next-line no-useless-escape
  const regex = /^\s+at\s+(.+?\s+)?\(?([0-z._\-\\\/]+):(\d+):(\d+)\)?$/gm
  let match: RegExpExecArray | null
  const results: string[] = []

  while ((match = regex.exec(stack))) {
    const [, fileName, sourceName, lineString, columnString] = match
    const column = parseInt(columnString ?? "", 10)
    const line = parseInt(lineString ?? "", 10)

    if (sourceName === "main" && isNaN(column) !== true && isNaN(line) !== true) {
      const originalPosition = sourceMapConsumer.originalPositionFor({
        column,
        line
      })

      const components: string[] = [
        "at",
      ]

      const name = originalPosition.name ?? fileName
      if (name != null) {
        components.push(name)
      }

      if (originalPosition.line == null) {
        components.push(`(${sourceName}:${line}:${column})`)
      } else {
        components.push(`(${originalPosition.source}:${originalPosition.line}:${originalPosition.column}) [o]`)
      }

      results.push(components.join(" "))

    } else {
      break
    }
  }

  if (results.length <= 0) {
    mappedErrorCache[stack] = stack
    return stack
  }

  const result = results.join("\n")
  mappedErrorCache[stack] = result

  return result
}

const sanitize = (input: string): string => {
  return input.replace(/[&<>"']/g, (match: string): string => {
    switch (match) {
    case "&":
      return "&amp;"
    case "<":
      return "&lt;"
    case ">":
      return "&gt;"
    case '"':
      return "&quot;"
    case "'":
      return "&#39;"
    default:
      return match
    }
  })
}