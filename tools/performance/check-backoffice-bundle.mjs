import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { gzipSync } from "node:zlib";

const projectRoot = resolve(
  import.meta.dirname,
  "..",
  ".."
);
const distDir = join(projectRoot, "apps", "backoffice-pwa", "dist");
const indexHtmlPath = join(distDir, "index.html");

const MAX_INITIAL_JS_GZIP_BYTES = 400 * 1024;
const MAX_INITIAL_CSS_GZIP_BYTES = 16 * 1024;
const DISALLOWED_INITIAL_CHUNK_PATTERNS = [
  /pdf-vendor/i,
  /forms-vendor/i,
  /query-vendor/i,
  /feedback-vendor/i,
  /icons-vendor/i
];

function toKilobytes(bytes) {
  return `${(bytes / 1024).toFixed(2)} kB`;
}

function getGzipSize(filePath) {
  const fileBuffer = readFileSync(filePath);

  return gzipSync(fileBuffer).byteLength;
}

function collectAssetPaths(indexHtml, extension) {
  const matches = indexHtml.matchAll(
    new RegExp(`(?:src|href)=\"([^\"]+\\.${extension})\"`, "g")
  );

  return [
    ...new Set(
      Array.from(matches, ([, assetPath]) => assetPath)
    )
  ];
}

function toDiskPath(assetPath) {
  const normalizedAssetPath = assetPath.startsWith("/")
    ? assetPath.slice(1)
    : assetPath;

  return join(distDir, normalizedAssetPath);
}

function formatAssetList(assets) {
  return assets.map((asset) => asset.replace(/^\/?assets\//, "")).join(", ");
}

const indexHtml = readFileSync(indexHtmlPath, "utf8");
const initialJsAssets = collectAssetPaths(indexHtml, "js");
const initialCssAssets = collectAssetPaths(indexHtml, "css");

const initialJsGzipBytes = initialJsAssets.reduce(
  (total, assetPath) => total + getGzipSize(toDiskPath(assetPath)),
  0
);
const initialCssGzipBytes = initialCssAssets.reduce(
  (total, assetPath) => total + getGzipSize(toDiskPath(assetPath)),
  0
);

const disallowedInitialAssets = initialJsAssets.filter((assetPath) =>
  DISALLOWED_INITIAL_CHUNK_PATTERNS.some((pattern) => pattern.test(assetPath))
);

const errors = [];

if (initialJsGzipBytes > MAX_INITIAL_JS_GZIP_BYTES) {
  errors.push(
    `Initial JS gzip budget exceeded: ${toKilobytes(initialJsGzipBytes)} > ${toKilobytes(MAX_INITIAL_JS_GZIP_BYTES)}.`
  );
}

if (initialCssGzipBytes > MAX_INITIAL_CSS_GZIP_BYTES) {
  errors.push(
    `Initial CSS gzip budget exceeded: ${toKilobytes(initialCssGzipBytes)} > ${toKilobytes(MAX_INITIAL_CSS_GZIP_BYTES)}.`
  );
}

if (disallowedInitialAssets.length > 0) {
  errors.push(
    `Disallowed chunks were preloaded on first paint: ${formatAssetList(disallowedInitialAssets)}.`
  );
}

console.log("Backoffice bundle check");
console.log(`- Initial JS gzip: ${toKilobytes(initialJsGzipBytes)}`);
console.log(`- Initial CSS gzip: ${toKilobytes(initialCssGzipBytes)}`);
console.log(`- Initial JS assets: ${formatAssetList(initialJsAssets)}`);

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exit(1);
}

console.log("- Bundle budgets passed.");
