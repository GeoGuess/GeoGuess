<template>
    <v-app>
        <router-view />
    </v-app>
</template>

<script>
import { mapActions } from 'vuex';
export default {
    name: 'App',
   mounted(){
       this.loadHomeStore();
   },
   methods:{
        ...mapActions(['loadHomeStore']),
   }
};
</script>
