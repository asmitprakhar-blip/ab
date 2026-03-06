import fs from 'fs';

const NEW_NAVBAR = `  <!-- NAVBAR -->
  <nav class="fixed w-full z-40 top-0 transition-all duration-300 py-4 lg:py-4 bg-black/40 backdrop-blur-xl border-b border-white/5 shadow-2xl">
    <div class="max-w-7xl mx-auto px-6 flex items-center justify-between">
      <div class="flex items-center gap-6 md:gap-10">
        <!-- Logo -->
        <a href="index.html" class="flex items-center gap-2 group shrink-0">
          <img src="logo.png" alt="AuraBite" class="w-[50px] h-[50px] md:w-[60px] md:h-[60px] object-contain drop-shadow-lg" />
          <span class="text-2xl font-bold font-heading tracking-tight text-white drop-shadow-md">
            Aura<span class="text-aura-green">Bite</span>
          </span>
        </a>

        <!-- Location Selector (Desktop only, hidden on mobile) -->
        <button class="hidden lg:flex items-center gap-2 cursor-pointer group/loc relative location-btn coming-soon-trigger text-left hover:bg-white/5 p-2 rounded-xl transition-colors">
          <i data-lucide="map-pin" class="w-5 h-5 text-aura-green group-hover/loc:text-aura-green/80 transition-colors"></i>
          <div class="leading-tight">
            <div class="text-[10px] text-white/70 uppercase tracking-wider">Deliver to</div>
            <div class="text-sm font-bold text-white flex items-center gap-1 group-hover/loc:text-green-50 transition-colors">
              <span class="location-display-text">Getting location...</span> <i data-lucide="chevron-down" class="w-4 h-4 text-white"></i>
            </div>
          </div>
        </button>
      </div>

      <div class="hidden md:flex items-center gap-8 font-medium font-heading">
        <a href="index.html" class="text-white/90 hover:text-aura-green transition-colors font-bold drop-shadow-sm">Home</a>
        <a href="menu.html" class="text-white/90 hover:text-aura-green transition-colors font-bold drop-shadow-sm">Menu</a>
        <a href="plans.html" class="text-white/90 hover:text-aura-green transition-colors font-bold drop-shadow-sm">Plans</a>
        <a href="index.html#testimonials" class="text-white/90 hover:text-aura-green transition-colors font-bold drop-shadow-sm">Reviews</a>
        <a href="about.html" class="text-white/90 hover:text-aura-green transition-colors font-bold drop-shadow-sm">About</a>
        <a href="contact.html" class="text-white/90 hover:text-aura-green transition-colors font-bold drop-shadow-sm">Contact</a>
      </div>

      <div class="hidden md:flex items-center gap-4 shrink-0">
        <button class="coming-soon-trigger px-5 py-2.5 rounded-full bg-slate-900 border border-zinc-800 text-white font-bold text-sm hover:bg-slate-800 transition-all cursor-pointer">Sign In</button>
        <button class="coming-soon-trigger px-6 py-2.5 rounded-full bg-aura-green text-white font-bold text-sm shadow-[0_0_20px_rgba(76,175,80,0.3)] hover:shadow-[0_0_25px_rgba(76,175,80,0.5)] hover:-translate-y-0.5 transition-all flex items-center gap-2 border border-aura-green/50 cursor-pointer">Order Now</button>
      </div>

      <!-- Mobile Menu Toggle -->
      <button id="mobile-menu-btn" class="md:hidden p-2 text-white">
        <i data-lucide="menu" class="w-6 h-6"></i>
      </button>
    </div>

    <!-- Mobile Menu Dropdown -->
    <div id="mobile-menu"
      class="absolute top-full left-0 w-full bg-zinc-950 shadow-xl border-t border-zinc-800 py-4 px-6 flex flex-col gap-4 font-heading font-medium"
      style="display: none;">
      <a href="index.html" class="py-2 border-b border-zinc-800 text-white">Home</a>
      <a href="menu.html" class="py-2 border-b border-zinc-800 text-white">Menu</a>
      <a href="about.html" class="py-2 border-b border-zinc-800 text-white">Our Story</a>
      <a href="index.html#how-it-works" class="py-2 border-b border-zinc-800 text-white">How It Works</a>
      <a href="plans.html" class="py-2 border-b border-zinc-800 text-white">Plans</a>
      <a href="index.html#testimonials" class="py-2 border-b border-zinc-800 text-white">Reviews</a>
      <button class="coming-soon-trigger py-3 mt-2 text-center rounded-xl bg-slate-900 text-white font-bold w-full cursor-pointer">Sign In</button>
      <button class="coming-soon-trigger py-3 mt-2 text-center rounded-xl bg-aura-green text-white font-bold w-full cursor-pointer">Order Now</button>
    </div>
  </nav>`;

const files = ['index.html', 'menu.html', 'plans.html', 'contact.html', 'about.html'];

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        // Quick fix for my bad regex
        content = content.replace(/class="coming-soon-trigger\s+class="([^"]*)""/g, 'class="coming-soon-trigger $1"');
        content = content.replace(/class="coming-soon-trigger class="([^"]*)""/g, 'class="coming-soon-trigger $1"');
        content = content.replace(/class="coming-soon-trigger\s*"/g, 'class="coming-soon-trigger"');

        // Remove the old nav completely by capturing <nav> to </nav>
        let newContent = content.replace(/<!-- NAVBAR -->[\s\S]*?<\/nav>/, NEW_NAVBAR);

        // Apply changes even if newContent == content, just in case the quick fix changed it.
        if (newContent !== content) {
            fs.writeFileSync(file, newContent, 'utf8');
            console.log('Fixed nav properly in ' + file);
        } else {
            fs.writeFileSync(file, content, 'utf8'); // ensure we saved the regex fix at least
            console.log('Saved quick fixes for ' + file);
        }
    }
});
