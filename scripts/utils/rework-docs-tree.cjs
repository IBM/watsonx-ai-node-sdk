const fs = require('fs');

const encoding = 'utf-8';
const path = process.argv[2];

const obj = JSON.parse(fs.readFileSync(path, encoding));
const defaultItemIndex = obj.children.findIndex((item) => item.name === 'default');

if (defaultItemIndex > -1) {
  const [dropped] = obj.children.splice(defaultItemIndex, 1);
  obj.children.push(...dropped.children);
}

fs.writeFileSync(path, JSON.stringify(obj, null, 2), encoding);
