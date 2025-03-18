<template>
    <h2>Classement</h2>
   <ol class="list-group list-group-numbered" >
    <li v-for="([key, value], index) in Object.entries(ranking)" :key="index" class="list-group-item" :class="getItemClass(index)"> 
        
        {{ key }} - {{ value }}</li>
   
   </ol>
</template>

<script>
export default {
   props:["ranking"],
  methods: {
    getItemClass(index){
        switch (index) {
            case 0:
                return "gold"
                break;
            case 1:
                return "silver"
                break;
            case 2:
                return "bronze"
                break;
        
            default:
                return ""
                break;
        }
    }
  },
}
</script>

<style>
.gold{
    color: black;
    background-color:  	#FFD700;
}
.silver{
    color: black;
background-color: #C0C0C0;
}
.bronze{
    color: black;
background-color:  	#CD7F32;
}
</style>