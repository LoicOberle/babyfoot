<script setup>
import EditTournament from "./EditTournament.vue"
</script>

<template>
     <div class="card"  >
        <div class="card-body">
            <h5 class="card-title">{{ name }}</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">{{ prettyDate }}</h6>
            <p class="card-text">{{ desc }}</p>
            <p> <EditTournament :id="id" :done="done"></EditTournament> </p>
           
        </div>
    </div>


</template>

<script>
export default{
    props:["name","desc","id","date","done"],
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
    }
}
</script>