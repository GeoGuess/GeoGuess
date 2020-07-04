<template>
   <v-dialog :value="this.visibility" @input="$emit('changeVisibility')">
      <v-card class="dialog-customs" color="#061422">
         <v-card-title>
            <p>{{$t('DialogCustomMap.title')}}</p>
         </v-card-title>
         <v-card-text>
            <v-row no-gutters>
              <v-col md="5" class="mr-6">
                <v-alert type="error" v-if="value && !validGeoJson" transition="out-in" >
                  {{$t('DialogCustomMap.invalid')}}
                </v-alert>
              
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
              </v-col>
              
              <v-col>
                <v-radio-group v-model="type" row dark>
                  <v-radio :label="$t('DialogCustomMap.text')" value="text"></v-radio>
                  <v-radio :label="$t('DialogCustomMap.url')"  value="url"></v-radio>
                  <v-radio :label="$t('DialogCustomMap.file')" value="file"></v-radio>
                  <v-radio :label="$t('DialogCustomMap.edit')" value="edit"></v-radio>
                </v-radio-group>
                <v-file-input
                  v-if="type==='file'"
                  :label="$t('DialogCustomMap.fileLabel')"
                  v-model="file"
                  prepend-icon="mdi-map"
                  dark
                  ></v-file-input>
                <v-text-field
                  v-else-if="type==='url'" placeholder='https://gist.github.com/...' label="Url" type="text" v-model="url" :rules="rulesUrl" dark/>
                <v-textarea v-else :error="value !== '' && !validGeoJson" :success="validGeoJson" dark :value="value" v-on:input="onChangeTextArea" :placeholder="placeholderGeoJson" rows="25" filled clearable>
                </v-textarea>
              </v-col>
            </v-row>
         </v-card-text>
         <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn
               dark
               color="#43B581"
               @click="$emit('changeVisibility')">
               OK
            </v-btn>
         </v-card-actions>
      </v-card>
   </v-dialog>
</template>

<script>
import {validURL} from '@/utils'
import axios from 'axios'

export default {
    name:'DialogCustomMap',
    props: ['visibility','value', 'validGeoJson'],
    data(){
        return {
            placeholderGeoJson: geoJsonExample,
            rulesUrl: [
            value => validURL(value),
            ],
            type: 'text',
            file: null,
            url: '',
            initMap: false,
            editMap: false,
        }
    },
    methods: {
        onChangeTextArea(e){
            this.$emit('input',e)
        },
        
        onChangeMap(){
          this.editMap = true
          this.$refs.mapRef.$mapPromise.then((map) => {
            map.data.toGeoJson((geoJson) =>  this.$emit('input',JSON.stringify(geoJson, null, 2)));
          });
        }
    },
    updated(){
      if(!this.initMap){
        this.$nextTick(() => {
          if(this.$refs.mapRef)
            this.$refs.mapRef.$mapPromise.then((map) => {
                let data = new google.maps.Data({
                  map: map,
                });
                if(this.value)
                  data.addGeoJson(JSON.parse(this.value))
                map.data.setMap(null);
                map.data = data;
                this.initMap = true;
            });
        });
      }
    },
    watch: {
      value(v){
        if(!this.editMap){
          this.$refs.mapRef.$mapPromise.then((map) => {
            let data = new google.maps.Data({
              map: map,
              style: map.data.getStyle(),
              controls: map.data.getControls(),
            });
            try{
              data.addGeoJson(JSON.parse(v))
            }catch(e){
            }
            
            if(this.type === 'edit'){
              data.addListener('addfeature', this.onChangeMap);
              data.addListener('removefeature', this.onChangeMap);
              data.addListener('setgeometry', this.onChangeMap);
            }
            map.data.setMap(null);
            map.data = data;
          })
        }else{          
          this.editMap = false;
        }
      },
      file(file){
        
        if(typeof file === 'object' && file.text){
          file.text().then((content) => {
                this.$emit('input', content)

          });

        }

      },
      url(value){
        if(validURL(value)){
          // if gist url get raw
          /* eslint-disable no-useless-escape */
          if(RegExp('^(https?:\/\/)?gist\.github\.com\/').test(value)){
            let urlSplit = value.split('/')
            if(urlSplit.length > 3 && urlSplit[urlSplit.length-1]!== 'raw'){
              urlSplit[urlSplit.length-3] = 'gist.githubusercontent.com'
              urlSplit.push('raw')
              value = urlSplit.join('/')
            }
              
          }
         axios.get(value)
          .then( res => {
            if(res.status === 200 && res.data){
              if(typeof res.data === 'object'){
                this.$emit('input', JSON.stringify(res.data, null, 2))
              }else{
                this.$emit('input', res.data)
              }
            }
          })
          .catch(err => {
            console.log(err)
          })


        }

      },
      type(t){
          this.$refs.mapRef.$mapPromise.then((map) => {
            if(t === 'edit'){
              map.data.setControls(['Point', 'Polygon']);
              map.data.setStyle({
                editable: true,
                draggable: true,
              });
              map.data.addListener('addfeature', this.onChangeMap);
              map.data.addListener('removefeature', this.onChangeMap);
              map.data.addListener('setgeometry', this.onChangeMap);
            }else{
              map.data.setControls(null);
              map.data.setStyle({});
              
              map.data.removeEventListener('addfeature', this.onChangeMap);
              map.data.removeEventListener('removefeature', this.onChangeMap);
              map.data.removeEventListener('setgeometry', this.onChangeMap);
            }
          })
      }
    }
}

const geoJsonExample = `{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [0, 0.0], [10.0, 0.0], [10, 20],
               [0.0, 20], [0, 0.0] ]]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [0, 0.0], [10.0, 0.0], [10, 20],
               [0.0, 20], [0, 0.0] ]]
      }
    }
   ]
}`
</script>
<style lang="scss" scoped>

  .dialog-customs {
    color: #FFFFFF;
  }
</style>