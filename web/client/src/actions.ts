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

// export function escapeKey(node: any) {
// 	const excapeKeyDownEvent = (event: any) => {
// 		if ()
// 	}
// }

// esc 버튼 눌렀을 때의 action 만들어보기.
