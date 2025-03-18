<script setup>
 import TournamentTile from "./TournamentTile.vue"
</script>


<template>
    <div  class="d-flex flex-row mb-3">

        <TournamentTile v-if="!loading" v-for="tournament in tournaments"  :name="tournament.name" :desc="tournament.description" :id="tournament.id" :date="tournament.date" :done="tournament.done"></TournamentTile>
        <div v-else class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>

  </template>
  
  <script>
    import axios from 'axios';
    let api_url=import.meta.env.VITE_API_URL

  export default {
    data(){
        return {
            tournaments:[],
            loading:true
        }
    },
    computed: {
      isLoggedIn() {
        return !!localStorage.getItem('token'); // Replace with your auth logic
      }
    },
    methods: {
        async fetchData(){
          this.loading=true
            this.tournaments=[]
            let token=localStorage.getItem('token')
            if(!token){
                this.$router.go('/login')
            }

            const response = await axios.get(`${api_url}/tournament/`,{
                headers: {
                        'Authorization': `Bearer ${token}`
                    }
          });
          this.tournaments=response.data
          this.loading=false
          
  

        }
    },
    mounted() {
        this.fetchData()
    },
  };
  </script>
  
  
