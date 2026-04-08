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
        image: data.image || '/images/golf-placeholder.jpg',
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
"[project]/components/Hero.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Hero
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
;
;
function Hero({ post }) {
    if (!post) return null;
    const imageStyle = {
        backgroundImage: `url(${post.image || '/assets/images/tree-reflected-lake.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'left center',
        backgroundRepeat: 'no-repeat'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
        className: "w-full mb-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "relative left-1/2 right-1/2 -translate-x-1/2 w-screen bg-[#f0f0f0]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex flex-col md:flex-row min-h-[380px] md:min-h-[480px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "w-full md:w-1/2 h-64 md:h-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "h-full w-full",
                            style: imageStyle
                        }, void 0, false, {
                            fileName: "[project]/components/Hero.tsx",
                            lineNumber: 20,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/Hero.tsx",
                        lineNumber: 19,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "w-full md:w-1/2 flex items-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "w-full px-6 py-8 md:py-12 md:pr-12 md:pl-8",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "max-w-2xl md:ml-auto text-center md:text-right",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "text-sm uppercase tracking-wide text-gray-600",
                                        children: "Featured"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Hero.tsx",
                                        lineNumber: 27,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                        className: "text-2xl sm:text-3xl md:text-4xl font-bold mt-2 text-gray-900",
                                        children: post.title
                                    }, void 0, false, {
                                        fileName: "[project]/components/Hero.tsx",
                                        lineNumber: 28,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "mt-4 text-gray-700",
                                        children: post.excerpt
                                    }, void 0, false, {
                                        fileName: "[project]/components/Hero.tsx",
                                        lineNumber: 29,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "mt-6 flex justify-center md:justify-end",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: `/posts/${post.slug}`,
                                            className: "inline-block bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded text-sm font-semibold",
                                            children: "Read article"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Hero.tsx",
                                            lineNumber: 31,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/Hero.tsx",
                                        lineNumber: 30,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Hero.tsx",
                                lineNumber: 26,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/Hero.tsx",
                            lineNumber: 25,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/Hero.tsx",
                        lineNumber: 24,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Hero.tsx",
                lineNumber: 17,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/Hero.tsx",
            lineNumber: 16,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/Hero.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/PostCard.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PostCard
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
;
;
function PostCard({ post }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("article", {
        className: "border rounded overflow-hidden shadow-sm bg-white dark:bg-zinc-900",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
            href: `/posts/${post.slug}`,
            className: "block",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "h-40 sm:h-48 bg-gray-200 dark:bg-zinc-800 bg-cover bg-center",
                    style: {
                        backgroundImage: `url(${post.image})`
                    }
                }, void 0, false, {
                    fileName: "[project]/components/PostCard.tsx",
                    lineNumber: 7,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "p-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-semibold",
                            children: post.title
                        }, void 0, false, {
                            fileName: "[project]/components/PostCard.tsx",
                            lineNumber: 9,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "text-sm text-gray-500 dark:text-gray-400",
                            children: [
                                post.date,
                                " • ",
                                post.author
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/PostCard.tsx",
                            lineNumber: 10,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            className: "mt-2 text-sm text-gray-700 dark:text-gray-300",
                            children: post.excerpt
                        }, void 0, false, {
                            fileName: "[project]/components/PostCard.tsx",
                            lineNumber: 11,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "mt-3 flex flex-wrap gap-2",
                            children: (post.tags || []).map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "text-xs px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded",
                                    children: [
                                        "#",
                                        t
                                    ]
                                }, t, true, {
                                    fileName: "[project]/components/PostCard.tsx",
                                    lineNumber: 14,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/PostCard.tsx",
                            lineNumber: 12,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/PostCard.tsx",
                    lineNumber: 8,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/PostCard.tsx",
            lineNumber: 6,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/PostCard.tsx",
        lineNumber: 5,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$posts$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/posts.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Search$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Search.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Pagination$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Pagination.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$TagList$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/TagList.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Hero$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Hero.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PostCard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/PostCard.tsx [ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
const POSTS_PER_PAGE = 9;
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
    // Featured is first post
    const featured = posts[0] || null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("title", {
                        children: "Dough_Lord — SCROLLS"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "description",
                        content: "Golf Scrolls with tips, reviews and news"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        property: "og:title",
                        content: "Dough_Lord — SCROLLS"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        property: "og:description",
                        content: "Golf Scrolls with tips, reviews and news"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        property: "og:type",
                        content: "website"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Hero$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                post: featured
            }, void 0, false, {
                fileName: "[project]/pages/index.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "container",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Search$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                value: query,
                                onChange: setQuery,
                                placeholder: "Search posts or tags"
                            }, void 0, false, {
                                fileName: "[project]/pages/index.tsx",
                                lineNumber: 54,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$TagList$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                tags: allTags,
                                active: selectedTag,
                                onSelect: setSelectedTag
                            }, void 0, false, {
                                fileName: "[project]/pages/index.tsx",
                                lineNumber: 55,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/index.tsx",
                        lineNumber: 53,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
                            children: pagePosts.map((post)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PostCard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    post: post
                                }, post.slug, false, {
                                    fileName: "[project]/pages/index.tsx",
                                    lineNumber: 61,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/pages/index.tsx",
                            lineNumber: 59,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/index.tsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "mt-8 flex justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Pagination$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            current: page,
                            total: totalPages,
                            onChange: (p)=>setPage(p)
                        }, void 0, false, {
                            fileName: "[project]/pages/index.tsx",
                            lineNumber: 67,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/index.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.tsx",
                lineNumber: 52,
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

//# sourceMappingURL=%5Broot-of-the-server%5D__0ccf0d43._.js.map