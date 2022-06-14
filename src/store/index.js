import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
// Load all modules.
function loadModules() {
	const context = require.context('./modules', false, /([a-z_]+)\.js$/i);

	const modules = context
		.keys()
		.map((key) => ({ key, name: key.match(/([a-z_]+)(.store)?\.js$/i)[1] }))
		.reduce(
			(modules, { key, name }) => ({
				...modules,
				[`${name}Store`]: context(key).default,
			}),
			{},
		);

	return { context, modules };
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