<template>
    <div>
        <van-nav-bar title="💸 Pay Check" />
        <van-overlay :show="authLoading" z-index="2000">
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
                <van-loading size="32" vertical color="#3b82f6">Loading...</van-loading>
            </div>
        </van-overlay>
        <div style="padding: 12px;" v-show="!authLoading">
            <div v-if="user"
                style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; background: #f8fafc; border-radius: 10px; padding: 10px 18px; box-shadow: 0 2px 8px #e3e8f0;">
                <div style="display: flex; align-items: center; gap: 14px;">
                    <img :src="user.photoURL" alt="Avatar" width="44" height="44"
                        style="border-radius: 50%; box-shadow: 0 2px 8px #cfd8dc; object-fit: cover;" />
                    <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 17px; font-weight: 600; color: #222;">{{ user.displayName || 'No Name'
                            }}</span>
                        <span style="font-size: 13px; color: #666;">{{ user.email }}</span>
                    </div>
                </div>
                <van-button size="small" type="danger" @click="logout"
                    style="margin-left: 18px; border-radius: 6px;">Logout</van-button>
            </div>
            <template v-if="!user">
                <div
                    style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh;">
                    <img src="https://cdn-icons-png.flaticon.com/512/3584/3584670.png" width="150" height="150"
                        style="margin-bottom: 18px; filter: drop-shadow(0 2px 8px #cfd8dc);" alt="Google" />
                    <div style="font-size: 22px; font-weight: 700, color: #222; margin-bottom: 8px;">Welcome to PayCheck
                    </div>
                    <div
                        style="font-size: 15px; color: #666; margin-bottom: 24px; text-align: center; max-width: 320px;">
                        Please sign in with Google to securely track your transactions.<br />Your data is private and
                        only visible to you.
                    </div>
                    <button @click="login"
                        style="display: flex; align-items: center; gap: 10px; background: #fff; color: #444; border: 1px solid #dadce0; border-radius: 6px; font-size: 16px; font-weight: 500; padding: 0 24px 0 16px; height: 48px; box-shadow: 0 2px 12px #e3e8f0; cursor: pointer; transition: box-shadow 0.2s;">
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="24"
                            height="24" style="margin-right: 4px;" alt="Google" />
                        Sign in with Google
                    </button>
                </div>
            </template>
            <template v-else>
                <van-form @submit="addTransaction">
                    <van-cell-group style="border-radius: 12px; overflow: hidden;">
                        <van-field v-model="form.name" name="name" label="Name" placeholder="Who?"
                            :rules="[{ required: true, message: 'Name is required' }]" required clearable />
                        <van-field v-model.number="form.amount" name="amount" label="Amount" type="number"
                            placeholder="How much?" :rules="[{ required: true, message: 'Amount is required' }]"
                            required clearable />
                        <van-field v-model="form.notes" name="notes" label="Notes" placeholder="Optional notes"
                            clearable autosize type="textarea" />
                        <van-dropdown-menu>
                            <van-dropdown-item v-model="form.type" :options="dropdownOptions" />
                        </van-dropdown-menu>
                    </van-cell-group>

                    <div style="margin-top: 12px;">
                        <van-button
                            type="primary"
                            round
                            block
                            native-type="submit"
                            :loading="loadingAdd"
                            style="
                                background: linear-gradient(90deg, #3b82f6 0%, #6366f1 100%);
                                border: none;
                                color: #fff;
                                font-weight: 600;
                                font-size: 17px;
                                box-shadow: 0 4px 16px rgba(59,130,246,0.12);
                                letter-spacing: 0.5px;
                                transition: background 0.2s;
                            "
                        >
                            <template #default>
                                <span style="display: flex; align-items: center; gap: 8px;">
                                    <van-icon name="plus" size="20" color="#fff" />
                                    Add Transaction
                                </span>
                            </template>
                        </van-button>
                    </div>
                </van-form>

                <div style="margin-top: 20px;">
                    <van-divider>Transaction List</van-divider>
                    <div style="margin-top: 16px; margin-bottom: 8px; display: flex; gap: 12px; justify-content: center;">
                        <div style="background: #fef2f2; color: #ef4444; border-radius: 8px; padding: 10px 18px; min-width: 120px; text-align: center; box-shadow: 0 2px 8px #fca5a5; font-weight: 600;">
                            <div style="font-size: 15px;">Total Pay</div>
                            <div style="font-size: 20px; margin-top: 2px;">{{ totalPay }} ฿</div>
                        </div>
                        <div style="background: #f0fdf4; color: #22c55e; border-radius: 8px; padding: 10px 18px; min-width: 120px; text-align: center; box-shadow: 0 2px 8px #86efac; font-weight: 600;">
                            <div style="font-size: 15px;">Total Get</div>
                            <div style="font-size: 20px; margin-top: 2px;">{{ totalGet }} ฿</div>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                        <van-field v-model="selectedName" is-link readonly label="Filter" placeholder="Select Name"
                            @click="showNamePicker = true" style="flex: 1; margin-bottom: 0;" />
                        <van-popup v-model:show="showNamePicker" position="bottom">
                            <van-picker :columns="namePickerColumns" confirm-button-text="Select"
                                cancel-button-text="Cancel" @confirm="onNameSelect" @cancel="showNamePicker = false" />
                        </van-popup>
                    </div>
                    <div v-if="selectedName && filteredTransactions.length"
                        style="display: flex; justify-content: space-between; align-items: center; gap: 10px; background: #f3f6ff; border-radius: 8px; box-shadow: 0 2px 8px rgba(60,100,255,0.08); padding: 8px 14px; margin: 12px 0; font-weight: 500; color: #2a3a5a;">
                        <span
                            style="background: #3b82f6; color: #fff; border-radius: 5px; padding: 2px 10px; font-weight: 600;">{{
                            selectedName }}</span>
                        <span style="margin-left: 8px; color: #3b82f6; font-weight: 600;">{{ totalAmount }} ฿</span>
                        <van-button size="mini" type="default" @click="clearSelectedName">Clear</van-button>
                    </div>
                    <div style="display: flex; justify-content: flex-end; margin-bottom: 10px;">
                        <van-button type="primary" size="small" icon="description" @click="exportPDF" style="border-radius: 6px;">
                            Export PDF
                        </van-button>
                    </div>
                    <van-cell-group style="border-radius: 12px; overflow: hidden;">
                        <van-empty v-if="!loading && !filteredTransactions.length" description="No transactions yet."
                            image-size="80" />
                        <van-swipe-cell v-for="(tx, idx) in filteredTransactions" :key="tx.id">
                            <template #right>
                                <van-button square type="danger" text="Delete" @click="removeTransactionById(tx.id)"
                                    style="height: 100%; min-height: 56px;" />
                            </template>
                            <van-cell :title="''" :value="formatBath(tx.amount)">
                                <template #title>
                                    <span>{{ tx.name }}</span>
                                </template>
                                <template #icon>
                                    <span style="display: flex; align-items: center; gap: 10px; margin-right: 10px;">
                                        <van-icon v-if="tx.type === 'pay'" name="like" color="#ef4444" size="22" />
                                        <van-icon v-else name="smile" color="#22c55e" size="22" />

                                        <span v-if="tx.type === 'pay'"
                                        style="background: #ef4444; color: #fff; border-radius: 5px; padding: 2px 8px; font-size: 13px; margin-left: 8px; font-weight: 600;">Pay</span>
                                    <span v-else
                                        style="background: #22c55e; color: #fff; border-radius: 5px; padding: 2px 8px; font-size: 13px; margin-left: 8px; font-weight: 600;">Get</span>
                                    </span>
                                </template>
                                <template #extra v-if="tx.date">
                                    <div style="color: #aaa; font-size: 12px; margin-top: 2px; text-align: right;">
                                        📅 {{ formatDate(tx.date) }}
                                    </div>
                                </template>
                                <template #label v-if="tx.notes">
                                    <div style="color: #888; font-size: 13px; margin-top: 2px;">📝 {{ tx.notes }}</div>
                                </template>
                            </van-cell>
                        </van-swipe-cell>
                        <van-loading v-if="loading" size="24" vertical>Loading...</van-loading>
                    </van-cell-group>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Dialog, showConfirmDialog, Toast } from 'vant';
import { computed, onMounted, ref } from 'vue';
import { auth, db, onAuthStateChanged, provider, signInWithPopup, signOut } from '../firebase';

const dialog = Dialog

const user = ref(null)
const transactions = ref([])
const form = ref({ name: '', amount: '', type: 'pay', notes: '' })
const loading = ref(true)
const loadingAdd = ref(false)
const dropdownOptions = [
    { text: 'I have to pay', value: 'pay' },
    { text: 'I have to get', value: 'receive' }
]

const selectedName = ref('')
const showNamePicker = ref(false)
const authLoading = ref(true)

const uniqueNames = computed(() => {
    const names = transactions.value.map(tx => tx.name).filter(Boolean)
    const seen = new Map()
    names.forEach(name => {
        const key = name.trim().toLowerCase()
        if (!seen.has(key)) {
            seen.set(key, name)
        }
    })
    return Array.from(seen.values()).map(name => ({ text: name, value: name.trim().toLowerCase() }))
})

const namePickerColumns = computed(() => uniqueNames.value)

const filteredTransactions = computed(() => {
    if (!selectedName.value) return transactions.value
    return transactions.value.filter(tx => tx.name && tx.name.trim().toLowerCase() === selectedName.value)
})

const totalAmount = computed(() => {
    return filteredTransactions.value.reduce((sum, tx) => sum + Number(tx.amount || 0), 0)
})

const totalPay = computed(() => {
    return filteredTransactions.value
        .filter(tx => tx.type === 'pay')
        .reduce((sum, tx) => sum + Number(tx.amount || 0), 0)
})

const totalGet = computed(() => {
    return filteredTransactions.value
        .filter(tx => tx.type === 'receive')
        .reduce((sum, tx) => sum + Number(tx.amount || 0), 0)
})

const txCol = collection(db, 'transactions')

function typeLabel(type) {
    return type === 'pay' ? 'I have to pay' : 'I have to get'
}

async function fetchTransactions() {
    if (!user.value) {
        transactions.value = []
        return
    }
    loading.value = true
    try {
        const q = query(txCol, where('uid', '==', user.value.uid))
        const snapshot = await getDocs(q)
        transactions.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (e) {
        console.error('Firestore fetch error:', e)
        transactions.value = []
    }
    loading.value = false
}

async function addTransaction() {
    if (!form.value.name || !form.value.amount || !user.value) return
    loadingAdd.value = true
    await addDoc(txCol, { ...form.value, uid: user.value.uid, email: user.value.email })
    form.value = { name: '', amount: '', type: 'pay', notes: '' }
    loadingAdd.value = false
    fetchTransactions()
}

async function removeTransaction(idx) {
    const tx = filteredTransactions.value[idx]
    if (tx && tx.id) {
        await deleteDoc(doc(db, 'transactions', tx.id))
        fetchTransactions()
    }
}

async function removeTransactionById(id) {
    if (id) {
        await deleteDoc(doc(db, 'transactions', id))
        fetchTransactions()
    }
}

function formatBath(amount) {
    return `${amount} ฿`
}

function onNameSelect({ selectedOptions, selectedValues }) {
    selectedName.value = selectedValues[0] || ''
    showNamePicker.value = false
}

function clearSelectedName() {
    selectedName.value = ''
}

onMounted(() => {
  authLoading.value = false
})

onAuthStateChanged(auth, (u) => {
    user.value = u
    authLoading.value = false
    fetchTransactions()
})

function formatDate(dateStr) {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

async function login() {
    authLoading.value = true
    try {
        await signInWithPopup(auth, provider)
    } catch (e) {
        Toast.fail({ message: 'Google login failed', duration: 3500 })
        console.error('Google login popup error:', e)
    } finally {
        authLoading.value = false
    }
}

async function logout() {
    showConfirmDialog({
        title: 'Logout',
        message: 'Are you sure you want to logout?',
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Logout',
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#aaa',
    })
    .then(async () => {
        authLoading.value = true

        try {
            await signOut(auth)
        } finally {
            authLoading.value = false
        }
    })
    .catch(() => {
        // on cancel
    });

    authLoading.value = false
}

function exportPDF() {
    const doc = new jsPDF();
    // doc.setFont('NotoSansMyanmar', 'normal');
    doc.setFontSize(18);
    const title = selectedName.value
        ? `Transactions for: ${selectedName.value}`
        : 'All Transactions';
    doc.text(title, 14, 18);
    doc.setFontSize(12);
    const columns = [
        { header: 'Name', dataKey: 'name' },
        { header: 'Type', dataKey: 'type' },
        { header: 'Amount', dataKey: 'amount' },
        { header: 'Date', dataKey: 'date' },
        { header: 'Notes', dataKey: 'notes' },
    ];
    const rows = filteredTransactions.value.map(tx => ({
        name: tx.name || '',
        type: tx.type === 'pay' ? 'Pay' : 'Get',
        amount: tx.amount || '',
        date: tx.date ? formatDate(tx.date) : '',
        notes: tx.notes || '',
    }));
    autoTable(doc, {
        startY: 26,
        head: [columns.map(col => col.header)],
        body: rows.map(row => columns.map(col => row[col.dataKey])),
        // styles: { font: 'NotoSansMyanmar', fontStyle: 'normal', fontSize: 10, cellWidth: 'wrap' },
        styles: { fontSize: 10, cellWidth: 'wrap' },
        headStyles: { fillColor: [59, 130, 246] },
        margin: { left: 10, right: 10 },
        theme: 'grid',
    });
    doc.save(
        selectedName.value
            ? `transactions_${selectedName.value}.pdf`
            : 'transactions_all.pdf'
    );
}
</script>

<!-- No custom CSS -->
