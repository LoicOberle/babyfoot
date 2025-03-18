<script setup>
  import axios from 'axios';
</script>

<template>
   <!-- Button trigger modal -->
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#tournamentModal">
Nouveau tournoi
</button>

<!-- Modal -->
<div class="modal fade" id="tournamentModal" tabindex="-1" aria-labelledby="tournamentModalLabel" aria-hidden="true" data-bs-theme="dark">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="tournamentModalLabel">Nouveau tournois</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form @submit.prevent="createTournament">
      <div class="modal-body">
           
                <div>
                    <label class="form-label">Nom:</label>
                    <input class="form-control" type="text" v-model="name" required />
                </div>
                <div>
                    <label class="form-label">Description:</label>
                   <textarea class="form-control" v-model="description" required></textarea>
                </div>
                <div>
                    <label class="form-label">Date:</label>
                    <input class="form-control" type="date" v-model="date" required>
                </div>
           
      
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button class="btn btn-info" type="submit">
            Creer tournoi
            </button>
      </div>
    </form>
    </div>
  </div>
</div>


  </template>
  
  <script>
  let api_url=import.meta.env.VITE_API_URL

  export default {
    data() {
      return {
        name: '',
        description: '',
        date: '',
       
      };
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
        async createTournament(){

            let token=localStorage.getItem('token')
            let isValid=await this.isTokenValid(token) 
      
        
      if(!token || !isValid){
          
          
          this.$router.replace('/login')
      }
            try {
          const response = await axios.post(`${api_url}/tournament`,{
            "name":this.name,
                    "description":this.description,
                    "date":this.date
          }, {
            headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json' 
                    },
                   
          });
  
         
  
          
          this.$router.go("/dashboard");
        } catch (error) {
            console.error(error);
        
        }
            
        }
    }
  };
  </script>
  
