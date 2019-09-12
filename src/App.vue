<template>
  <v-app>
    <Home />
  </v-app>
</template>

<script>
import Home from './components/Home'
import StreetView from './components/StreetView';

export default {
  name: 'App',
  components: {
    Home,
    StreetView,
  },
  data: () => ({
    //
  }),
};
</script>
