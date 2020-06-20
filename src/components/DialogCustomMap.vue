<template>
   <v-dialog :value="this.visibility" @input="$emit('changeVisibility')">
      <v-card class="dialog-customs" color="#061422">
         <v-card-title>
            <p>Paste GeoJSON <small> (<a target="_blank" href="https://tomscholz.github.io/geojson-editor/">Open Editor</a>)</small></p>
         </v-card-title>
         <v-card-text>
            <v-radio-group v-model="type" row dark>
               <v-radio label="Text" value="text"></v-radio>
               <v-radio label="Url"  value="url"></v-radio>
               <v-radio label="File" value="file"></v-radio>
            </v-radio-group>
            <v-file-input
               v-if="type==='file'"
               label="GeoJson File"
               v-model="file"
               prepend-icon="mdi-map"
               dark
               ></v-file-input>
            <v-text-field
               v-else-if="type==='url'" placeholder='https://gist.github.com/...' label="Url" type="text" v-model="url" :rules="rulesUrl" dark/>
            <v-textarea v-else :error="errorGeoJson" :success="validGeoJson" dark :value="value" v-on:input="onChangeTextArea" :placeholder="placeholderGeoJson" rows="20">
            </v-textarea>
         </v-card-text>
         <v-card-actions>
            <v-btn
               dark
               @click="dialogCustom = !dialogCustom">
               OK
            </v-btn>
         </v-card-actions>
      </v-card>
   </v-dialog>
</template>

<script>
import {validURL} from '@/utils'

export default {
    name:'DialogCustomMap',
    props: ['visibility','value', 'validGeoJson'],
    data(){
        return {
            placeholderGeoJson: geoJsonExample,
            errorGeoJson: false,
            rulesUrl: [
            value => validURL(value),
            ],
            type: 'text',
            file: null,
            url: '',
        }
    },
    methods: {
        onChangeTextArea(e){
            this.$emit('input',e)
        }
    },
    watch: {
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
                this.$emit('input', JSON.stringify(res.data))
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