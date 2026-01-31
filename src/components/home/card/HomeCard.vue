<template>
    <v-card class="map-card" rounded="lg" width="200">
        <v-img
            class="white--text align-end"
            height="150px"
            gradient="rgba(0,0,0,0), rgba(0,0,0,0.8)"
            :src="data.imageSrc"
        >
            <v-menu v-if="data.type === 'custom'">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        icon
                        absolute
                        top
                        left
                        dark
                        v-bind="attrs"
                        v-on="on"
                    >
                        <v-icon> mdi-file</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item @click="editMap">
                        <v-list-item-title>
                            {{ $t('Home.HomeCard.edit') }}
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="deleteMap">
                        <v-list-item-title>
                            {{ $t('Home.HomeCard.delete') }}
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <template v-if="colorMedal && type === 'map'" >
                <div class="map-card__medal-banner" :class="`map-card__medal-banner--${colorMedal}`">
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
          
                            <v-btn
                                class="map-card__medal-button"
                                dark
                                icon
                                to="/history"
                                small
                                v-bind="attrs"
                                v-on="on"
                            >
                                {{ $t(`Home.HomeCard.medal.${colorMedal}`) }}
                            </v-btn>
                    
                        </template>
                        <span>{{ maxScore.toLocaleString() }}</span>
                    </v-tooltip>
                </div>
            </template>


            <v-card-title class="map-card__title" :title="data.nameLocate">
                {{ data.nameLocate }}
            </v-card-title>
        </v-img>
        <v-card-actions class="map-card__actions">
            <v-subheader>{{ $t('Home.HomeCardMode.' + type) }}</v-subheader>
            <v-spacer />
            <HomeCardDialog :data="data" :type="type" />
        </v-card-actions>
    </v-card>
</template>

<script>
import HomeCardDialog from '@/components/home/card/HomeCardDialog';
import { mapActions, mapGetters } from 'vuex';
import { GeoMapType } from '../../../models/GeoMap';
import { getMedals } from '@/utils/game/medals';

export default {
    name: 'HomeCard',
    components: {
        HomeCardDialog,
    },
    props: {
        data: Object,
        type: {
            type: String,
            validator: (v) => ['map', 'area'].includes(v),
        },
    },
    computed: {
        ...mapGetters(['getMaxScoreMap']),
        maxScore(){
            if(this.type === 'map'){
                return this.getMaxScoreMap(this.data);
            }
            return undefined;           
        },
        colorMedal(){
          return getMedals(this.maxScore);
        }
    },
    methods: {
        ...mapActions(['getListMapsCustoms', 'setMapLoaded']),
        async deleteMap() {
            if (this.type === 'map' && this.data.type === GeoMapType.Custom) {
                await this.data.delete();
                this.getListMapsCustoms();
            }
        },
        async editMap() {
            this.setMapLoaded(this.data);
            this.$router.push('/custom');
        },
    },
};
</script>

<style lang="scss">
.map-card {
    min-width: 340px;
    &__actions {
        padding: 1%;
    }
    &__title{
        text-overflow: ellipsis; 
        white-space: nowrap; 
        overflow: hidden;
        display: block;
    }
    &__medal-banner{
        position: absolute;
        width: 170px;
        height: 60px;
        transform: rotate(45deg);
        top: -10px;
        right: -60px;
        box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
        &--platinum{
            background: linear-gradient(45deg, #468f69 0%, #fcc200 100%);
        }
        &--gold{
            background: #fcc200;
        }
        &--silver{
            background: #b8b8b8;
        }
        &--bronze{
            background: #CC8E34;
        }
        display: flex;
        justify-content: center;
        align-items: flex-end;
        &__button{
            margin-bottom: 10px;
        }
    }
}
</style>
