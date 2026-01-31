import { createStore } from 'vuex';

// Load all modules.
function loadModules() {
	const modules = import.meta.glob('./modules/*.js', { eager: true });
	
	return Object.keys(modules).reduce((acc, path) => {
		const name = path.match(/\/([a-z_]+)(.store)?\.js$/i)[1];
		acc[`${name}Store`] = modules[path].default;
		return acc;
	}, {});
}

const modules = loadModules();
const store = createStore({
    modules,
});

export default store;