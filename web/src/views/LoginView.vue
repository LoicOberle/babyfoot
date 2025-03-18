<template>
   
    <div class="login-container">
        <h1><a class="nav-link"  href="/">Babyfoot</a></h1>
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div>
          <label>Email:</label>
          <input type="email" v-model="email" required />
        </div>
        <div>
          <label>Mot de passe:</label>
          <input type="password" v-model="password" required />
        </div>
        <button type="submit" :disabled="loading">
          {{ loading ? "Connexion..." : "Se connecter" }}
        </button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  let api_url=import.meta.env.VITE_API_URL
  export default {
    data() {
      return {
        email: '',
        password: '',
        loading: false,
        errorMessage: ''
      };
    },
    methods: {
      
      async login() {
        this.loading = true;
        this.errorMessage = '';
  
        try {
          const response = await axios.post(`${api_url}/auth/login`, {
            email: this.email,
            password: this.password
          });
  
          const token = response.data.token; // Get token from localhost response
          localStorage.setItem('token', token); // Store token in localStorage
  
          const redirect = this.$route.query.redirect || '/dashboard'; // Redirect after login
          this.$router.push(redirect);
        } catch (error) {
          this.errorMessage = error.response?.data?.message || 'Login failed!';
        } finally {
          this.loading = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    max-width: 300px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    text-align: center;
  }
  
  input {
    width: 100%;
    padding: 8px;
    margin: 5px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    width: 100%;
    padding: 10px;
    background-color: blue;
    color: white;
    border: none;
    cursor: pointer;
    margin-top: 10px;
  }
  
  button:disabled {
    background-color: gray;
    cursor: not-allowed;
  }
  
  button:hover:not(:disabled) {
    background-color: darkblue;
  }
  
  .error {
    color: red;
    margin-top: 10px;
  }
  </style>
  