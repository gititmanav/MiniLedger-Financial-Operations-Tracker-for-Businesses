import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
        fetch: "readonly",
        document: "readonly",
        window: "readonly",
        alert: "readonly",
        FormData: "readonly",
        URL: "readonly",
        history: "readonly",
        location: "readonly",
        HTMLElement: "readonly",
        Event: "readonly",
        customElements: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      semi: ["error", "always"],
      quotes: ["error", "double"],
    },
  },
];