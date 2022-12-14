export const regexValidateEmail = new RegExp(
	/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);

export const regexValidateName = new RegExp(/^[a-zA-ZÀ-ÿ\s]{3,40}$/);

export const regexValidateTagName = new RegExp(/^[a-zA-Z]{1,16}$/);

export const regexValidateBio = new RegExp(/^[a-zA-Z0-9\s.,:?]{40,400}$/);

/**
 * OPTIONAL
 */
export const regexValidateProfileImage = new RegExp(
	/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/
);
