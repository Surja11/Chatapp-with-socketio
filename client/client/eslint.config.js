// eslint.config.js
import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginPrettier from "eslint-plugin-prettier";
import babelParser from "@babel/eslint-parser";

export default defineConfig([
    {
        files: ["**/*.{js,jsx}"],

        languageOptions: {
            parser: babelParser,
            parserOptions: {
                requireConfigFile: false, // no babel.config.js needed
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true,
                },
                babelOptions: {
                    plugins: ["@babel/plugin-syntax-jsx"],
                },
            },
            globals: globals.browser,
        },

        plugins: {
            react: pluginReact,
            prettier: pluginPrettier,
        },

        rules: {
            "react/react-in-jsx-scope": "off",
            "prettier/prettier": "error",
        },
    },
]);
