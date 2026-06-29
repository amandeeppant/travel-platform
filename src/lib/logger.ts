function formatMeta(meta: unknown) {
  if (meta == null) return "";
  if (typeof meta === "string") return ` ${meta}`;
  try {
    return ` ${JSON.stringify(meta)}`;
  } catch {
    return " [unserializable meta]";
  }
}

function formatMessage(level: string, message: string, meta?: unknown) {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level}] ${message}${formatMeta(meta)}`;
}

export const logger = {
  info(message: string, meta?: unknown) {
    console.info(formatMessage("INFO", message, meta));
  },
  warn(message: string, meta?: unknown) {
    console.warn(formatMessage("WARN", message, meta));
  },
  error(message: string, meta?: unknown) {
    console.error(formatMessage("ERROR", message, meta));
  },
};
