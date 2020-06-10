<template>
  <v-card>
   <v-card-title>
      History
   </v-card-title>
    <v-data-table
    id="history-table"
    :headers="headers"
    :items="items"
    show-expand
    single-expand
    item-key="date"
  >    
    <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
            <GmapMap
                :center="{lat:0, lng:0}"
                :options="{
                    mapTypeControl: false,
                }"
                :zoom="0"
                map-type-id="terrain"
                :style="'width:'+($viewport.width-100)+'px ; height: 400px'"
                >
                <GmapMarker
                    :key="'g'+index"
                    v-for="(m, index) in item.rounds"
                    :position="m.guess"
                />
                <GmapMarker        
                    :icon="icon"
                    :key="'p'+index"
                    v-for="(m, index) in item.rounds"
                    :position="m.position"
                />
                
                <GmapInfoWindow
                    :key="'i'+index"
                    v-for="(m, index) in item.rounds"
                    :options="{position: m.guess}">        
                    <p><b>{{m.distance / 1000 }} </b> km away!</p>
                </GmapInfoWindow>
                <GmapPolyline 
                    :key="'l'+index"
                    v-for="(m, index) in item.rounds"
                    :path="[m.position, m.guess]"
                />
            </GmapMap>
        </td>
    </template>
  </v-data-table>
  </v-card>
</template>
<script>
export default {
    name:"History",
    props:["history"],
    data(){
        return {
            icon: window.location.origin+'/img/icons/favicon-16x16.png',
            headers: [
                {
                    text: "Date",
                    value: 'dateString',
                },
                {
                    text: "Mode",
                    value: 'mode',
                },
                {
                    text: "Time",
                    value: 'time',
                },
                {
                    text: "Score",
                    value: 'score',
                },  
                { 
                    text: '', 
                    value: 'data-table-expand' 
                },
            ]
        }
    },
    computed:{
        items(){
            return this.history.map((g) => ({
                ...g,
                dateString: new Date(g.date).toLocaleString(),
                mode: g.multiplayer ? "With Friends": "Single Player",
                time: g.timeLimitation===0 ? "Infinite": g.timeLimitation
            }))
        }
    }
}
</script>

