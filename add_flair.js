import fs from 'fs';

const files = ['index.html', 'menu.html', 'plans.html', 'contact.html', 'about.html'];

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        // Stronger Font reinforcement
        const styleTag = `\n  <style>\n    * { font-family: 'Josefin Sans', sans-serif !important; font-display: swap; }\n    .font-cursive { font-family: 'Caveat', cursive !important; }\n    h1, h2, h3, button, input, textarea { font-family: 'Josefin Sans', sans-serif !important; }\n  </style>\n`;

        // Remove existing style reinforcement if present to avoid duplicates
        content = content.replace(/<style>[\s\S]*?font-family: 'Josefin Sans'[\s\S]*?<\/style>/g, '');

        content = content.replace('</head>', styleTag + '</head>');

        fs.writeFileSync(file, content);
    }
});
console.log('Font reinforcement updated.');
