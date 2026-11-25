"use strict";
// Same preference key as letmetrythis.dev, so the blog and the dashboard share light/dark.
try { if (localStorage.getItem('theme') === 'light') document.documentElement.dataset.theme = 'light'; } catch (e) {}
