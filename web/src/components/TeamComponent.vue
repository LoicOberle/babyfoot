<script setup>
import axios from 'axios';
</script>

<template>
    <h3>Nouvelle equipe</h3>
    <form @submit.prevent="createTeam">

        <p>
            <label class="form-label"></label>
            <input class="form-control" type="text" v-model="name" required>
        </p>
       
        <button class="btn btn-info" type="submit">Ajouter</button>


    </form>
    <ul  class="list-group">
        <li v-for="team in teams" class="list-group-item">{{ team.name }} <button :disabled="done" class="btn btn-danger" @click="deleteTeam(team.id)">X</button></li>
   </ul>
  </template>
  
  <script>
  let api_url=import.meta.env.VITE_API_URL
  
  export default {
    props:["tournamentid","done"],
    data(){
        return {
            name:"",
            teams:[]
        }
    },
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
      async createTeam(){
        let token=localStorage.getItem('token')
        let isValid=await this.isTokenValid(token) 
      
        
      if(!token || !isValid){
          
          
          this.$router.replace('/login')
      }
        let response=await axios.post(`${api_url}/team`,{
            name:this.name,
            tournamentid:this.tournamentid
        },{
            headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json' 
                    },
        })
        //Refresh team list
        this.name=""
        this.fetchData()
      },
      async fetchData(){
        this.teams=[]
            let token=localStorage.getItem('token')
            if(!token){
                this.$router.go('/login')
            }
            let teams=await axios.get(`${api_url}/team/tournament/${this.tournamentid}`,{
                headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json' 
                    },
            })
           
            
            this.teams=teams.data
            
            
        },
        async deleteTeam(id){
            let token=localStorage.getItem('token')
            if(!token){
                this.$router.go('/login')
            }
            await axios.delete(`${api_url}/team/${id}`,{
                headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json' 
                    },
            })
            this.fetchData()
        }
    },
    mounted(){
        this.fetchData()
    }
  };
  </script>
  
 