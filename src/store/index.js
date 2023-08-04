import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// Load all modules.
function loadModules() {
    const modules = {};

    const moduleKeys = import.meta.glob('./modules/*.js');
    for (const path in moduleKeys) {
        const name = path.match(/([a-z_]+)(.store)?\.js$/i)[1];
        modules[`${name}Store`] = import(path).then((m) => m.default);
    }

    return modules;
}

const modules = loadModules();
const store = new Vuex.Store({
    modules
});

if (import.meta.hot) {
    // Hot reload whenever any module changes.
    import.meta.hot.accept();
}

export default store;
