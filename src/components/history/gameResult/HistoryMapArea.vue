<template>
    <div style="height: 400px" class="map-container">
        <GmapMap
            ref="mapRef"
            :center="{ lat: 0, lng: 0 }"
            :options="{
                mapTypeControl: false,
                gestureHandling: 'greedy',
                styles: $vuetify.theme.dark ? $vuetify.theme.themes.dark.gmap : $vuetify.theme.themes.light.gmap,
            }"
            :zoom="0"
            map-type-id="roadmap"
            class="map"
        >
            <div v-for="(r, index) in item.rounds" :key="index">
                <GmapMarker
                    :position="r.position"
                    :label="(index + 1).toString()"
                />
            </div>
        </GmapMap>

        <div class="result-panel">
            <div v-for="(r, index) in item.rounds" :key="index">
                <p>
                    <b>
                        {{ $t('HeaderGame.round') }} {{ index + 1 }} :
                        <FlagIcon v-if="isCountry" :iso-name=" r.country || r.area || r.position.country || r.position.are" />
                        <span v-else>{{ r.country || r.area || r.position.country || r.position.area}}</span>
                    </b>
                </p>
                <div
                    v-if="item.multiplayer" >
                    <div
                        v-for="(value, playerName, index) in r.players"
                        :key="playerName"
                        class="result-panel__item"
                        :class="{col: !isCountry}"
                    >
                        <FlagIcon  v-if="isCountry" :iso-name="value.guess" />
                        <span
                            :style="`color: ${
                                strokeColors[index % strokeColors.length]
                            }`"
                        >{{ playerName }}</span>

                        <em v-if="!isCountry" ><br/>{{value.guess}}</em>
                    </div>
                </div>
                <div v-else >

                    <FlagIcon  v-if="isCountry" :iso-name="r.guess" />
                    <em v-else>{{r.guess}}</em>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import FlagIcon from '@/components/shared/FlagIcon';
import { STROKE_COLORS } from '../../../constants';
export default {
    name: 'HistoryMapArea',
    components: {
        FlagIcon,
    },
    props: ['item', 'isCountry'],
    data() {
        return {
            strokeColors: STROKE_COLORS,
        };
    },
};
</script>
<style lang="scss" scoped>
.map-container {
    overflow: hidden;
    display: flex;

    .map {
        height: 400px;
        width: 100%;
    }

    .result-panel {
        p {
            text-align: center;
            margin: 5% 0;
            border-top: 1px solid gray;
        }
        height: 100%;
        width: 15%;
        background: var(--v-card-base);
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        width: 218px;
        &__item {
            display: inline-grid;
            grid-template-columns: 30px auto;
            grid-column-gap: 5px;
            width: 100%;
            &.col{
                display: flex;
                flex-direction: column;
                em{
                    margin: -10px;
                }
            }
        }
    }
}
</style>
