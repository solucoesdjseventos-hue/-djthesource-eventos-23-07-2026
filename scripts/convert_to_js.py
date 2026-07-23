import os
import re

root = os.path.join(os.path.dirname(__file__), "..", "src")

patterns = [
    (re.compile(r"^import type .*\n", flags=re.MULTILINE), ""),
    (re.compile(r"\bexport\s+type\s+\w+\s*=\s*\{[^}]*\};?", flags=re.DOTALL), ""),
    (re.compile(r"\btype\s+\w+\s*=\s*\{[^}]*\};?", flags=re.DOTALL), ""),
    (re.compile(r"\bexport\s+interface\s+\w+\s*\{[^}]*\}", flags=re.DOTALL), ""),
    (re.compile(r"\binterface\s+\w+\s*\{[^}]*\}", flags=re.DOTALL), ""),
    (re.compile(r"useState<[^>]+>"), "useState"),
    (re.compile(r"useParams<[^>]+>\(\)"), "useParams()"),
    (re.compile(r"React\.FormEvent<[^>]+>"), "React.FormEvent"),
    (re.compile(r"\bconst\s+(\w+)\s*:\s*[^=;]+\s*=\s*"), r"const \1 = "),
    (re.compile(r"\blet\s+(\w+)\s*:\s*[^=;]+\s*=\s*"), r"let \1 = "),
    (re.compile(r"\bvar\s+(\w+)\s*:\s*[^=;]+\s*=\s*"), r"var \1 = "),
    (re.compile(r"\bconst\s+(\w+)\s*:\s*[^;]+;"), r"const \1;"),
    (re.compile(r"\blet\s+(\w+)\s*:\s*[^;]+;"), r"let \1;"),
    (re.compile(r"\bvar\s+(\w+)\s*:\s*[^;]+;"), r"var \1;"),
    (re.compile(r"function\s+(\w+)\s*\(([^)]*)\)\s*:\s*[^\s{]+"), r"function \1(\2)"),
    (re.compile(r"\)\s*:\s*[^\s{]+\s*\{"), ") {"),
    (re.compile(r"\s+as\s+[^\s;\)]+"), ""),
    (re.compile(r"\s*:\s*[^=;\),]+(?=[\),;])"), ""),
]

for dirpath, _, filenames in os.walk(root):
    for filename in filenames:
        if filename in ("vite-env.d.ts",):
            continue
        if filename.endswith((".ts", ".tsx")):
            path = os.path.join(dirpath, filename)
            with open(path, "r", encoding="utf-8") as f:
                source = f.read()
            result = source
            for pattern, repl in patterns:
                result = pattern.sub(repl, result)
            # Remove excess blank lines from type removal
            result = re.sub(r"\n{3,}", "\n\n", result)
            target = path[:-3] + (".jsx" if filename.endswith(".tsx") else ".js")
            with open(target, "w", encoding="utf-8") as f:
                f.write(result)
            os.remove(path)
            print(f"Converted {path} -> {target}")

# Convert vite config if ts
vite_path = os.path.join(os.path.dirname(__file__), "..", "vite.config.ts")
if os.path.exists(vite_path):
    with open(vite_path, "r", encoding="utf-8") as f:
        cfg = f.read()
    cfg = cfg.replace(
        'import { defineConfig } from "vite";\nimport react from "@vitejs/plugin-react";\n',
        "const { defineConfig } = require('vite');\nconst react = require('@vitejs/plugin-react');\n",
    )
    cfg = cfg.replace("export default defineConfig(", "module.exports = defineConfig(")
    js_path = vite_path[:-3] + ".js"
    with open(js_path, "w", encoding="utf-8") as f:
        f.write(cfg)
    os.remove(vite_path)
    print(f"Converted {vite_path} -> {js_path}")

# Remove tsconfig and vite-env if present
for extra in ["tsconfig.json", os.path.join(root, "vite-env.d.ts")]:
    if os.path.exists(extra):
        os.remove(extra)
        print(f"Removed {extra}")
