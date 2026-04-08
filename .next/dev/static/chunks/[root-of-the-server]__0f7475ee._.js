(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/welcome/welcome-page/bLOG WEBSITE/components/Search.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Search
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/welcome/welcome-page/bLOG WEBSITE/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
;
function Search({ value, onChange, placeholder = 'Search' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        value: value,
        onChange: (e)=>onChange(e.target.value),
        placeholder: placeholder,
        className: "w-full sm:w-64 px-3 py-2 border rounded border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm"
    }, void 0, false, {
        fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/components/Search.tsx",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
_c = Search;
var _c;
__turbopack_context__.k.register(_c, "Search");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/welcome/welcome-page/bLOG WEBSITE/components/Pagination.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Pagination
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/welcome/welcome-page/bLOG WEBSITE/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
;
function Pagination({ current, total, onChange }) {
    const prev = ()=>onChange(Math.max(1, current - 1));
    const next = ()=>onChange(Math.min(total, current + 1));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: prev,
                disabled: current === 1,
                className: "px-3 py-1 rounded bg-gray-100 dark:bg-zinc-800",
                children: "Prev"
            }, void 0, false, {
                fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/components/Pagination.tsx",
                lineNumber: 6,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-sm",
                children: [
                    current,
                    " / ",
                    total
                ]
            }, void 0, true, {
                fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/components/Pagination.tsx",
                lineNumber: 9,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: next,
                disabled: current === total,
                className: "px-3 py-1 rounded bg-gray-100 dark:bg-zinc-800",
                children: "Next"
            }, void 0, false, {
                fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/components/Pagination.tsx",
                lineNumber: 10,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/components/Pagination.tsx",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
_c = Pagination;
var _c;
__turbopack_context__.k.register(_c, "Pagination");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/welcome/welcome-page/bLOG WEBSITE/components/TagList.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TagList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/welcome/welcome-page/bLOG WEBSITE/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
;
function TagList({ tags, active, onSelect }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex gap-2 flex-wrap",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>onSelect(null),
                className: `text-sm px-2 py-1 rounded ${active === null ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-zinc-800'}`,
                children: "All"
            }, void 0, false, {
                fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/components/TagList.tsx",
                lineNumber: 4,
                columnNumber: 7
            }, this),
            tags.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>onSelect(t),
                    className: `text-sm px-2 py-1 rounded ${active === t ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-zinc-800'}`,
                    children: [
                        "#",
                        t
                    ]
                }, t, true, {
                    fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/components/TagList.tsx",
                    lineNumber: 8,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/components/TagList.tsx",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
_c = TagList;
var _c;
__turbopack_context__.k.register(_c, "TagList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/welcome/welcome-page/bLOG WEBSITE/components/Hero.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Hero
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/welcome/welcome-page/bLOG WEBSITE/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/welcome/welcome-page/bLOG WEBSITE/node_modules/next/link.js [client] (ecmascript)");
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "w-full mb-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative left-1/2 right-1/2 -translate-x-1/2 w-screen bg-[#f0f0f0]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col md:flex-row min-h-[380px] md:min-h-[480px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full md:w-1/2 h-64 md:h-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-full w-full",
                            style: imageStyle
                        }, void 0, false, {
                            fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/components/Hero.tsx",
                            lineNumber: 20,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/components/Hero.tsx",
                        lineNumber: 19,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full md:w-1/2 flex items-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-full px-6 py-8 md:py-12 md:pr-12 md:pl-8",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "max-w-2xl md:ml-auto text-center md:text-right",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm uppercase tracking-wide text-gray-600",
                                        children: "Featured"
                                    }, void 0, false, {
                                        fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/components/Hero.tsx",
                                        lineNumber: 27,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-2xl sm:text-3xl md:text-4xl font-bold mt-2 text-gray-900",
                                        children: post.title
                                    }, void 0, false, {
                                        fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/components/Hero.tsx",
                                        lineNumber: 28,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-4 text-gray-700",
                                        children: post.excerpt
                                    }, void 0, false, {
                                        fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/components/Hero.tsx",
                                        lineNumber: 29,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-6 flex justify-center md:justify-end",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: `/posts/${post.slug}`,
                                            className: "inline-block bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded text-sm font-semibold",
                                            children: "Read article"
                                        }, void 0, false, {
                                            fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/components/Hero.tsx",
                                            lineNumber: 31,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/components/Hero.tsx",
                                        lineNumber: 30,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/components/Hero.tsx",
                                lineNumber: 26,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/components/Hero.tsx",
                            lineNumber: 25,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/components/Hero.tsx",
                        lineNumber: 24,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/components/Hero.tsx",
                lineNumber: 17,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/components/Hero.tsx",
            lineNumber: 16,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/components/Hero.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_c = Hero;
var _c;
__turbopack_context__.k.register(_c, "Hero");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/welcome/welcome-page/bLOG WEBSITE/components/PostCard.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PostCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/welcome/welcome-page/bLOG WEBSITE/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/welcome/welcome-page/bLOG WEBSITE/node_modules/next/link.js [client] (ecmascript)");
;
;
function PostCard({ post }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        className: "glass-card overflow-hidden shadow-sm",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            href: `/posts/${post.slug}`,
            className: "block",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-40 sm:h-48 bg-gray-200 dark:bg-zinc-800 bg-cover bg-center",
                    style: {
                        backgroundImage: `url(${post.image})`
                    }
                }, void 0, false, {
                    fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/components/PostCard.tsx",
                    lineNumber: 7,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-semibold",
                            children: post.title
                        }, void 0, false, {
                            fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/components/PostCard.tsx",
                            lineNumber: 9,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm text-gray-500 dark:text-gray-400",
                            children: [
                                post.date,
                                " • ",
                                post.author
                            ]
                        }, void 0, true, {
                            fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/components/PostCard.tsx",
                            lineNumber: 10,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 text-sm text-gray-700 dark:text-gray-300",
                            children: post.excerpt
                        }, void 0, false, {
                            fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/components/PostCard.tsx",
                            lineNumber: 11,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-3 flex flex-wrap gap-2",
                            children: (post.tags || []).map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded",
                                    children: [
                                        "#",
                                        t
                                    ]
                                }, t, true, {
                                    fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/components/PostCard.tsx",
                                    lineNumber: 14,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/components/PostCard.tsx",
                            lineNumber: 12,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/components/PostCard.tsx",
                    lineNumber: 8,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/components/PostCard.tsx",
            lineNumber: 6,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/components/PostCard.tsx",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
_c = PostCard;
var _c;
__turbopack_context__.k.register(_c, "PostCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/welcome/welcome-page/bLOG WEBSITE/pages/index.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__N_SSG",
    ()=>__N_SSG,
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/welcome/welcome-page/bLOG WEBSITE/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/welcome/welcome-page/bLOG WEBSITE/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/welcome/welcome-page/bLOG WEBSITE/node_modules/next/head.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$components$2f$Search$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/welcome/welcome-page/bLOG WEBSITE/components/Search.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$components$2f$Pagination$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/welcome/welcome-page/bLOG WEBSITE/components/Pagination.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$components$2f$TagList$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/welcome/welcome-page/bLOG WEBSITE/components/TagList.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$components$2f$Hero$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/welcome/welcome-page/bLOG WEBSITE/components/Hero.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$components$2f$PostCard$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/welcome/welcome-page/bLOG WEBSITE/components/PostCard.tsx [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
const POSTS_PER_PAGE = 9;
var __N_SSG = true;
function Home({ posts }) {
    _s();
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedTag, setSelectedTag] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [page, setPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const filtered = (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Home.useMemo[filtered]": ()=>{
            let list = posts;
            if (query) {
                const q = query.toLowerCase();
                list = list.filter({
                    "Home.useMemo[filtered]": (p)=>p.title.toLowerCase().includes(q) || (p.tags || []).some({
                            "Home.useMemo[filtered]": (t)=>t.toLowerCase().includes(q)
                        }["Home.useMemo[filtered]"])
                }["Home.useMemo[filtered]"]);
            }
            if (selectedTag) {
                list = list.filter({
                    "Home.useMemo[filtered]": (p)=>(p.tags || []).includes(selectedTag)
                }["Home.useMemo[filtered]"]);
            }
            return list;
        }
    }["Home.useMemo[filtered]"], [
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                        children: "Dough_Lord — SCROLLS"
                    }, void 0, false, {
                        fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/pages/index.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "description",
                        content: "Golf Scrolls with tips, reviews and news"
                    }, void 0, false, {
                        fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/pages/index.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:title",
                        content: "Dough_Lord — SCROLLS"
                    }, void 0, false, {
                        fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/pages/index.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:description",
                        content: "Golf Scrolls with tips, reviews and news"
                    }, void 0, false, {
                        fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/pages/index.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        property: "og:type",
                        content: "website"
                    }, void 0, false, {
                        fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/pages/index.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/pages/index.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$components$2f$Hero$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                post: featured
            }, void 0, false, {
                fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/pages/index.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$components$2f$Search$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                value: query,
                                onChange: setQuery,
                                placeholder: "Search posts or tags"
                            }, void 0, false, {
                                fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/pages/index.tsx",
                                lineNumber: 54,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$components$2f$TagList$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                tags: allTags,
                                active: selectedTag,
                                onSelect: setSelectedTag
                            }, void 0, false, {
                                fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/pages/index.tsx",
                                lineNumber: 55,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/pages/index.tsx",
                        lineNumber: 53,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
                            children: pagePosts.map((post)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$components$2f$PostCard$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                    post: post
                                }, post.slug, false, {
                                    fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/pages/index.tsx",
                                    lineNumber: 61,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/pages/index.tsx",
                            lineNumber: 59,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/pages/index.tsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-8 flex justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$welcome$2f$welcome$2d$page$2f$bLOG__WEBSITE$2f$components$2f$Pagination$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            current: page,
                            total: totalPages,
                            onChange: (p)=>setPage(p)
                        }, void 0, false, {
                            fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/pages/index.tsx",
                            lineNumber: 67,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/pages/index.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/welcome/welcome-page/bLOG WEBSITE/pages/index.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(Home, "eeR+TRwB2VAg7ScQRACEeEdMT3g=");
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/welcome/welcome-page/bLOG WEBSITE/pages/index.tsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/welcome/welcome-page/bLOG WEBSITE/pages/index.tsx [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/welcome/welcome-page/bLOG WEBSITE/pages/index\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/welcome/welcome-page/bLOG WEBSITE/pages/index.tsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__0f7475ee._.js.map