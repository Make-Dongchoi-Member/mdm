export function clickOutside(node: any) {
	const outClickEvent = (event: any) => {
		if (!node.contains(event.target)) {
			node.dispatchEvent(new CustomEvent("outclick"));
		}
	};

	document.addEventListener("click", outClickEvent, true);

	return {
		destroy() {
			document.removeEventListener("click", outClickEvent, true);
		}
	};
}

export function escapeKey(node: any) {
	const escapeKeyDownEvent = (event: any) => {
		if (event.key === 'Escape') {
			node.dispatchEvent(new CustomEvent("esckey"));
		}
	};

	document.addEventListener("keydown", escapeKeyDownEvent, true);

	return {
		destroy() {
			document.removeEventListener("keydown", escapeKeyDownEvent, true);
		}
	};
}

export function spaceKey(node: any) {
	const spaceKeyDownEvent = (event: any) => {
		if (event.key === 'Space') {
			node.dispatchEvent(new CustomEvent("spacekey"));
		}
	};

	document.addEventListener("keydown", spaceKeyDownEvent, true);

	return {
		destroy() {
			document.removeEventListener("keydown", spaceKeyDownEvent, true);
		}
	};
}
