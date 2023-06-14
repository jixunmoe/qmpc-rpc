const fs = require('node:fs');

function patchFile(filepath) {
  const script = fs.readFileSync(filepath, 'utf-8');
  fs.writeFileSync(filepath, `#!/usr/bin/env node\n${script}`, 'utf-8');
  fs.chmodSync(filepath, '0755');
}

patchFile(__dirname + '/../dist/qmpc-cli.cjs');
