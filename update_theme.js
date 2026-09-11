const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'staff_panel', 'src', 'pages');

const replacements = [
  // Text Colors
  { regex: /text-slate-900/g, replacement: 'text-maroon-darker' },
  { regex: /text-slate-800/g, replacement: 'text-maroon-darker' },
  { regex: /text-slate-700/g, replacement: 'text-maroon-darker/80' },
  { regex: /text-slate-600/g, replacement: 'text-maroon-darker/70' },
  { regex: /text-slate-500/g, replacement: 'text-maroon-darker/60' },
  { regex: /text-slate-400/g, replacement: 'text-maroon-darker/40' },
  
  // Background Colors
  { regex: /bg-slate-50/g, replacement: 'bg-premium' },
  { regex: /bg-slate-100/g, replacement: 'bg-gold/10' },
  
  // Border Colors
  { regex: /border-slate-100/g, replacement: 'border-gold/20' },
  { regex: /border-slate-200/g, replacement: 'border-gold/20' },
  { regex: /border-slate-300/g, replacement: 'border-gold/30' },
  { regex: /border-slate-800/g, replacement: 'border-gold/20' },
  
  // Brand Colors (Blue to Maroon/Gold)
  { regex: /text-blue-600/g, replacement: 'text-maroon' },
  { regex: /text-blue-500/g, replacement: 'text-maroon' },
  { regex: /text-indigo-600/g, replacement: 'text-maroon-darker' },
  { regex: /text-indigo-500/g, replacement: 'text-maroon-darker' },
  
  { regex: /bg-blue-50/g, replacement: 'bg-maroon/5' },
  { regex: /bg-blue-100/g, replacement: 'bg-maroon/10' },
  { regex: /bg-blue-500/g, replacement: 'bg-maroon' },
  { regex: /bg-blue-600/g, replacement: 'bg-maroon-darker' },
  { regex: /bg-indigo-500/g, replacement: 'bg-maroon-darker' },
  { regex: /bg-indigo-600/g, replacement: 'bg-maroon-darker' },
  
  // Rings
  { regex: /ring-blue-500/g, replacement: 'ring-maroon' },
  
  // Gradients
  { regex: /from-blue-500 to-indigo-500/g, replacement: 'from-maroon to-maroon-darker' },
  { regex: /from-blue-600 to-indigo-600/g, replacement: 'from-maroon-darker to-maroon-darker' },
  
  // Hover states (Text)
  { regex: /hover:text-blue-500/g, replacement: 'hover:text-maroon' },
  { regex: /hover:text-blue-600/g, replacement: 'hover:text-maroon' },
  { regex: /hover:text-blue-700/g, replacement: 'hover:text-maroon-darker' },
  { regex: /hover:text-slate-800/g, replacement: 'hover:text-maroon-darker' },
  { regex: /hover:text-slate-900/g, replacement: 'hover:text-maroon-darker' },
  { regex: /hover:text-slate-700/g, replacement: 'hover:text-maroon-darker' },
  
  // Hover states (BG)
  { regex: /hover:bg-slate-50/g, replacement: 'hover:bg-premium' },
  { regex: /hover:bg-slate-100/g, replacement: 'hover:bg-gold/10' },
  { regex: /hover:bg-blue-50/g, replacement: 'hover:bg-maroon/10' },
  { regex: /hover:bg-blue-600/g, replacement: 'hover:bg-maroon-darker' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      if (['Dashboard.jsx', 'Login.jsx', 'Settings.jsx'].includes(file)) continue;

      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;

      for (const rule of replacements) {
        content = content.replace(rule.regex, rule.replacement);
      }
      
      content = content.replace(/dark:[^\s"']+/g, '');

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(directoryPath);
console.log('Theme update complete!');
