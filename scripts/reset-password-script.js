import { getURLParamsFromLocation, validateEmail, REDIRECT_TIMEOUT } from './common.js';

const DEEPLINK_RESET_PASSWORD = `step://reset-password`;
const { email, authCode } = getURLParamsFromLocation(location);

if (!!authCode && !!email && validateEmail(email)) {
	const deeplink = `${DEEPLINK_RESET_PASSWORD}?code=${authCode}&email=${email}`;
	location.replace(deeplink);
	setTimeout(() => location.replace('./index'), REDIRECT_TIMEOUT)
} else {
	location.replace('./index')
}
