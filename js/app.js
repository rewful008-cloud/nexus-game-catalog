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
        // Core State
        const games = ref([]);
        const loading = ref(true);
        const scrolled = ref(false);
        const selectedGame = ref(null);

        // Extended State
        const plans = ref([]);
        const articles = ref([]);
        const selectedArticle = ref(null);

        // Section Navigation
        const activeSection = ref('games'); // 'games', 'pricing', 'blog'

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
                pricing: "Pricing",
                blog: "Blog",
                readMore: "Read More",
                noResults: "No games found matching your criteria.",
                statistics: "Statistics Overview",
                totalGames: "Total Games",
                page: "Page",
                of: "of",
                showing: "Showing",
                results: "results",
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
                pricing: "الأسعار",
                blog: "المدونة",
                readMore: "اقرأ المزيد",
                noResults: "لا توجد ألعاب تطابق بحثك.",
                statistics: "نظرة عامة على الإحصائيات",
                totalGames: "إجمالي الألعاب",
                page: "صفحة",
                of: "من",
                showing: "عرض",
                results: "نتيجة",
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

        const toggleLanguage = () => {
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

        // Pagination
        const currentPage = ref(1);
        const itemsPerPage = 40;

        // Computed: Statistics
        const statistics = computed(() => {
            const all = games.value;
            return {
                total: all.length,
                appsflyer: all.filter(g => g.provider === 'AppsFlyer').length,
                adjust: all.filter(g => g.provider === 'Adjust').length,
                singular: all.filter(g => g.provider === 'Singular').length,
                active: all.filter(g => g.status === 'active').length,
                not_active: all.filter(g => g.status === 'not_active').length,
                soon: all.filter(g => g.status === 'soon').length
            };
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

        // Computed: Total Pages
        const totalPages = computed(() =>
            Math.ceil(filteredGames.value.length / itemsPerPage)
        );

        // Computed: Paginated Games
        const paginatedGames = computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            return filteredGames.value.slice(start, end);
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

        const fetchPlans = async () => {
            try {
                const response = await fetch('plans.json');
                if (response.ok) plans.value = await response.json();
            } catch (error) { console.error("Plans Load Error", error); }
        };

        const fetchArticles = async () => {
            try {
                const response = await fetch('articles.json');
                if (response.ok) articles.value = await response.json();
            } catch (error) { console.error("Articles Load Error", error); }
        };

        const openModal = (game) => {
            selectedGame.value = game;
            // document.body.style.overflow = 'hidden'; // Let body scroll or rely on fixed overlay
        };

        const closeModal = () => {
            selectedGame.value = null;
            // document.body.style.overflow = '';
        };

        const openArticle = (article) => {
            selectedArticle.value = article;
        };

        const closeArticle = () => {
            selectedArticle.value = null;
        };

        const resetFilters = () => {
            filters.value = {
                search: '',
                platform: 'all',
                provider: 'all',
                genre: 'all'
            };
        };

        // Pagination Methods
        const goToPage = (page) => {
            if (page < 1 || page > totalPages.value) return;
            currentPage.value = page;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        const nextPage = () => {
            if (currentPage.value < totalPages.value) {
                goToPage(currentPage.value + 1);
            }
        };

        const prevPage = () => {
            if (currentPage.value > 1) {
                goToPage(currentPage.value - 1);
            }
        };

        // Smart page button visibility (5 on mobile, 8 on desktop)
        const shouldShowPage = (page) => {
            const isMobile = window.innerWidth < 640; // sm breakpoint
            const maxButtons = isMobile ? 5 : 8;

            if (totalPages.value <= maxButtons) return true;

            const current = currentPage.value;
            const half = Math.floor(maxButtons / 2);

            // Always show first page
            if (page === 1) return true;

            // Always show last page (if maxButtons allows)
            if (page === totalPages.value && totalPages.value <= maxButtons) return true;

            // Show pages around current page
            return page >= current - half && page <= current + half;
        };

        // Scroll listener
        const handleScroll = () => {
            scrolled.value = window.scrollY > 20;
        };

        onMounted(() => {
            fetchGames();
            fetchPlans();
            fetchArticles();
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

        // Reset to page 1 when filters change
        watch(filters, () => {
            currentPage.value = 1;
        }, { deep: true });

        return {
            // State
            lang, games, plans, articles, selectedGame, selectedArticle, loading, filters, activeSection,

            // Computed
            t, featuredGames, filteredGames, relatedGames,
            uniqueProviders, uniqueGenres,
            // Pagination
            currentPage, totalPages, paginatedGames,
            // Statistics
            statistics,

            // Methods
            toggleLanguage, openModal, closeModal, openArticle, closeArticle, resetFilters,
            goToPage, nextPage, prevPage, shouldShowPage
        };
    }
}).mount('#app');
