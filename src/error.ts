
export function ok(silent = false): boolean {
	if (chrome.runtime.lastError) {
		console.log(chrome.runtime.lastError.message);

		if (!silent) {
			alert(chrome.runtime.lastError.message);
		}

		return false;
	} else {
		return true;
	}
}
