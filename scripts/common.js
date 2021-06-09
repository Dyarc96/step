const emailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

export const REDIRECT_TIMEOUT = 3000;

export function numberToString (number) {
	return `${number}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function validateEmail(email) {
	return emailRegex.test(`${email}`.toLowerCase());
}

export function getURLParamsFromLocation(location) {
	const params = location.search.substring(1);

	return params.split('&')
		.map(item => {
			const result = item.split("=");
			return { [result[0]]: decodeURIComponent(result[1]) }
		}).reduce((prev, curr) => ({ ...prev, ...curr }), {});
}
