<template>
  <div class="vant-mobile-bg">
    <van-nav-bar title="💸 Transaction Checker" fixed safe-area-inset-top class="vant-mobile-bar" />
    <div class="vant-mobile-content">
      <van-form @submit="addTransaction">
        <van-cell-group inset>
          <van-field v-model="form.name" label="Name" placeholder="Who?" required clearable left-icon="user-o" />
          <van-field v-model.number="form.amount" label="Amount" type="number" placeholder="How much?" required clearable left-icon="gold-coin-o" />
          <van-dropdown-menu>
            <van-dropdown-item v-model="form.type" :options="dropdownOptions" />
          </van-dropdown-menu>
          <div class="vant-mobile-btn-wrap">
            <van-button type="primary" block native-type="submit" :loading="loadingAdd">Add</van-button>
          </div>
        </van-cell-group>
      </van-form>
      <div class="vant-mobile-list-wrap">
        <van-cell-group title="Transactions">
          <van-empty v-if="!loading && !transactions.length" description="No transactions yet." image-size="80" />
          <van-swipe-cell v-for="(tx, idx) in transactions" :key="tx.id">
            <template #left>
              <van-button square type="danger" text="Delete" @click="removeTransaction(idx)" />
            </template>
            <van-cell :title="tx.name" :value="tx.amount + ' ฿'" :label="typeLabel(tx.type)" class="vant-mobile-list-item">
              <template #icon>
                <van-icon :name="tx.type === 'pay' ? 'down' : 'up'" :color="tx.type === 'pay' ? '#ef4444' : '#22c55e'" size="22" />
              </template>
            </van-cell>
          </van-swipe-cell>
          <van-loading v-if="loading" size="24" vertical>Loading...</van-loading>
        </van-cell-group>
      </div>
    </div>
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

onMounted(fetchTransactions)
</script>

<style scoped>
.vant-mobile-bg {
  min-height: 100vh;
  background: #f6f7fb;
  padding: 0;
}
.vant-mobile-bar {
  background: #6366f1;
  color: #fff;
}
.vant-mobile-content {
  max-width: 480px;
  margin: 0 auto;
  padding: 80px 0 32px 0;
}
.vant-mobile-btn-wrap {
  margin-top: 18px;
}
.vant-mobile-list-wrap {
  margin-top: 32px;
}
.vant-mobile-list-item {
  font-size: 18px;
}
</style>
