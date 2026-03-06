import fs from 'fs';

const files = ['index.html', 'menu.html', 'plans.html', 'contact.html', 'about.html'];

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        // Remove old theme toggle logic and add Josefin Sans font
        content = content.replace(
            /<script>try \{ if \(localStorage\.getItem\('theme'\).*?<\/script>/s,
            `<script>document.documentElement.classList.add('dark');</script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">`
        );

        // Hardcode dark mode into html tag
        content = content.replace(/<html lang="en" class="scroll-smooth">/, '<html lang="en" class="scroll-smooth dark">');
        content = content.replace(/<html class="scroll-smooth dark" lang="en">/, '<html lang="en" class="scroll-smooth dark">');

        // Remove the theme toggle button if it exists
        content = content.replace(/<button id="theme-toggle"[\s\S]*?<\/button>/, '');

        // Convert Sign In buttons to use `coming-soon-trigger` if not already
        content = content.replace(/<a href="menu\.html"([^>]*)>Sign\s+In<\/a>/, '<button class="coming-soon-trigger$1">Sign In</button>');
        content = content.replace(/<a href="contact\.html"([^>]*)>Sign\s+In<\/a>/, '<button class="coming-soon-trigger$1">Sign In</button>');

        content = content.replace(/<a href="#menu"([^>]*)>Order\s+Now\s*(.*?)<\/a>/g, '<button class="coming-soon-trigger$1">Order Now $2</button>');
        content = content.replace(/<a href="menu.html"([^>]*)>Order\s+now\s*<\/a>/g, '<button class="coming-soon-trigger$1">Order Now</button>');
        content = content.replace(/<a href="menu.html"([^>]*)>Order\s+Now\s*<\/a>/g, '<button class="coming-soon-trigger$1">Order Now</button>');

        // Add coming-soon-trigger to Location selector
        content = content.replace(/hidden lg:flex items-center gap-2 cursor-pointer group\/loc relative location-btn/g, 'hidden lg:flex items-center gap-2 cursor-pointer group/loc relative location-btn coming-soon-trigger');

        // Add coming-soon-trigger to cart (shopping-bag)
        if (file === 'menu.html') {
            content = content.replace(/<button class="w-full bg-white text-slate-900 border border-slate-200 /g, '<button class="coming-soon-trigger w-full bg-white text-slate-900 border border-slate-200 ');
        }

        fs.writeFileSync(file, content);
    }
});

console.log('Updated font, dark mode, and triggers in HTML files.');
