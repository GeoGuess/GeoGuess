import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

function loadModules() {
    const context = import.meta.globEager('./modules/*.js');

    const modules = Object.keys(context)
        .map((key) => ({ key, name: key.match(/([a-z_]+)(.store)?\.js$/i)[1] }))
        .reduce(
            (modules, { key, name }) => ({
                ...modules,
                [`${name}Store`]: context[key].default,
            }),
            {}
        );

    return { context, modules };
}

const { context, modules } = loadModules();
const store = new Vuex.Store({
    modules,
});

if (import.meta.hot) {
    import.meta.hot.accept(
        [
            './modules/alert.store.js',
            './modules/area.store.js',
            './modules/home.store.js',
            './modules/settings.store.js',
        ],
        (newModules) => {
            if (newModules) {
                const { modules } = loadModules();
                Object.keys(context).map((key, i) => {
                    if (newModules[i]) {
                        const name = key.match(/([a-z_]+)(.store)?\.js$/i)[1];
                        modules[name + 'Store'] = newModules[i].default;
                    }
                });

                store.hotUpdate({
                    modules,
                });
            }
        }
    );
}
export default store;
