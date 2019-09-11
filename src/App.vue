<template>
  <v-app>
    <StreetView />
  </v-app>
</template>

<script>
import StreetView from './components/StreetView';

export default {
  name: 'App',
  components: {
    StreetView,
  },
  data: () => ({
    //
  }),
};
</script>
