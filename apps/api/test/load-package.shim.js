/**
 * CJS stand-in for @nestjs/common/utils/load-package.util.js, which uses
 * `import.meta` and cannot be transformed to CommonJS by ts-jest.
 * Mapped via Jest moduleNameMapper while running Nest 12 (ESM) under Jest.
 */
const packageCache = new Map();

async function loadPackage(packageName, context, loaderFn) {
  const cached = packageCache.get(packageName);
  if (cached) {
    return cached;
  }
  try {
    const pkg = loaderFn ? await loaderFn() : require(packageName);
    packageCache.set(packageName, pkg);
    return pkg;
  } catch {
    throw new Error(`The "${packageName}" package is missing (${context}).`);
  }
}

function loadPackageSync(packageName, context, loaderFn) {
  const cached = packageCache.get(packageName);
  if (cached) {
    return cached;
  }
  try {
    const pkg = loaderFn ? loaderFn() : require(packageName);
    packageCache.set(packageName, pkg);
    return pkg;
  } catch {
    throw new Error(`The "${packageName}" package is missing (${context}).`);
  }
}

function loadPackageCached(packageName) {
  const cached = packageCache.get(packageName);
  if (!cached) {
    throw new Error(`Package "${packageName}" has not been loaded yet.`);
  }
  return cached;
}

async function tryLoadPackage(packageName, loaderFn) {
  const cached = packageCache.get(packageName);
  if (cached) {
    return cached;
  }
  try {
    const pkg = loaderFn ? await loaderFn() : require(packageName);
    packageCache.set(packageName, pkg);
    return pkg;
  } catch {
    return null;
  }
}

module.exports = {
  loadPackage,
  loadPackageSync,
  loadPackageCached,
  tryLoadPackage,
};
