const { createApp, ref, computed, onMounted, watch, nextTick } = Vue;

// Logger helper
const logError = (err) => {
    console.error(err);
    const el = document.getElementById('error-log');
    if (el) {
        el.style.display = 'block';
        el.textContent += err + '\n';
    }
};

createApp({
    setup() {
        const games = ref([]);
        const loading = ref(true);
        const scrolled = ref(false);
        const selectedGame = ref(null);

        // Language State
        const lang = ref(localStorage.getItem('nexus_lang') || 'en');

        const translations = {
            en: {
                title: "KUN 0X Nexus",
                subtitle: "Bypass & Tracking Emulation",
                searchPlaceholder: "Search games, packages...",
                filterAll: "All Platforms",
                filterAndroid: "Android",
                filteriOS: "iOS",
                genreAll: "All Genres",
                featured: "Featured Games",
                new: "New",
                games: "Games",
                noResults: "No games found matching your criteria.",
                modal: {
                    howItWorks: "How it Works",
                    adminNotes: "Admin Notes",
                    relatedGames: "More by this Developer",
                    platform: "Platform",
                    status: "Status",
                    price: "Price",
                    id: "ID",
                    store: "Go to Store",
                    close: "Close"
                },
                status: {
                    active: "Active",
                    not_active: "Not Active",
                    soon: "Soon"
                }
            },
            ar: {
                title: "كن 0X نيكسوس",
                subtitle: "التخطي ومحاكاة التتبع",
                searchPlaceholder: "ابحث عن الألعاب، الحزم...",
                filterAll: "كل المنصات",
                filterAndroid: "أندرويد",
                filteriOS: "iOS",
                genreAll: "كل التصنيفات",
                featured: "ألعاب مميزة",
                new: "جديد",
                games: "الألعاب",
                noResults: "لا توجد ألعاب تطابق بحثك.",
                modal: {
                    howItWorks: "طريقة العمل",
                    adminNotes: "ملاحظات الإدارة",
                    relatedGames: "المزيد من هذا المطور",
                    platform: "المنصة",
                    status: "الحالة",
                    price: "السعر",
                    id: "المعرف",
                    store: "الذهاب للمتجر",
                    close: "إغلاق"
                },
                status: {
                    active: "نشط",
                    not_active: "غير نشط",
                    soon: "قريباً"
                }
            }
        };

        const t = computed(() => translations[lang.value]);

        const toggleLang = () => {
            lang.value = lang.value === 'en' ? 'ar' : 'en';
            localStorage.setItem('nexus_lang', lang.value);
            updateDirection();
        };

        const updateDirection = () => {
            document.documentElement.dir = lang.value === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.lang = lang.value;
        };

        // Filters
        const filters = ref({
            search: '',
            platform: 'all',
            provider: 'all',
            genre: 'all'
        });

        // Computed: Unique Providers
        const uniqueProviders = computed(() => {
            const providers = new Set(games.value.map(g => g.provider));
            return Array.from(providers).sort();
        });

        // Computed: Unique Genres
        const uniqueGenres = computed(() => {
            const genres = new Set(games.value.map(g => g.genre).filter(Boolean));
            return Array.from(genres).sort();
        });

        // Computed: Featured Games
        const featuredGames = computed(() => {
            return games.value.filter(g => g.is_featured);
        });

        // Computed: Filtered Games
        const filteredGames = computed(() => {
            return games.value.filter(game => {
                // Search
                const q = filters.value.search.toLowerCase();
                if (q && !game.name.toLowerCase().includes(q) && !game.package_name?.toLowerCase().includes(q)) {
                    return false;
                }

                // Platform
                if (filters.value.platform !== 'all' && game.device_os.toLowerCase() !== filters.value.platform) {
                    return false;
                }

                // Provider
                if (filters.value.provider !== 'all' && game.provider !== filters.value.provider) {
                    return false;
                }

                // Genre
                if (filters.value.genre !== 'all' && game.genre !== filters.value.genre) {
                    return false;
                }

                return true;
            });
        });

        // Computed: Related Games (Same Developer)
        const relatedGames = computed(() => {
            if (!selectedGame.value || !selectedGame.value.developer || selectedGame.value.developer === 'Unknown') return [];
            return games.value
                .filter(g => g.developer === selectedGame.value.developer && g.id !== selectedGame.value.id)
                .slice(0, 4);
        });

        // Methods
        const fetchGames = async () => {
            try {
                // Simulate network delay
                await new Promise(r => setTimeout(r, 800));

                const response = await fetch('data.json');
                if (!response.ok) throw new Error('Failed to load data');
                games.value = await response.json();
            } catch (error) {
                logError("Main Load Error: " + error.message);
            } finally {
                loading.value = false;
            }
        };

        const openModal = (game) => {
            selectedGame.value = game;
            // document.body.style.overflow = 'hidden'; // Let body scroll or rely on fixed overlay
        };

        const closeModal = () => {
            selectedGame.value = null;
            // document.body.style.overflow = '';
        };

        const resetFilters = () => {
            filters.value = {
                search: '',
                platform: 'all',
                provider: 'all',
                genre: 'all'
            };
        };

        // Scroll listener
        const handleScroll = () => {
            scrolled.value = window.scrollY > 20;
        };

        onMounted(() => {
            fetchGames();
            updateDirection();
            window.addEventListener('scroll', handleScroll);
            if (window.lucide) window.lucide.createIcons();

            // Remove Loader & Show App
            const loader = document.getElementById('loading-screen');
            const app = document.getElementById('app');
            if (loader) loader.style.display = 'none';
            if (app) {
                app.removeAttribute('style');
                app.classList.add('mounted');
            }
        });

        watch(selectedGame, async (newVal) => {
            if (newVal && window.lucide) {
                await nextTick();
                window.lucide.createIcons();
            }
        });

        return {
            games, loading, scrolled, selectedGame,
            filters,
            lang, t, toggleLang,
            uniqueProviders, uniqueGenres,
            filteredGames, featuredGames, relatedGames,
            openModal, closeModal, resetFilters
        };
    }
}).mount('#app');

