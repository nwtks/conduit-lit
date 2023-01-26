import minifyHTML from "rollup-plugin-minify-html-literals";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/index.js",
  output: { dir: "dist", entryFileNames: "conduit-lit.js" },
  preserveEntrySignatures: "strict",
  plugins: [minifyHTML(), terser()],
};
