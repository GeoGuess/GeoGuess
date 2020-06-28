<template>
  <div>
    <div id="section-top">
      <v-img
        id="image-earth"
        src="../assets/earth.jpg" />
      <Header />
      <v-container fluid>
        <v-row
          id="row-record"
          justify="center">
          <span id="record">{{ $t('Home.record') }}: {{ record }} km</span>
        </v-row>
        <v-row
          id="row-buttons" 
          justify="center">
          <v-btn 
            id="single-player-button"
            class="ml-8 mr-8"
            dark
            color="#FF5252"
            @click="$router.push('street-view')">
            {{ $t('Home.singlePlayer') }}
          </v-btn>
          <DialogRoom />
        </v-row>
      </v-container>
    </div>
    <div id="section-about">
      <v-container>
        <v-row justify="center">
          <h3 class="section-header">{{ $t('Home.about') }}</h3>
        </v-row>
        <v-row justify="center">
          <span class="section-description">
            {{ $t('Home.aboutDescription') }}
          </span>
        </v-row>
      </v-container>
    </div>
    <div id="section-limitation">
      <v-container fluid>
        <v-row justify="center">
          <h3 class="section-header">{{ $t('Home.limitation') }}</h3>
        </v-row>
        <v-row justify="center">
          <span class="section-description">
           {{ $t('Home.limitationDescription') }}
          </span>
        </v-row>
      </v-container>
    </div>
    <Footer />
  </div>
</template>

<script>
  import firebase from 'firebase/app'
  import 'firebase/database'

  import Header from '@/components/widgets/bar/Header'
  import DialogRoom from '@/components/widgets/dialog/DialogRoom'
  import Footer from '@/components/widgets/footer/Footer'

  export default {
    components: {
      Header,
      DialogRoom,
      Footer,
    },
    data() {
      return {
        record: localStorage.getItem('record')
      }
    }
  }
</script>

<style scoped>
  span, .section-header {
    font-family: Montsetrrat;
  }

  #section-top {
    position: absolute;
    width: 100%;
    height: 640px;
    left: 0px;
    top: 0px;
    background: linear-gradient(#071D3E, #06121D);
  }

  #image-earth {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0.4;
  }

  #row-record {
    position: absolute;
    width: 100%;
    top: 200px;
  }

  #record {
    font-size: 26px;
    font-weight: 700;
    color: #FFFFFF;
  }

  #row-buttons {
    position: absolute;
    width: 100%;
    top: 300px;
  }

  #single-player-button {
    height: 44px;
    width: 240px;
    border-radius: 40px;
  }

  #section-about {
    position: absolute;
    width: 100%;
    height: 430px;
    left: 0px;
    top: 640px;
    background: #FAFAFA;
  }

  #section-limitation {
    position: absolute;
    width: 100%;
    height: 430px;
    left: 0px;
    top: 1070px;
    background: #F4F4F4;
  }

  .section-header {
    position: absolute;
    top: 94px;
    color: #52575C;
  }

  .section-description {
    position: absolute;
    top: 148px;
    padding: 0 18%;
    color: #777777;
  }

  @media (max-width: 450px) {
    #section-top {
      height: 480px;
    }

    #row-record {
      top: 120px;
    }

    #record {
      font-size: 18px;
    }

    #row-buttons {
      top: 200px;
    }

    #single-player-button {
      height: 42px;
      margin-bottom: 24px;
    }

    #section-about {
      top: 480px;
      height: 480px;
    }

    #section-limitation {
      top: 960px;
      height: 480px;
    }

    .section-header {
      top: 48px;
    }

    .section-description {
      top: 96px;
      padding: 0 12%;
    }
  }
</style>
