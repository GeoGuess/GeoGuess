<template>
    <div>
        <GmapMap
            :center="{ lat: 0, lng: 0 }"
            :options="{
                mapTypeControl: false,
                gestureHandling: 'greedy',
            }"
            :zoom="1"
            map-type-id="roadmap"
            style="height: 510px"
        >
            <div  v-for="(item) in history" :key="item.date">
                <div
                    v-for="(r, index) in item.rounds"
                    :key="index"
                >
                    <GmapMarker
                        :position="r.position"
                    />
                </div>
            
            </div>
        </GmapMap>
    </div>


</template>

<script>
export default {
    data() {
        return {
            history: localStorage.getItem('history')
                        ? JSON.parse(localStorage.getItem('history'))
                        : [],
                        
            icon: {
                path: 3,
                strokeColor: "#000000"
            },
        };
    }
};
</script>

<style>

</style>