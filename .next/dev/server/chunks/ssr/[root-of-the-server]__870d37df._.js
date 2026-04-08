module.exports = [
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/gray-matter [external] (gray-matter, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("gray-matter", () => require("gray-matter"));

module.exports = mod;
}),
"[project]/lib/posts.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAllPosts",
    ()=>getAllPosts,
    "getPostBySlug",
    ()=>getPostBySlug,
    "getPostSlugs",
    ()=>getPostSlugs
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$gray$2d$matter__$5b$external$5d$__$28$gray$2d$matter$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/gray-matter [external] (gray-matter, cjs)");
;
;
;
const postsDirectory = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'posts');
function getPostSlugs() {
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(postsDirectory)) return [];
    return __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readdirSync(postsDirectory).filter((f)=>f.endsWith('.md'));
}
function getPostBySlug(slug) {
    const realSlug = slug.replace(/\.md$/, '');
    const fullPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(postsDirectory, `${realSlug}.md`);
    const fileContents = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(fullPath, 'utf8');
    const { data, content } = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$gray$2d$matter__$5b$external$5d$__$28$gray$2d$matter$2c$__cjs$29$__["default"])(fileContents);
    const meta = {
        title: data.title || realSlug,
        date: data.date || '',
        tags: data.tags || [],
        author: data.author || 'Author',
        excerpt: data.excerpt || '',
        slug: realSlug
    };
    return {
        meta,
        content
    };
}
function getAllPosts() {
    const slugs = getPostSlugs();
    const posts = slugs.map((fileName)=>{
        const { meta } = getPostBySlug(fileName);
        return meta;
    }).sort((a, b)=>a.date < b.date ? 1 : -1);
    return posts;
}
}),
"[project]/components/Search.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Search
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
function Search({ value, onChange, placeholder = 'Search' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
        value: value,
        onChange: (e)=>onChange(e.target.value),
        placeholder: placeholder,
        className: "w-full sm:w-64 px-3 py-2 border rounded border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm"
    }, void 0, false, {
        fileName: "[project]/components/Search.tsx",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/Pagination.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Pagination
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
function Pagination({ current, total, onChange }) {
    const prev = ()=>onChange(Math.max(1, current - 1));
    const next = ()=>onChange(Math.min(total, current + 1));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                onClick: prev,
                disabled: current === 1,
                className: "px-3 py-1 rounded bg-gray-100 dark:bg-zinc-800",
                children: "Prev"
            }, void 0, false, {
                fileName: "[project]/components/Pagination.tsx",
                lineNumber: 6,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                className: "text-sm",
                children: [
                    current,
                    " / ",
                    total
                ]
            }, void 0, true, {
                fileName: "[project]/components/Pagination.tsx",
                lineNumber: 9,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                onClick: next,
                disabled: current === total,
                className: "px-3 py-1 rounded bg-gray-100 dark:bg-zinc-800",
                children: "Next"
            }, void 0, false, {
                fileName: "[project]/components/Pagination.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Pagination.tsx",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/TagList.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TagList
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
function TagList({ tags, active, onSelect }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "flex gap-2 flex-wrap",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                onClick: ()=>onSelect(null),
                className: `text-sm px-2 py-1 rounded ${active === null ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-zinc-800'}`,
                children: "All"
            }, void 0, false, {
                fileName: "[project]/components/TagList.tsx",
                lineNumber: 4,
                columnNumber: 7
            }, this),
            tags.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                    onClick: ()=>onSelect(t),
                    className: `text-sm px-2 py-1 rounded ${active === t ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-zinc-800'}`,
                    children: [
                        "#",
                        t
                    ]
                }, t, true, {
                    fileName: "[project]/components/TagList.tsx",
                    lineNumber: 8,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/components/TagList.tsx",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
}),
"[project]/pages/index.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home,
    "getStaticProps",
    ()=>getStaticProps
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$posts$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/posts.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Search$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Search.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Pagination$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Pagination.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$TagList$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/TagList.tsx [ssr] (ecmascript)");
;
;
;
;
;
;
;
;
const POSTS_PER_PAGE = 5;
function Home({ posts }) {
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [selectedTag, setSelectedTag] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [page, setPage] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(1);
    const filtered = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        let list = posts;
        if (query) {
            const q = query.toLowerCase();
            list = list.filter((p)=>p.title.toLowerCase().includes(q) || (p.tags || []).some((t)=>t.toLowerCase().includes(q)));
        }
        if (selectedTag) {
            list = list.filter((p)=>(p.tags || []).includes(selectedTag));
        }
        return list;
    }, [
        posts,
        query,
        selectedTag
    ]);
    const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
    const start = (page - 1) * POSTS_PER_PAGE;
    const pagePosts = filtered.slice(start, start + POSTS_PER_PAGE);
    const allTags = Array.from(new Set(posts.flatMap((p)=>p.tags || []))).sort();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("title", {
                        children: "My Blog"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.tsx",
                        lineNumber: 37,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "description",
                        content: "A personal blog built with Next.js and TypeScript"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.tsx",
                        lineNumber: 38,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                        className: "text-3xl font-bold",
                        children: "My Blog"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.tsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "text-gray-600 dark:text-gray-300 mt-2",
                        children: "Thoughts, tutorials, and experiments."
                    }, void 0, false, {
                        fileName: "[project]/pages/index.tsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Search$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        value: query,
                        onChange: setQuery,
                        placeholder: "Search by title or tag"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$TagList$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        tags: allTags,
                        active: selectedTag,
                        onSelect: setSelectedTag
                    }, void 0, false, {
                        fileName: "[project]/pages/index.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "space-y-6",
                children: pagePosts.map((post)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("article", {
                        className: "p-4 border rounded border-gray-100 dark:border-zinc-700",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-semibold",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: `/posts/${post.slug}`,
                                    children: post.title
                                }, void 0, false, {
                                    fileName: "[project]/pages/index.tsx",
                                    lineNumber: 54,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/index.tsx",
                                lineNumber: 53,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "text-sm text-gray-500 dark:text-gray-400",
                                children: [
                                    post.date,
                                    " • ",
                                    post.author
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/index.tsx",
                                lineNumber: 56,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-gray-700 dark:text-gray-300 mt-2",
                                children: post.excerpt
                            }, void 0, false, {
                                fileName: "[project]/pages/index.tsx",
                                lineNumber: 57,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "mt-3 text-sm",
                                children: (post.tags || []).map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setSelectedTag(t),
                                        className: "mr-2 text-xs px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded",
                                        children: [
                                            "#",
                                            t
                                        ]
                                    }, t, true, {
                                        fileName: "[project]/pages/index.tsx",
                                        lineNumber: 60,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/pages/index.tsx",
                                lineNumber: 58,
                                columnNumber: 13
                            }, this)
                        ]
                    }, post.slug, true, {
                        fileName: "[project]/pages/index.tsx",
                        lineNumber: 52,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/pages/index.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mt-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Pagination$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                    current: page,
                    total: totalPages,
                    onChange: (p)=>setPage(p)
                }, void 0, false, {
                    fileName: "[project]/pages/index.tsx",
                    lineNumber: 70,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/index.tsx",
                lineNumber: 69,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function getStaticProps() {
    const posts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$posts$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getAllPosts"])();
    return {
        props: {
            posts
        }
    };
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__870d37df._.js.map