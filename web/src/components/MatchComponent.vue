<script setup>
 import axios from 'axios';
import MatchTile from "./MatchTile.vue"
</script>

<template>
    <p><button class="btn btn-primary" @click="shuffleMatches()">Faire/Refaire matchs</button></p>
    <ul v-if="!loading"  class="list-group list-group-flush">
        <li v-for="match in matches" class="list-group-item">
            <MatchTile :match="match" @refresh="fetchMatches"></MatchTile>
        </li>
    </ul>
    <div v-else class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </template>
  
  <script>

let api_url=import.meta.env.VITE_API_URL

  export default {
    emits: ['refresh'],
    data(){
        return {
            matches:[],
            loading:true
        }
    },
    props:["tournamentid"],
    computed: {
      isLoggedIn() {
        return !!localStorage.getItem('token'); // Replace with your auth logic
      }
      
    },
    methods: {
      async isTokenValid(token) {
  
      try {
        const response = await axios.get(`${api_url}/auth/valid`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // If status is 200, return true
        if (response.status === 200) {
          return true;
        }
        
        return false;  // In case the status isn't 200 for some reason
      } catch (error) {
        // If an error occurs, return false (token invalid or other issue)
        return false;
      }
    },
      async fetchMatches(){
        this.loading=true
        this.matches=[]
        let token=localStorage.getItem('token')
        let isValid=await this.isTokenValid(token) 
      
        
      if(!token || !isValid){
          
          
          this.$router.replace('/login')
      }
            let matches=await axios.get(`${api_url}/match/tournament/${this.tournamentid}`,{
                headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json' 
                    },
            })
           
            
            this.matches=matches.data
            this.$emit('refresh')
            this.loading=false

      },
      async shuffleMatches(){
        let token=localStorage.getItem('token')
        let isValid=await this.isTokenValid(token) 
      
        
      if(!token || !isValid){
          
          
          this.$router.replace('/login')
      }
        await axios.post(`${api_url}/tournament/${this.tournamentid}/shuffle`,{},{
                headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json' 
                    },
            })
            this.fetchMatches()
      }
    },
    mounted(){
        this.fetchMatches()
    }
  };
  </script>
  
