<template>
    <ContentPage>
        <div class="content">
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
