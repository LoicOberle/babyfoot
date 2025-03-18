<template>
<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <router-link to="/" class="nav-link" >Babyfoot</router-link>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item" v-if="isLoggedIn" >
          <router-link class="nav-link"  to="/dashboard">Tableau de bord</router-link>
       
        </li>
        <li class="nav-item">
          <router-link class="nav-link" v-if="!isLoggedIn" to="/login">Se connecter</router-link>
          <button class="nav-link" v-else @click="logout">Se déconnecter</button>
        </li>
      </ul>
    </div>
  </div>
</nav>
    <!-- <div>
      <router-link to="/">Accueil</router-link>
      <router-link v-if="!isLoggedIn" to="/login">Login</router-link>
      <button v-else @click="logout">Logout</button>
      <router-link v-if="isLoggedIn" to="/dashboard">Dashboard</router-link>
      
    </div> -->
  </template>
  
  <script>
  let api_url=import.meta.env.VITE_API_URL

  export default {
    computed: {
      isLoggedIn() {
        let token=localStorage.getItem('token')
        return !!localStorage.getItem('token') && this.isTokenValid(token); // Replace with your auth logic
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
      logout() {
        localStorage.removeItem('token'); // Clear auth token
        this.$router.go('/'); // Redirect to login page
       
      }
    }
  };
  </script>
  
  <style scoped>
 
  </style>
  