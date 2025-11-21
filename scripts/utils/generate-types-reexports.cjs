const fs = require('fs');
const path = require('path');

(async () => {
  const mainFile = path.resolve(__dirname, '../../src/vml_v1.ts');
  const typesFile = path.resolve(__dirname, '../../src/types/types.ts');

  const [mainContent, typesContent] = await Promise.all([
    fs.promises.readFile(mainFile, 'utf-8'),
    fs.promises.readFile(typesFile, 'utf-8'),
  ]);

  // --- Extract exported types/namespaces from types.ts ---
  const typeMatches = [...typesContent.matchAll(/^export (?:interface|type) (\w+)/gm)];
  const nsMatches = [...typesContent.matchAll(/^export namespace (\w+)/gm)];
  const allNames = [...new Set([...typeMatches, ...nsMatches].map((m) => m[1]))];

  // --- Find existing auto-generated block ---
  const startMarker = '// === AUTO-GENERATED TYPES START ===';
  const endMarker = '// === AUTO-GENERATED TYPES END ===';
  const blockRegex = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`);

  let updatedBlock = '';
  let existingNames = [];

  const existingBlockMatch = mainContent.match(blockRegex);

  if (existingBlockMatch) {
    // Extract all existing reimports (e.g., `export import X = Types.X;`)
    existingNames = [...existingBlockMatch[0].matchAll(/export import (\w+) = Types\.\1;/g)].map(
      (m) => m[1]
    );
  }

  const existingSet = new Set(existingNames);

  // --- Only add new types/namespaces not already present ---
  const newNames = allNames.filter((n) => !existingSet.has(n));
  const finalNames = [...existingNames, ...newNames];

  // --- Build the final auto-generated block ---
  const namespaceLines = [
    '  // === AUTO-GENERATED TYPES START ===',
    '  // DO NOT EDIT BELOW',
    ...finalNames.map((name) => `  export import ${name} = Types.${name};`),
    '  // === AUTO-GENERATED TYPES END ===',
  ];
  updatedBlock = namespaceLines.join('\n');

  let updatedContent;
  if (existingBlockMatch) {
    // Replace existing block safely
    updatedContent = mainContent.replace(blockRegex, updatedBlock);
  } else {
    // Insert block inside existing namespace if not found
    updatedContent = mainContent.replace(
      /export namespace WatsonxAiMlVml_v1\s*{([\s\S]*?)}/,
      (match, inner) => {
        return `export namespace WatsonxAiMlVml_v1 {\n${inner.trimEnd()}\n\n${updatedBlock}\n}`;
      }
    );
  }

  await fs.promises.writeFile(mainFile, updatedContent, 'utf-8');

  console.log(
    `✅ Updated namespace with ${finalNames.length} total reimports (${newNames.length} new added).`
  );
})();
