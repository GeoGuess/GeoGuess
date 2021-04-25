<template>
    <v-app>
        <router-view />
    </v-app>
</template>

<script>
import client from './discord.js';
export default {
    name: 'App',
    data: () => ({
        //
    }),
    mounted() {
 
const a =  client;
return a;
    },
};
</script>
