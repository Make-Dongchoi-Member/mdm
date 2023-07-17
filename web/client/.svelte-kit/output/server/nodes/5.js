import * as universal from '../entries/pages/sverdle/how-to-play/_page.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/sverdle/how-to-play/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/sverdle/how-to-play/+page.ts";
export const imports = ["_app/immutable/nodes/5.220a39fc.js","_app/immutable/chunks/environment.9aa685ef.js","_app/immutable/chunks/scheduler.5b236a94.js","_app/immutable/chunks/index.ceb55de0.js"];
export const stylesheets = ["_app/immutable/assets/5.89a9e780.css"];
export const fonts = [];
