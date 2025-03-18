<script setup>
import axios from 'axios';

</script>

<template>
    <div class="card w-100">
  <div class="card-body">
    <h5 class="card-title">{{ match.team1.name }} - {{ match.team2.name }}</h5>
    <h6 class="card-subtitle mb-2 text-body-secondary"> {{ match.team1score }} - {{ match.team2score }}</h6>
    <p>
        <div v-if="!match.done">
                <form @submit.prevent="updateMatch">
                    <p>
                        <label class="form-label">Score team 1</label>
                        <input class="form-control" type="number" v-model="team1score" min="0">
                    </p>
                    <p>
                        <label class="form-label">Score team 2</label>
                        <input class="form-control" type="number" v-model="team2score" min="0">
                    </p>
                    <p><button class="btn btn-warning" type="submit">Mettre a jour le score</button></p>
                </form>
                <form @submit.prevent="finishMatch">
                   
                    <p><button type="submit" class="btn btn-success">Terminer le match</button></p>
                </form>
            </div>
            <div v-else>
                <form @submit.prevent="undoMatch">
                  
                    <button type="submit" class="btn btn-secondary">Reprendre le match</button>
                </form>
            </div>
    </p>
  </div>
</div>
     
           
         
      

</template>

<script>

let api_url=import.meta.env.VITE_API_URL

export default {
    props:["match"],
    emits: ['refresh'],
    data(){
        return {
            team1score:this.match.team1score,
            team2score:this.match.team2score
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

   async updateMatch(){
    let token=localStorage.getItem('token')
        let isValid=await this.isTokenValid(token) 
      
        
            if(!token || !isValid){
                
                this.$router.replace('/login')
            }
            let match=await axios.put(`${api_url}/match/${this.match.id}`,{
                team1score:this.team1score,
                team2score:this.team2score
            },{
            headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json' 
                    },
        })
        this.$emit('refresh');
   },
   async finishMatch(){
    let token=localStorage.getItem('token')
    let isValid=await this.isTokenValid(token) 
      
        
      if(!token || !isValid){
          
          this.$router.replace('/login')
      }
            let match=await axios.put(`${api_url}/match/${this.match.id}`,{
                team1score:this.team1score,
                team2score:this.team2score,
                done:true
            },{
            headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json' 
                    },
        })
        this.$emit('refresh');
   },
   async undoMatch(){
    let token=localStorage.getItem('token')
    let isValid=await this.isTokenValid(token) 
      
        
            if(!token || !isValid){
              
                
                this.$router.replace('/login')
            }
            let match=await axios.put(`${api_url}/match/${this.match.id}`,{
                done:false
            },{
            headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json' 
                    },
        })
        this.$emit('refresh');
   },
  },
  mounted(){}
};
</script>