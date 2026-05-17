const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Prefer CommonJS entries over ESM for packages whose ESM build uses `import.meta`
// (e.g. zustand 4.5+). Without this Metro picks the `module`/`import` condition on web
// and emits import.meta into a classic <script>, which is a SyntaxError in the browser.
config.resolver.unstable_conditionNames = ["require", "react-native", "browser"];

module.exports = withNativeWind(config, { input: "./global.css" });
