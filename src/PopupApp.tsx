import * as React from "react";
import {copyToClipboard} from "./clipboard";
import {getAllCookies, removeAllCookies, setCookie} from "./cookies";

const initialState = {
	cookies: '',
	clear: true,
	oldCookies: null,
	url: null,
};

type State = Readonly<typeof initialState>;

export class PopupApp extends React.Component<undefined, State> {
	readonly state = initialState;

	componentDidMount(): void {
		chrome.tabs.query({active: true, currentWindow: true}, tabs => {
			const url = tabs[0].url;

			this.setState({url});

			this.getCookies(url).then(oldCookies => {
				this.setState({oldCookies});
			});
		});
	}

	private click = async (): Promise<void> => {
		const url = this.state.url;
		const cookieString = this.state.cookies;

		if (this.state.clear) {
			await removeAllCookies(url);
		}

		try {
			await this.setCookies(cookieString);
			window.close();
		} catch (err) {
			alert(err.message);
		}
	};

	private setCookies(cookieString: string): Promise<any> {
		const cookies = cookieString.split(/; */);

		const promises = cookies.map(cookieString => {
			const keyVal = cookieString.split('=');
			const key = keyVal[0];
			const value = keyVal.length > 1 ? keyVal[1] : '';

			return setCookie(this.state.url, key, value);
		});

		return Promise.all(promises);
	}

	private async getCookies(url: string): Promise<string> {
		const cookies = await getAllCookies(url);
		return cookies
			.map(cookie => cookie.name + "=" + cookie.value)
			.join("; ");
	}

	render() {
		const {url, oldCookies, cookies, clear} = this.state;

		if (url === null || oldCookies === null)
			return null;

		return (
			<div>
				<div style={{color: 'grey'}}>
					Existing cookies <button onClick={() => copyToClipboard(oldCookies)}>copy</button>
				</div>

				<div style={{marginTop: '0.5em'}}>
					<textarea
						rows={5}
						cols={100}
						value={oldCookies}
						readOnly={true}
					></textarea>
				</div>

				<div style={{color: 'grey', marginTop: '1em'}}>
					Update cookies with a cookie header, e.g. <code>foo=bar; bat=baz; oof=rab</code>
				</div>

				<div style={{marginTop: '0.5em'}}>
					<textarea
						rows={5}
						cols={100}
						value={cookies}
						onChange={event => this.setState({cookies: event.target.value})}
					></textarea>
				</div>

				<div style={{marginTop: '1em'}}>
					<label>
						<input
							type="checkbox"
							checked={clear}
							onChange={event => this.setState({clear: event.target.checked})}
						/>
						Clear existing cookies first
					</label>
				</div>

				<div style={{marginTop: '1em'}}>
					<button onClick={this.click}>Set Cookies</button>
				</div>
			</div>
		);
	}
}
