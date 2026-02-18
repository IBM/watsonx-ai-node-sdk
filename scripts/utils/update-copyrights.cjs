const fs = require('fs');
const path = require('path');
const srcDir = path.resolve(__dirname, '../../src/');
const { spawnSync } = require('child_process');
// Valid source file extensions to process
const VALID_EXTENSIONS = ['.ts', '.js', '.tsx', '.jsx'];

const currentYear = new Date().getFullYear();
let modifiedCount = 0;
let errorCount = 0;
let pathsCount = 0;

const modifyCopyrights = (filePath) => {
  pathsCount++;
  try {
    const originalContent = fs.readFileSync(filePath, 'utf8');
    let content = originalContent;
    let hasMatch = false;

    content = content.replace(/Copyright IBM Corp. (\d{4})(?:-(\d{4}))?/g, (_match, startYear) => {
      hasMatch = true;
      const date = spawnSync(
        'git',
        ['log', '--diff-filter=A', '--follow', '--format=%ad', '--date=short', '--', filePath],
        { encoding: 'utf8' }
      )
        .stdout.trim()
        .split('-')[0];

      return Number(date) !== currentYear
        ? `Copyright IBM Corp. ${date}-${currentYear}`
        : `Copyright IBM Corp. ${currentYear}`;
    });

    if (!hasMatch) {
      content =
        `/**
 * (C) Copyright IBM Corp. ${currentYear}.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

` + content;
    }

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      modifiedCount++;
      console.log(`Updated: ${path.relative(srcDir, filePath)}`);
    }
  } catch (err) {
    errorCount++;
    console.error(`Error processing ${filePath}: ${err.message}`);
  }
};

const readAllFilesPath = (currDir) => {
  try {
    const content = fs.readdirSync(currDir);
    content.forEach((nextPath) => {
      const nextFullPath = path.join(currDir, '/', nextPath);
      try {
        if (fs.statSync(nextFullPath).isDirectory()) {
          readAllFilesPath(nextFullPath);
        } else {
          const ext = path.extname(nextFullPath);
          if (VALID_EXTENSIONS.includes(ext)) {
            modifyCopyrights(nextFullPath);
          }
        }
      } catch (err) {
        console.warn(`Warning: Could not access ${nextFullPath}: ${err.message}`);
      }
    });
  } catch (err) {
    console.warn(`Warning: Could not read directory ${currDir}: ${err.message}`);
  }
};
readAllFilesPath(srcDir);

console.log(`\nUpdate Copyrights Complete!`);
console.log(`Files processed: ${pathsCount}`);
console.log(`Files modified: ${modifiedCount}`);
if (errorCount > 0) {
  console.log(`Errors encountered: ${errorCount}`);
  process.exit(1);
}
