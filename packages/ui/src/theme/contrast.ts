function normalizeHex(hex: string) {
  const value = hex.replace("#", "").trim();

  if (value.length === 3) {
    return value
      .split("")
      .map((character) => `${character}${character}`)
      .join("");
  }

  return value;
}

function channelToLinear(channel: number) {
  const srgb = channel / 255;

  if (srgb <= 0.03928) {
    return srgb / 12.92;
  }

  return ((srgb + 0.055) / 1.055) ** 2.4;
}

export function getRelativeLuminance(hex: string) {
  const value = normalizeHex(hex);
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);

  return (
    0.2126 * channelToLinear(red) +
    0.7152 * channelToLinear(green) +
    0.0722 * channelToLinear(blue)
  );
}

export function getContrastRatio(foreground: string, background: string) {
  const foregroundLuminance = getRelativeLuminance(foreground);
  const backgroundLuminance = getRelativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

export function formatContrastRatio(ratio: number) {
  return `${ratio.toFixed(1)}:1`;
}

export function meetsAaContrast(ratio: number, largeText = false) {
  return ratio >= (largeText ? 3 : 4.5);
}

export function pickBestContrastColor(
  background: string,
  darkCandidate = "#201914",
  lightCandidate = "#ffffff"
) {
  const darkRatio = getContrastRatio(darkCandidate, background);
  const lightRatio = getContrastRatio(lightCandidate, background);

  return darkRatio >= lightRatio ? darkCandidate : lightCandidate;
}
