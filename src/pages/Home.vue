<template>
  <div class="home-page">
     <Header />
    <v-dialog v-model="historyDialog" >
      <History :history="history"/>
    </v-dialog>
    <section class="home-page__main">
        <v-container class="home-page__main__container" fluid >
            <v-layout row class="home-page__main__layout">
              <div class="home-page__traveler-container">
                      
                <img
                  class="home-page__traveler-img"
                  src="../assets/home/michel.png" />
              </div>
              <v-layout row class="home-page__main__content">
                <div class="box">
                  
                  <SearchBox/>
                </div>
              </v-layout>
            </v-layout>
          </v-container>
    </section>




    <Footer/>
  </div>
</template>


<script>


  import History from '@/components/History';

  import Header from '@/components/home/Header';
  import SearchBox from '@/components/home/SearchBox';
  import Footer from '@/components/home/Footer';

export default {
    components: {
      Header,
      History,
      Footer,
      SearchBox,
    },
    mounted() {
      if(this.$route.params.partyParams){
        const params = atob(this.$route.params.partyParams).split(',').map((val) => parseFloat(val));

        if(params.length === 12){
          const difficulty = params[0];
          const timeLimitation = params[1];
          const rounds = [params.slice(2,4),params.slice(4,6),params.slice(6,8),params.slice(8,10),params.slice(10,12)];
          this.$router.push({
            name:'street-view',  
            params: {
              time : timeLimitation,
              difficulty: difficulty, 
              roundsPredefined: rounds
            }
          });
        } 
    }
     
  }
};
</script>

     
 
<style scoped lang="scss">
.home-page{
    background-color: #ded3af;
    .home-page__main__container{      
      font-size: 1.2rem;
      padding: 0;
      margin: 0;
      width: 100%;
      background: url("../assets/home/worldMap.png");
      background-size: cover;
      .home-page__main__layout{
        height: calc(100vh - 150px);
        flex-wrap: nowrap;
        justify-items: end;
        .box{
          margin: auto;          
          width: 35vw;
          min-width: 400px;
        }
  
        .home-page__main__content{
          min-width: 65%;

        }
        .home-page__traveler-container{
          
          position: relative; 
          height: auto;
          width: 100%;
          max-width: 50vw;
          .home-page__traveler-img{
            position: absolute;
            bottom: 0;
            width: 100%;
            max-width: 772px;
            max-height: 814px;
          }
        }
      }
    }

}
@media (max-width: 660px) {
  .home-page{
    background-color: #ded3af;
    .home-page__main__container{   
      .home-page__main__layout{
        flex-direction: column-reverse;
      }
    }
  }
}
</style>
