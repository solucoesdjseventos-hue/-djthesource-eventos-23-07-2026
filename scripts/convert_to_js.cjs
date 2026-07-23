const fs = require("fs");
const path = require("path");

const roots = [path.join(process.cwd(), "src")];
const skipNames = ["vite-env.d.ts"];

const replacements = [
  { pattern: /^import type .*\n?/gm, replace: "" },
  {
    pattern: /\bimport \{\s*type\s+([^}]+)\s*\}\s*from\s*(['"][^'"]+['"]);?/gm,
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
  { pattern: /:\s*[^=;,)\]]+(?=[,;\)\]])/g, replace: "" },
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
  const targetPath = filePath.replace(
    /\.tsx?$/,
    filePath.endsWith(".tsx") ? ".jsx" : ".js",
  );
  fs.writeFileSync(filePath, source, "utf8");
  if (targetPath !== filePath) {
    fs.renameSync(filePath, targetPath);
    console.log(`Converted ${filePath} -> ${targetPath}`);
  } else {
    console.log(`Processed ${filePath}`);
  }
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

const convertVite = (baseDir) => {
  const vitePath = path.join(baseDir, "vite.config.ts");
  if (!fs.existsSync(vitePath)) return;
  let source = fs.readFileSync(vitePath, "utf8");
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
  const targetPath = vitePath.replace(/\.ts$/, ".js");
  fs.writeFileSync(targetPath, source, "utf8");
  fs.unlinkSync(vitePath);
  console.log(`Converted ${vitePath} -> ${targetPath}`);
};

convertVite(process.cwd());

const removeFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`Removed ${filePath}`);
  }
};

removeFile(path.join(process.cwd(), "tsconfig.json"));
removeFile(path.join(process.cwd(), "src", "vite-env.d.ts"));

const updatePkg = (filePath) => {
  if (!fs.existsSync(filePath)) return;
  const pkg = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (pkg.scripts && pkg.scripts.build === "tsc && vite build") {
    pkg.scripts.build = "vite build";
    console.log(`Updated build script in ${filePath}`);
  }
  if (pkg.devDependencies) {
    ["typescript", "@types/react", "@types/react-dom"].forEach((dep) => {
      if (pkg.devDependencies[dep]) {
        delete pkg.devDependencies[dep];
        console.log(`Removed devDependency ${dep} from ${filePath}`);
      }
    });
  }
  fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
};

updatePkg(path.join(process.cwd(), "package.json"));
console.log("Conversion complete.");
