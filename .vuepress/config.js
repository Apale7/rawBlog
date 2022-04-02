module.exports = {
  "title": "Blog",
  "description": "blog build by VuePress",
  "dest": "public",
  "head": [
    ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.css' }],
    ['link', { rel: 'stylesheet', href: 'https://gitcdn.xyz/cdn/goessner/markdown-it-texmath/master/texmath.css' }],
    ['script', { src: 'https://github.com/markdown-it/markdown-it/blob/master/bin/markdown-it.js' }],
    ['script', { src: 'https://gitcdn.xyz/cdn/goessner/markdown-it-texmath/master/texmath.js' }],
    ['script', { src: 'https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.js' }],
    [
      "link",
      {
        "rel": "icon",
        "href": "/favicon.ico"
      }
    ],
    [
      "meta",
      {
        "name": "viewport",
        "content": "width=device-width,initial-scale=1,user-scalable=no"
      }
    ]
  ],
  "theme": "reco",
  "themeConfig": {
    "nav": [
      {
        "text": "Home",
        "link": "/",
        "icon": "reco-home"
      },
      {
        "text": "时间线",
        "link": "/timeline/",
        "icon": "reco-date"
      },
      // {
      //   "text": "Docs",
      //   "icon": "reco-message",
      //   "items": [
      //     {
      //       "text": "vuepress-reco",
      //       "link": "/docs/theme-reco/"
      //     }
      //   ]
      // },
      {
        "text": "github",
        "icon": "reco-message",
        "items": [
          {
            "text": "Apale7",
            "link": "https://github.com/Apale7",
            "icon": "reco-github"
          }
        ]
      }
    ],
    "sidebar": {
      "/docs/theme-reco/": [
        "",
        "theme",
        "plugin",
        "api"
      ]
    },
    "type": "blog",
    "blogConfig": {
      "category": {
        "location": 2,
        "text": "分类"
      },
      // "tag": {
      //   "location": 3,
      //   "text": "Tag"
      // }
    },
    // "friendLink": [
    //   // {
    //   //   "title": "午后南杂",
    //   //   "desc": "Enjoy when you can, and endure when you must.",
    //   //   "email": "1156743527@qq.com",
    //   //   "link": "https://www.recoluan.com"
    //   // },
    //   {
    //     "title": "vuepress-theme-reco",
    //     "desc": "A simple and beautiful vuepress Blog & Doc theme.",
    //     "avatar": "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
    //     "link": "https://vuepress-theme-reco.recoluan.com"
    //   }
    // ],
    "logo": "/logo.png",
    "search": true,
    "searchMaxSuggestions": 10,
    "lastUpdated": "Last Updated",
    "author": "Apale",
    "authorAvatar": "/avatar.jpg",
    "record": "1234",
    "startYear": "2017"
  },
  "markdown": {
    "lineNumbers": true,
    anchor: { permalink: false },
    toc: { includeLevel: [1, 2] },
    extendMarkdown: md => {
      md.use(require('markdown-it-texmath'))
    }
  }
}