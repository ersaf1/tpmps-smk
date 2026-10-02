import js from "@eslint/js";
import ts from "typescript-eslint";
export default ts.config(
  { ignores: ["**/.next/**", "**/dist/**", "**/next-env.d.ts"] },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    languageOptions: {
      globals: {
        process: "readonly",
        console: "readonly",
        Buffer: "readonly",
        URL: "readonly",
        fetch: "readonly",
        AbortSignal: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        requestAnimationFrame: "readonly",
        XMLHttpRequest: "readonly",
        FormData: "readonly",
        File: "readonly",
        Blob: "readonly",
        crypto: "readonly",
        navigator: "readonly",
      },
    },
    rules: { "@typescript-eslint/no-explicit-any": "off" },
  },
);
