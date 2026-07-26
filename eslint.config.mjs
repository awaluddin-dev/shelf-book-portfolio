import { defineConfig } from "eslint/config";
import next from "eslint-config-next";
import sonarjs from "eslint-plugin-sonarjs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([
    sonarjs.configs.recommended,
    {
        extends: [...next],
        rules: {
            "@next/next/no-img-element": "off"
        }
    }
]);
