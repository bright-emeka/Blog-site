self.__BUILD_MANIFEST = {
  "/": [
    "static/chunks/pages/index.js"
  ],
  "/posts/[slug]": [
    "static/chunks/pages/posts/[slug].js"
  ],
  "__rewrites": {
    "afterFiles": [],
    "beforeFiles": [],
    "fallback": []
  },
  "sortedPages": [
    "/",
    "/404",
    "/_app",
    "/_error",
    "/about",
    "/api/contact",
    "/posts/[slug]"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()