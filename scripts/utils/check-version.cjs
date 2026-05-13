const fs = require('fs');
const path = require('path');

const main = () => {
  const pkg = require('../../package.json');
  const version = pkg['version'];
  if (!version) throw 'The version property is not set in the package.json file';
  if (typeof version !== 'string') {
    throw `Unexpected type for the package.json version field; got ${typeof version}, expected string`;
  }

  // Get current date in YYYY-MM-DD format
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const versionDate = `${year}-${month}-${day}`;

  const versionFile = path.resolve(__dirname, '../../', 'src', 'version.ts');
  const contents = fs.readFileSync(versionFile, 'utf8');

  // Update VERSION constant
  let output = contents.replace(
    /export const VERSION = '.*?';/,
    `export const VERSION = '${version}';`
  );

  // Update VERSION_DATE constant
  output = output.replace(
    /export const VERSION_DATE = '.*?';/,
    `export const VERSION_DATE = '${versionDate}';`
  );

  fs.writeFileSync(versionFile, output);

  console.log(`Updated version.ts: VERSION='${version}', VERSION_DATE='${versionDate}'`);
};

if (require.main === module) {
  main();
}
