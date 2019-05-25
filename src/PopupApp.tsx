import * as React from "react";
import {removeAllCookies, setCookie} from "./cookies";

const initialState = {
	cookies: '',
	clear: true,
};

type State = Readonly<typeof initialState>;

export class PopupApp extends React.Component<undefined, State> {
	readonly state = initialState;

	private click = (): void => {
		chrome.tabs.query({active: true, currentWindow: true}, tabs => {
			const url = tabs[0].url;
			const cookieString = this.state.cookies;

			const first = this.state.clear ? removeAllCookies(url) : Promise.resolve();

			first
				.then(() => this.setCookies(url, cookieString))
				.then(() => window.close())
				.catch(err => alert(err.message));
		});
	};

	private setCookies(url: string, cookieString: string): Promise<any> {
		const cookies = cookieString.split(/; */);

		const promises = cookies.map(cookieString => {
			const keyVal = cookieString.split('=');
			const key = keyVal[0];
			const value = keyVal.length > 1 ? keyVal[1] : '';

			return setCookie(url, key, value);
		});

		return Promise.all(promises);
	}

	render() {
		const {cookies, clear} = this.state;

		return (
			<div>
				<div style={{color: 'grey'}}>
					Paste a cookie header, e.g. <code>foo=bar; bat=baz; oof=rab</code>
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
