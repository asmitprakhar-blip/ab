import fs from 'fs';

const files = ['index.html', 'menu.html', 'plans.html', 'contact.html', 'about.html'];

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        // Consolidate fonts and dark mode tags - since we already added Josefin Sans, 
        // let's just make it consistent.

        // Ensure every page has the correct body classes for dark mode and sans font
        content = content.replace(/<body[^>]*>/, '<body class="bg-zinc-950 text-slate-100 font-sans overflow-x-hidden transition-colors duration-300">');

        // Fix the nav links if they were pointing to # (except those on index)
        if (file !== 'index.html') {
            content = content.replace(/href=\"index\.html#testimonials\"/g, 'href=\"index.html#testimonials\"');
        }

        // Add a "View My Orders" button or something in the nav? No, let's keep it simple.

        fs.writeFileSync(file, content);
    }
});
console.log('Final page consistency check done.');
