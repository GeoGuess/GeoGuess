import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
// Load all modules.
function loadModules() {
	const localContext = require.context('./modules', false, /([a-z_]+)\.js$/i);

	const modules = localContext
		.keys()
		.map((key) => ({ key, name: key.match(/([a-z_]+)(.store)?\.js$/i)[1] }))
		.reduce(
			(m, { key, name }) => ({
				...m,
				[`${name}Store`]: localContext(key).default,
			}),
			{},
		);

	return { context: localContext, modules };
}

const { context, modules } = loadModules();
const store = new Vuex.Store({
    modules,
});

if (module.hot) {
	// Hot reload whenever any module changes.
	module.hot.accept(context.id, () => {
		const { modules } = loadModules();

		store.hotUpdate({
			modules,
		});
	});
}


export default store;