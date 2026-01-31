import useClipboard from 'vue-clipboard3';

export default {
    install(app) {
        const { toClipboard } = useClipboard();
        
        app.config.globalProperties.$copyText = async (text, container) => {
            try {
                await toClipboard(text);
                return { type: 'success', text };
            } catch (e) {
                return { type: 'error', text: e };
            }
        };
    },
};
