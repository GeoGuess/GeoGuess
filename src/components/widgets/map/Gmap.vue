<template>
    <GmapMap
        :center="{lat:10, lng:10}"
        :zoom="1"
        ref="mapRef"
        map-type-id="terrain"
        style="width: 100%; height: 500px"
        :options="{
            gestureHandling: 'greedy'
        }"
        >
    
    </GmapMap>
</template>