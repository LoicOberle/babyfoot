<script setup>
 import axios from 'axios';
import TeamComponent from "./TeamComponent.vue"
import MatchComponent from './MatchComponent.vue'
</script>

<template>
  <button type="button" class="btn btn-primary" data-bs-toggle="modal" :data-bs-target="'#editTournament'+id" @click="fetchData">
 Modifier
</button>

<!-- Modal -->
<div class="modal fade" :id="'editTournament'+id" tabindex="-1" aria-labelledby="editTournamentLabel" aria-hidden="true" data-bs-theme="dark">
  <div class="modal-dialog modal-xl custom-modal">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="editTournamentLabel" v-if="tournament != null">Editer {{ tournament.name }}</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body"  v-if="tournament != null">
      
        <div class="container">
          <div class="row">
            <div class="col">
              <MatchComponent :tournamentid="tournament.id"></MatchComponent>
            </div>
            <div class="col">
              <TeamComponent :tournamentid="tournament.id" :done="done"></TeamComponent>
            </div>
          </div>
        </div>


      
       
        
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
        <button type="button" class="btn btn-danger" @click="deleteTournament">Supprimer</button>
      </div>
    </div>
  </div>
</div>

  </template>
  
  <script>

let api_url=import.meta.env.VITE_API_URL
  export default {
    props:["id","done"],
    data(){
        return {
            tournament:null
        }
    },
    computed: {
      isLoggedIn() {
        return !!localStorage.getItem('token'); // Replace with your auth logic
      }
    },
    methods: {
        async fetchData(){
            let token=localStorage.getItem('token')
            if(!token){
                this.$router.go('/login')
            }
            let tournament=await axios.get(`${api_url}/tournament/${this.id}`,{
                headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json' 
                    },
            })
            this.tournament=tournament.data
            
            
        },
        async deleteTournament(){
            let token=localStorage.getItem('token')
            if(!token){
                this.$router.go('/login')
            }
            let tournament=await axios.delete(`${api_url}/tournament/${this.id}`,{
                headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json' 
                    },
            })
            this.$router.go('/dashboard')
            
            
        }
    },
    mounted() {
       // this.fetchData()
    },
  };
  </script>
  
  <style>
  .custom-modal .modal-content {
    max-height: 90vh; /* Prevent modal from exceeding viewport height */
    display: flex;
    flex-direction: column;
  }
  
  .custom-modal .modal-body {
    overflow-y: auto; /* Enable scrolling inside modal */
    flex-grow: 1;
  }
  
  </style>