<script setup>
import axios from "axios"
import Ranking from "./Ranking.vue"
</script>

<template>
    <div class="card" style="width: 18rem; height: 18rem;" >
        <div class="card-body">
            <h5 class="card-title">{{ name }}</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">{{ prettyDate }}</h6>
            <p class="card-text">{{ desc }}</p>
            <p v-if="done"> Vainqueurs: {{ winners }} </p>
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" :data-bs-target="'#exampleModal'+id">Détail</button>
        </div>
    </div>

  

    <!-- Modal -->
    <div class="modal fade" :id="'exampleModal'+id" tabindex="-1" aria-hidden="true" data-bs-theme="dark">
    <div class="modal-dialog modal-xl custom-modal">
        <div class="modal-content">
        <div class="modal-header">
            <h1 class="modal-title fs-5">
                {{ name }}
                
                <span v-if="done">
                    -
                    Vainqueurs:
                    {{ winners }}
                </span>
            </h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            
            <div class="container">
                <div class="row">
                    <div class="col">
                        <Ranking v-if="ranking" :ranking="ranking"></Ranking>
                        <h5 v-else>Tournoi toujours en cours, classement à venir !</h5>
                    </div>
                    <div class="col">
                        <h2>Déroulé des matchs</h2>
           <ul>
           
          
                <li  v-for="match in matches" class="list-group">
                    <div class="card w-100" >
                        <div class="card-body">
                            <h5 class="card-title">{{ match.team1.name }} - {{ match.team2.name }}</h5>
                            <h6 class="card-subtitle mb-2 text-body-secondary">{{ match.team1score }} - {{ match.team2score }}</h6>
                            <p class="card-text"> 
                                <div v-if="match.done">
                                    Terminé ! 
                                </div>
                                <div v-else>
                                    Toujours en cours ! 
                                </div>
                            </p>
                          
                        </div>
                    </div>
            </li>
           </ul>
                    </div>
                </div>
            </div>


          
          
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
          
        </div>
        </div>
    </div>
    </div>

</template>

<script>
let api_url=import.meta.env.VITE_API_URL
export default {
    props:["id","name","desc","date","done","winner","ranking"],
    data() {
        return {
         matches:[]
        }
    },
    computed:{
        prettyDate(){
            let temp=new Date(this.date)
            let options={
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            }
            return temp.toLocaleDateString("fr-FR", options)
        },
        winners() {
            return Array.isArray(this.winner) ? this.winner.join(', '):this.winner; // Join the array with a comma separator
    }
    },
    methods: {
        async fetchMatches(){
            this.matches=[]
            let matches=await axios.get(`${api_url}/match/tournament/${this.id}`)
            this.matches=matches.data
        }
    },
    mounted() {
        this.fetchMatches()
    },
}
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