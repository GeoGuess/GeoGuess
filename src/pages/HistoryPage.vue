<template>
    <ContentPage>
        <div class="content">
            <HistoryTable />
        </div>
    </ContentPage>
</template>

<script>
import ContentPage from '../components/page/ContentPage.vue';
import HistoryTable from '../components/history/HistoryTable.vue';
export default {
    name: 'HistoryPage',
    components: {
        HistoryTable,
        ContentPage,
    },
};
</script>
