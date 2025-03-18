<script setup>
import axios from "axios"
import TournamentTile from "./TournamentTile.vue"
</script>

<template>
    <div class="container mb-2">
        <h2>Tournois en cours</h2>

        <div v-if="!loading" class="d-flex flex-row">
            <div v-for="tournament in notCompletedTounaments" >
                <TournamentTile :name="tournament.name" :desc="tournament.description" :id="tournament.id" :date="tournament.date" :done="tournament.done" :winner="tournament.winner"></TournamentTile>
            </div>
        </div>
        <div v-else class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        
    </div>
    <div class="container">
        <h2>Tournois Terminés</h2>
        <div  v-if="!loading" class="d-flex flex-row">
            <div class="m-2" v-for="tournament in completedTournaments">
                <TournamentTile  :name="tournament.name" :desc="tournament.description" :id="tournament.id" :date="tournament.date" :done="tournament.done" :winner="tournament.winner" :ranking="tournament.ranking"></TournamentTile>
            </div>
        </div>
        <div v-else class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>

        
    </div>
</template>

<script>
let api_url=import.meta.env.VITE_API_URL

export default {
    data() {
        return {
            completedTournaments:[],
            notCompletedTounaments:[],
            loading:true,
           
        }
    },methods:{
        async fetchTournaments(){
            this.loading=true

            let tournaments=await axios.get(`${api_url}/tournament`)
          
       
            
            this.completedTournaments=tournaments.data.filter((tournament)=>{return tournament.done})
            this.notCompletedTounaments=tournaments.data.filter((tournament)=>{return !tournament.done})
            this.loading=false
        }
    },
    mounted() {
        this.fetchTournaments()
    },
}
</script>