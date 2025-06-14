<template>
  <div>
    <van-nav-bar title="💸 Transaction Checker" />

    <div>
        <van-form @submit="onSubmit">
  <van-cell-group inset>
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
  </van-cell-group>
  <div style="margin: 16px;">
    <van-button round block type="primary" native-type="submit">
      Submit
    </van-button>
  </div>
</van-form>

    </div>

    <!-- <div style="margin-top: 20px;">
      <van-form @submit="addTransaction">
        <van-field
          v-model="form.name"
          name="name"
          label="Name"
          placeholder="Who?"
          :rules="[{ required: true, message: 'Name is required' }]"
          clearable
        />
        <van-field
          v-model.number="form.amount"
          name="amount"
          label="Amount"
          type="number"
          placeholder="How much?"
          :rules="[{ required: true, message: 'Amount is required' }]"
          clearable
        />
        <van-dropdown-menu>
          <van-dropdown-item v-model="form.type" :options="dropdownOptions" />
        </van-dropdown-menu>

        <div>
          <van-button type="primary" block native-type="submit" :loading="loadingAdd">Add</van-button>
        </div>
      </van-form>
      <div>
        <van-empty v-if="!loading && !transactions.length" description="No transactions yet." image-size="80" />
        <van-swipe-cell v-for="(tx, idx) in transactions" :key="tx.id">
          <template #right>
            <van-button square type="danger" text="Delete" @click="removeTransaction(idx)" style="height: 100%; min-height: 56px;" />
          </template>
          <van-cell :title="tx.name" :value="formatBath(tx.amount)" :label="typeLabel(tx.type)">
            <template #icon>
              <van-icon v-if="tx.type === 'pay'" name="balance-pay" color="#ef4444" size="22" />
              <van-icon v-else name="cash-back-record" color="#22c55e" size="22" />
            </template>
          </van-cell>
        </van-swipe-cell>
        <van-loading v-if="loading" size="24" vertical>Loading...</van-loading>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore'

const transactions = ref([])
const form = ref({ name: '', amount: '', type: 'pay' })
const loading = ref(true)
const loadingAdd = ref(false)
const dropdownOptions = [
    { text: 'I have to pay', value: 'pay' },
    { text: 'I have to get', value: 'receive' }
]

const txCol = collection(db, 'transactions')

function typeLabel(type) {
    return type === 'pay' ? 'I have to pay' : 'I have to get'
}

async function fetchTransactions() {
    loading.value = true
    try {
        const snapshot = await getDocs(txCol)
        transactions.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (e) {
        console.error('Firestore fetch error:', e)
        transactions.value = []
    }
    loading.value = false
}

async function addTransaction() {
    if (!form.value.name || !form.value.amount) return
    loadingAdd.value = true
    await addDoc(txCol, { ...form.value })
    form.value = { name: '', amount: '', type: 'pay' }
    loadingAdd.value = false
    fetchTransactions()
}

async function removeTransaction(idx) {
    const tx = transactions.value[idx]
    if (tx && tx.id) {
        await deleteDoc(doc(db, 'transactions', tx.id))
        fetchTransactions()
    }
}

function formatBath(amount) {
    return `${amount} ฿`
}

onMounted(fetchTransactions)
</script>
