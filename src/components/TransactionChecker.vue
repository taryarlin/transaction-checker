<template>
  <div>
    <van-nav-bar title="💸 Transaction Checker" />
    <div style="padding: 12px;">
      <van-form @submit="addTransaction">
        <van-cell-group style="border-radius: 12px; overflow: hidden;">
          <van-field
            v-model="form.name"
            name="name"
            label="Name"
            placeholder="Who?"
            :rules="[{ required: true, message: 'Name is required' }]"
            required
            clearable
          />
          <van-field
            v-model.number="form.amount"
            name="amount"
            label="Amount"
            type="number"
            placeholder="How much?"
            :rules="[{ required: true, message: 'Amount is required' }]"
            required
            clearable
          />
          <van-field
            v-model="form.notes"
            name="notes"
            label="Notes"
            placeholder="Optional notes"
            clearable
            autosize
            type="textarea"
          />
        </van-cell-group>
        <van-dropdown-menu>
          <van-dropdown-item v-model="form.type" :options="dropdownOptions" />
        </van-dropdown-menu>
        <div style="margin-top: 12px;">
          <van-button type="primary" round block native-type="submit" :loading="loadingAdd">Add</van-button>
        </div>
      </van-form>
      <div style="margin-top: 20px;">
        <van-divider>Transaction List</van-divider>
        <van-cell-group style="border-radius: 12px; overflow: hidden;">
          <van-empty v-if="!loading && !transactions.length" description="No transactions yet." image-size="80" />
          <van-swipe-cell v-for="(tx, idx) in transactions" :key="tx.id">
            <template #right>
              <van-button square type="danger" text="Delete" @click="removeTransaction(idx)" style="height: 100%; min-height: 56px;" />
            </template>
            <van-cell :title="tx.name" :value="formatBath(tx.amount)" :label="typeLabel(tx.type)">
              <template #icon>
                <span style="display: flex; align-items: center; gap: 10px; margin-right: 10px;">
                  <van-icon v-if="tx.type === 'pay'" name="cross" color="#ef4444" size="22" />
                  <van-icon v-else name="passed" color="#22c55e" size="22" />
                </span>
              </template>
              <template #label v-if="tx.notes">
                <div style="color: #888; font-size: 13px; margin-top: 2px;">📝 {{ tx.notes }}</div>
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
import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { onMounted, ref } from 'vue'
import { db } from '../firebase'

const transactions = ref([])
const form = ref({ name: '', amount: '', type: 'pay', notes: '' })
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
    form.value = { name: '', amount: '', type: 'pay', notes: '' }
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

<!-- No custom CSS -->
