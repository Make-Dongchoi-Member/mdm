import * as universal from '../entries/pages/_page.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.ts";
export const imports = ["_app/immutable/nodes/2.aa291952.js","_app/immutable/chunks/scheduler.5b236a94.js","_app/immutable/chunks/index.ceb55de0.js","_app/immutable/chunks/index.c58dd67e.js"];
export const stylesheets = ["_app/immutable/assets/2.265a38f0.css"];
export const fonts = [];
