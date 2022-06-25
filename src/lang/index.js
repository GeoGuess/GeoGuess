import Vue from 'vue';
import VueI18n from 'vue-i18n';
// Load all modules.
function loadTranslations() {
    if(process.env.NODE_ENV === 'test')
        return {};
	const context = require.context('./locale', false, /([a-z_]+)\.json$/i);

	return context
		.keys()
		.map((key) => ({ key, name: key.match(/([a-z_]+)\.json$/i)[1] }))
		.reduce(
			(modules, { key, name }) => ({
				...modules,
				[name]: context(key),
			}),
			{},
		);

}

export const translations = loadTranslations();

Vue.use(VueI18n);

export const RTL_LANGUAGES = ['he'];

export const languages = Object.keys(translations).map((translation) => ({
    text: (new Intl.DisplayNames([translation], { type: 'language' })).of(translation),
    value: translation,
}));

export function checkLanguage(language) {
    return navigator.language.split('-')[0] === language.value;
}

if (!localStorage.getItem('language')) {
    localStorage.setItem(
        'language',
        languages.some(checkLanguage) ? navigator.language.split('-')[0] : 'en'
    );
}

const locale = localStorage.getItem('language') != null
            ? localStorage.getItem('language')
            : languages.some(checkLanguage)
            ? navigator.language.split('-')[0]
            : 'en';


const i18n = new VueI18n({
    locale: locale,
    fallbackLocale: 'en',
    messages: translations,
});

Vue.prototype.i18n = i18n;

export default i18n;
