import Cookie = chrome.cookies.Cookie;

export async function getAllCookies(url: string): Promise<Cookie[]> {
	return new Promise<Cookie[]>((resolve, reject) => {
		chrome.cookies.getAll({
			url: url,
		}, (cookies: Cookie[]) => {
			if (chrome.runtime.lastError)
				reject(chrome.runtime.lastError)
			else
				resolve(cookies);
		});
	});
}

export async function removeAllCookies(url: string): Promise<any> {
	return getAllCookies(url)
		.then(cookies => {
			const promises = cookies.map(cookie => removeCookie(url, cookie));
			return Promise.all(promises);
		});
}

export async function removeCookie(url: string, cookie: Cookie): Promise<any> {
	return new Promise<Cookie[]>((resolve, reject) => {
		console.log("Removing cookie " + cookie.name + " from " + url);

		chrome.cookies.remove({
			url: url,
			name: cookie.name,
		}, () => {
			if (chrome.runtime.lastError)
				reject(chrome.runtime.lastError)
			else
				resolve();
		});
	});
}

export async function setCookie(url: string, name: string, value: string): Promise<any> {
	return new Promise<any>((resolve, reject) => {
		console.log("Setting cookie " + name + "=" + value + " on " + url);

		chrome.cookies.set({
			url: url,
			name: name,
			value: value,
		}, () => {
			if (chrome.runtime.lastError)
				reject(chrome.runtime.lastError)
			else
				resolve();
		});
	});
}
