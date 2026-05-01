export function redactSensitiveText(input: string) {
  return input
    .replace(/1[3-9]\d{9}/g, "[已脱敏手机号]")
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, "[已脱敏邮箱]");
}
