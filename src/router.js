import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home'
import StreetView from '@/components/StreetView'
import StreetViewWithFriends from '@/components/StreetViewWithFriends'
import PrivacyPolicy from '@/components/PrivacyPolicy'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

export default new Router ({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/',
    },
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/index.html',
      name: 'home',
      component: Home,
    },
    {
      path: '/street-view',
      name: 'street-view',
      component: StreetView,
    },
    {
      path: '/street-view/with-friends',
      name: 'with-friends',
      component: StreetViewWithFriends,
      props: true,
    },
    {
      path: '/privacy-policy',
      name: 'privacy-policy',
      component: PrivacyPolicy,
    },
  ],
})
