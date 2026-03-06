import fs from 'fs';

const MOCK_MENU = [
    { id: 1, name: 'Fruit Chaat', description: 'A colorful mix of fresh apples, oranges, kiwi, and pomegranate seeds, tossed with warm spices and citrus for a sweet-tangy finish', price: 149, category: 'Snacks', image: 'https://plus.unsplash.com/premium_photo-1689596510917-d337f077d559?auto=format&fit=crop&w=600&q=80', popular: true, available: true },
    { id: 2, name: 'Peanut Chaat Mix', description: 'Mix of boiled peanuts, chopped onions, tomatoes, green chilies, fresh coriander, and tangy lemon juice', price: 99, category: 'Snacks', image: 'https://images.unsplash.com/photo-1617894814622-244a5a817c09?auto=format&fit=crop&w=600&q=80', popular: false, available: true },
    { id: 3, name: 'Flavoured Makhana Chaat', description: 'Mix of crunchy roasted makhana, chopped onions, tomatoes, fresh coriander, and a squeeze of lemon juice', price: 129, category: 'Snacks', image: 'https://images.unsplash.com/photo-1596450514735-111a2f646067?auto=format&fit=crop&w=600&q=80', popular: true, available: true },
    { id: 4, name: 'Sprouts', description: 'Mix of sprouted green gram, chickpeas, colorful bell peppers, pomegranate seeds, fresh coriander, and tangy lime wedges', price: 119, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1623489254660-db5b367881d9?auto=format&fit=crop&w=600&q=80', popular: false, available: true },
    { id: 5, name: 'Paneer Veg Mix', description: 'Mix of golden-seared paneer cubes, sautéed bell peppers, and onions tossed in a rich, spiced tomato masala and finished with fresh coriander', price: 199, category: 'Meals', image: 'https://plus.unsplash.com/premium_photo-1726783359110-de1b5d04179c?auto=format&fit=crop&w=600&q=80', popular: true, available: true },
    { id: 6, name: 'Sweet Patato Chaat', description: 'Mix of boiled sweet potato cubes, tossed with aromatic spices, fresh coriander, and tangy lime juice', price: 139, category: 'Snacks', image: 'https://images.unsplash.com/photo-1730793666277-8f3247c58968?auto=format&fit=crop&w=600&q=80', popular: false, available: true },
    { id: 7, name: 'Eggs', description: 'Classic Boiled, Creamy Scrambled, Signature Omelette, Artisan Poached, Lean Egg Whites', price: 109, category: 'Breakfast', image: 'https://plus.unsplash.com/premium_photo-1711593312223-0eb8d63e2a66?auto=format&fit=crop&w=600&q=80', popular: false, available: true },
    { id: 8, name: 'Sweet Corn', description: 'Mix of steamed golden corn kernels, finely chopped onions, tomatoes, and green chilies, finished with fresh coriander and a zesty lemon squeeze', price: 119, category: 'Snacks', image: 'https://images.unsplash.com/photo-1641053336141-8b0339f48f23?auto=format&fit=crop&w=600&q=80', popular: false, available: true },
    { id: 9, name: 'Soups (Veg & Non-Veg)', description: 'Your choice of Vegetable or Chicken, nutrient-rich broth packed with seasonal diced vegetables, sweet corn, and a hint of cracked black pepper', price: 149, category: 'Meals', image: 'https://plus.unsplash.com/premium_photo-1699467556443-65d2a8d8f00e?auto=format&fit=crop&w=600&q=80', popular: false, available: true },
    { id: 10, name: 'Strawberry Chocolate Dip', description: 'Fresh, succulent strawberries hand-dipped in rich, velvety melted chocolate for the perfect balance of fruity sweetness and decadent cocoa', price: 199, category: 'Desserts', image: 'https://images.unsplash.com/photo-1503624280608-6b79dc9ab03d?auto=format&fit=crop&w=600&q=80', popular: true, available: true },
    { id: 11, name: 'Juices', description: 'A vibrant selection of 100% natural, freshly squeezed juices made from a variety of tropical fruits, chilled to perfection and served without added sugar for a nutrient-packed experience', price: 129, category: 'Drinks', image: 'https://plus.unsplash.com/premium_photo-1695055513501-2573541f00cd?auto=format&fit=crop&w=600&q=80', popular: true, available: true },
];

let itemsHtml = MOCK_MENU.map(item => `
            <!-- ${item.id}. ${item.name} -->
            <div class="bg-white dark:bg-[#0A0A0A] rounded-2xl overflow-hidden border border-slate-100 dark:border-zinc-800 md:hover:border-aura-green/50 shadow-sm md:shadow-none md:hover:shadow-2xl md:hover:shadow-aura-green/5 transition-all group w-full flex flex-row md:flex-col p-3 md:p-0 gap-3 md:gap-0 md:aspect-square food-card" data-category="${item.category}">
                
                <!-- Content Side -->
                <div class="flex-1 flex flex-col order-1 md:order-2 md:p-3 md:h-[55%] overflow-hidden">
                    ${item.popular ? `<div class="md:hidden flex items-center mb-1.5"><span class="text-aura-green font-bold text-[10px] flex items-center gap-1 bg-aura-green/10 px-2 py-0.5 rounded-md"><i data-lucide="star" class="w-2.5 h-2.5 fill-current"></i> Bestseller</span></div>` : ''}

                    <div class="hidden md:flex items-center gap-1 text-aura-green mb-1">
                        <i data-lucide="star" class="w-3 h-3 fill-current"></i>
                        <span class="text-[10px] font-bold text-slate-800 dark:text-zinc-300">4.9 (2.3k reviews)</span>
                    </div>

                    <h3 class="text-[15px] leading-tight md:text-[14px] lg:text-[15px] font-bold font-heading text-slate-800 dark:text-white md:group-hover:text-aura-green transition-colors mb-0.5 line-clamp-2">
                        ${item.name}
                    </h3>

                    <div class="font-bold text-[14px] md:text-base text-slate-800 dark:text-slate-200 mb-1 md:hidden">
                        ₹${item.price}
                    </div>

                    <p class="text-slate-500 text-[11px] md:text-[10px] lg:text-[11px] leading-tight mb-3 md:mb-1.5 line-clamp-2 md:line-clamp-2 pt-0.5 md:pt-0">
                        ${item.description}
                    </p>

                    <div class="hidden md:flex items-center justify-between gap-2 mt-auto">
                        <button class="coming-soon-trigger flex-1 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-semibold text-xs hover:bg-aura-green transition-all shadow-lg">
                            Customise
                        </button>
                        <button class="coming-soon-trigger p-2 rounded-xl bg-aura-green text-white hover:bg-aura-darkgreen transition-all hover:scale-105 active:scale-95 shadow-lg shadow-aura-green/20">
                            <i data-lucide="shopping-bag" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>

                <!-- Image Side -->
                <div class="relative w-[130px] md:w-full shrink-0 order-2 md:order-1 md:h-[45%]">
                    ${item.popular ? `<div class="hidden md:block absolute top-3 left-3 z-10 bg-aura-green text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-aura-green/50">Best Seller</div>` : ''}
                    <div class="hidden md:block absolute top-3 right-3 z-10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm text-slate-900 dark:text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-slate-200 dark:border-zinc-700">₹${item.price}</div>

                    <div class="w-full h-[100px] md:h-full rounded-xl md:rounded-none md:rounded-t-2xl overflow-hidden relative shadow-sm md:shadow-none bg-slate-100 flex items-center justify-center">
                        <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-110">
                    </div>

                    <!-- Mobile ADD Button -->
                    <div class="md:hidden absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[85%] flex flex-col items-center">
                        <button class="coming-soon-trigger w-full bg-white text-slate-900 border border-slate-200 shadow-md font-extrabold text-[13px] py-1.5 rounded-xl active:scale-95 transition-all text-center flex items-center justify-center uppercase hover:bg-slate-50 relative overflow-hidden">
                            ADD
                            <span class="absolute top-0 right-0 p-0.5"><div class="w-1.5 h-1.5 rounded-full bg-aura-green"></div></span>
                        </button>
                        <p class="text-[8px] text-white mt-0.5 tracking-wider bg-black/70 backdrop-blur-sm px-1 rounded">CUSTOMISABLE</p>
                    </div>
                </div>
            </div>`).join('\n');

const menuContent = fs.readFileSync('menu.html', 'utf8');
const replacement = '<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">\n' + itemsHtml + '\n</div>';

const updatedHtml = menuContent.replace(/<div class=\"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6\">[\s\S]*?<\/div>\s*<\/main>/, replacement + '\n    </main>');

fs.writeFileSync('menu.html', updatedHtml);
console.log('Menu layout updated successfully.');
