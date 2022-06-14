import * as MutationTypes from '../mutation-types';

export default {
    namespaced: true,
    state: {
        alert: undefined,
    },
    mutations: {
        [MutationTypes.ALERT_SET_ALERT](state, alert) {
            state.alert = alert;
        },
    },
    actions: {
        setAlert({ commit }, alert) {
            commit(MutationTypes.ALERT_SET_ALERT, alert);
        },
    },
};
