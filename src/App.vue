<script setup>
import { ref } from 'vue'
import TransactionChecker from './components/TransactionChecker.vue'

const username = ref('')
const password = ref('')

function onSubmit() {
  // Add your login logic here
  // For now, just log the values
  console.log('Username:', username.value)
  console.log('Password:', password.value)
}
</script>

<template>
  <div style="max-width: 480px; margin: 0 auto; min-height: 100vh; background: #fff;">
    <van-form @submit="onSubmit">
      <van-field
        v-model="username"
        name="username"
        label="Username"
        placeholder="Username"
        :rules="[{ required: true, message: 'Username is required' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="password"
        label="Password"
        placeholder="Password"
        :rules="[{ required: true, message: 'Password is required' }]"
      />
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          Submit
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<!-- No custom CSS -->
