

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.9fc4d2e3.js","_app/immutable/chunks/scheduler.5b236a94.js","_app/immutable/chunks/index.ceb55de0.js","_app/immutable/chunks/stores.e017a5a6.js","_app/immutable/chunks/singletons.c195fef3.js","_app/immutable/chunks/index.c58dd67e.js"];
export const stylesheets = [];
export const fonts = [];
