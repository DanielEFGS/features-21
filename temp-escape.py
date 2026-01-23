from pathlib import Path

path = Path('src/app/features/labs/demos/style-guide-demo/style-guide-demo.ts')
text = path.read_text()
escaped = text.replace('`', '\\`').replace('${', '\\${')
print(escaped)
