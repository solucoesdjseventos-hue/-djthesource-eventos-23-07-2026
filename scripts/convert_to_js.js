const fs = require("fs");
const path = require("path");

const roots = [
  path.join(__dirname, "..", "src"),
  path.join(__dirname, "..", "client", "src"),
];
const skipNames = ["vite-env.d.ts"];

const replacements = [
  { pattern: /^import type .*\n?/gm, replace: "" },
  {
    pattern: /\bimport \{\s*type\s+([^}]+)\s*\}\s*from\s*['"][^'"]+['"];?/gm,
    replace: "import { $1 } from $2;",
  },
  { pattern: /\bexport\s+type\s+\w+\s*=\s*\{[\s\S]*?\};?/gm, replace: "" },
  { pattern: /\btype\s+\w+\s*=\s*\{[\s\S]*?\};?/gm, replace: "" },
  { pattern: /\bexport\s+interface\s+\w+\s*\{[\s\S]*?\}/gm, replace: "" },
  { pattern: /\binterface\s+\w+\s*\{[\s\S]*?\}/gm, replace: "" },
  { pattern: /useState<[^>]+>/g, replace: "useState" },
  { pattern: /useParams<[^>]+>\(\)/g, replace: "useParams()" },
  { pattern: /React\.FormEvent<[^>]+>/g, replace: "React.FormEvent" },
  { pattern: /<[^>]+>\(/g, replace: "(" },
  { pattern: /\s+as\s+[^\s;\)]+/g, replace: "" },
  { pattern: /:\s*[^=;,)]+(?=[,\)\];])/g, replace: "" },
  {
    pattern:
      /import\s+\{\s*createClient\s*\}\s+from\s+['"]@supabase\/supabase-js['"];/g,
    replace: "import { createClient } from '@supabase/supabase-js';",
  },
  { pattern: /\.tsx/g, replace: ".jsx" },
  { pattern: /\.ts/g, replace: ".js" },
];

function processFile(filePath) {
  let source = fs.readFileSync(filePath, "utf8");
  replacements.forEach(({ pattern, replace }) => {
    source = source.replace(pattern, replace);
  });
  source = source.replace(/\n{3,}/g, "\n\n");
  source = source.replace(/\n\s*\n\s*\n/g, "\n\n");
  fs.writeFileSync(filePath, source, "utf8");
  const targetPath = filePath.replace(
    /\.tsx?$/,
    filePath.endsWith(".tsx") ? ".jsx" : ".js",
  );
  fs.renameSync(filePath, targetPath);
  console.log(`Converted ${filePath} -> ${targetPath}`);
}

function walk(root) {
  if (!fs.existsSync(root)) return;
  const entries = fs.readdirSync(root, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (/\.tsx?$/.test(entry.name) && !skipNames.includes(entry.name)) {
      processFile(fullPath);
    }
  }
}

for (const root of roots) {
  walk(root);
}

// Convert Vite config files and tsconfig files
const extraFiles = [
  path.join(__dirname, "..", "vite.config.ts"),
  path.join(__dirname, "..", "client", "vite.config.ts"),
  path.join(__dirname, "..", "tsconfig.json"),
  path.join(__dirname, "..", "client", "tsconfig.json"),
  path.join(__dirname, "..", "src", "vite-env.d.ts"),
  path.join(__dirname, "..", "client", "src", "vite-env.d.ts"),
];

for (const filePath of extraFiles) {
  if (!fs.existsSync(filePath)) continue;
  if (filePath.endsWith(".ts") && filePath.includes("vite.config")) {
    let source = fs.readFileSync(filePath, "utf8");
    source = source.replace(
      /import \{ defineConfig \} from \"vite\";/g,
      "const { defineConfig } = require('vite');",
    );
    source = source.replace(
      /import react from \"@vitejs\/plugin-react\";/g,
      "const react = require('@vitejs/plugin-react');",
    );
    source = source.replace(
      /export default defineConfig\(/g,
      "module.exports = defineConfig(",
    );
    const targetPath = filePath.replace(/\.ts$/, ".js");
    fs.writeFileSync(targetPath, source, "utf8");
    fs.unlinkSync(filePath);
    console.log(`Converted ${filePath} -> ${targetPath}`);
  } else if (
    filePath.endsWith("tsconfig.json") ||
    filePath.endsWith("vite-env.d.ts")
  ) {
    fs.unlinkSync(filePath);
    console.log(`Removed ${filePath}`);
  }
}
