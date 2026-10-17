const fs = require('fs');
const path = require('path');

const typebotPath = path.join(__dirname, 'typebot-pilates.json');
const raw = fs.readFileSync(typebotPath, 'utf8');
const data = JSON.parse(raw);

console.log('--- TYPEBOT VALIDATION REPORT ---');
console.log('Version:', data.version);
console.log('Name:', data.name);
console.log('Total groups:', data.groups.length);
console.log('Total edges:', data.edges.length);
console.log('Total variables:', data.variables.length);

const groupIds = new Set(data.groups.map(g => g.id));
const blockIds = new Set();
const itemIds = new Set();

data.groups.forEach(g => {
  g.blocks.forEach(b => {
    blockIds.add(b.id);
    if (b.items) {
      b.items.forEach(it => itemIds.add(it.id));
    }
  });
});

console.log('Total blocks:', blockIds.size);
console.log('Total choice items:', itemIds.size);

let brokenEdges = 0;
data.edges.forEach(e => {
  if (e.to && e.to.groupId && !groupIds.has(e.to.groupId)) {
    console.error('Broken destination groupId in edge:', e.id, e.to.groupId);
    brokenEdges++;
  }
  if (e.to && e.to.blockId && !blockIds.has(e.to.blockId)) {
    console.error('Broken destination blockId in edge:', e.id, e.to.blockId);
    brokenEdges++;
  }
  if (e.from && e.from.blockId && !blockIds.has(e.from.blockId)) {
    console.error('Broken source blockId in edge:', e.id, e.from.blockId);
    brokenEdges++;
  }
  if (e.from && e.from.itemId && !itemIds.has(e.from.itemId)) {
    console.error('Broken source itemId in edge:', e.id, e.from.itemId);
    brokenEdges++;
  }
});

if (brokenEdges === 0) {
  console.log('✅ ALL EDGES & REFERENCES ARE 100% VALID!');
} else {
  console.error(`❌ Found ${brokenEdges} broken edges!`);
}

// Check if Step 14 has wait block
const g14 = data.groups.find(g => g.id === 'group_14');
const hasWait = g14 && g14.blocks.some(b => b.type === 'Wait' && b.options?.secondsToWaitFor >= 2);
console.log('Step 14 Wait verified:', hasWait ? '✅ YES' : '❌ NO');

// Check if Step 17 has Checkout redirect (Zuptos)
const g17 = data.groups.find(g => g.id === 'group_17');
const hasRedirect = g17 && g17.blocks.some(b => b.type === 'Redirect' && (b.options?.url?.includes('zuptos') || b.options?.url?.includes('wiapy') || b.options?.url?.includes('payt')));
console.log('Step 17 Zuptos Redirect verified:', hasRedirect ? '✅ YES' : '❌ NO');
