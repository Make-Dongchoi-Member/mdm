export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13')
];

export const server_loads = [];

export const dictionary = {
		"/(app)": [5,[2]],
		"/(app)/chat": [6,[2]],
		"/(app)/chat/room": [7,[2]],
		"/(app)/game": [8,[2]],
		"/(sign)/join": [11,[4]],
		"/(app)/profile": [9,[2,3]],
		"/(app)/profile/social": [10,[2,3]],
		"/(sign)/signin": [12,[4]],
		"/(sign)/verify": [13,[4]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';