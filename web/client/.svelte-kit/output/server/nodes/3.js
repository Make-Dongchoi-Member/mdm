import * as universal from '../entries/pages/about/_page.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/about/+page.ts";
export const imports = ["_app/immutable/nodes/3.e08e2d3d.js","_app/immutable/chunks/environment.9aa685ef.js","_app/immutable/chunks/scheduler.5b236a94.js","_app/immutable/chunks/index.ceb55de0.js"];
export const stylesheets = [];
export const fonts = [];
