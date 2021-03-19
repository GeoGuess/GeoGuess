<template>
    <ContentPage>
        <div class="history__content">
            <HistoryTable />
        </div>
    </ContentPage>
</template>

<script>
import ContentPage from '@/components/page/ContentPage';
import HistoryTable from '@/components/history/HistoryTable';
export default {
    name: 'HistoryPage',
    components: {
        HistoryTable,
        ContentPage,
    },
};
</script>
<style lang="scss">
.history__content {
    background: #f1e9d6;
    margin: 2.5% 5%;
    border-radius: 5px;
    padding: 2%;
}
</style>
