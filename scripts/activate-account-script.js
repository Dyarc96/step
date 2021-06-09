import { getURLParamsFromLocation, validateEmail, REDIRECT_TIMEOUT } from './common.js';

const DEEPLINK_ACTIVATE_ACCOUNT = `step://activate-account`;
const { email, authCode } = getURLParamsFromLocation(location);

if (!!authCode && !!email && validateEmail(email)) {
	const deeplink = `${DEEPLINK_ACTIVATE_ACCOUNT}?code=${authCode}&email=${email}`;
	location.replace(deeplink);
	setTimeout(() => location.replace('./index'), REDIRECT_TIMEOUT)
} else {
	location.replace('./index')
}
