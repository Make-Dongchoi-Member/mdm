import {writable, type Writable} from 'svelte/store';

interface gameSetting {
	gameMode: string;
	barColor: string;
	ballShape: string;
}

const gameSettingStore: Writable<gameSetting> = writable({
	gameMode: "basic",
	barColor: "#FF6231",
	ballShape: "square",
});



export {gameSettingStore}
