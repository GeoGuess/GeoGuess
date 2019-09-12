import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home'
import StreetView from '@/components/StreetView'

Vue.use(Router)

export default new Router ({
  mode: 'history',
	routes: [
		{
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/street-view',
      name: 'street-view',
      component: StreetView,
    },
	],
})
