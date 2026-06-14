<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content booking-modal">
      <div class="modal-header">
        <h3>预约 {{ characterName }}</h3>
        <button class="modal-close" @click="$emit('close')">✕</button>
      </div>

      <form @submit.prevent="handleSubmit" class="booking-form">
        <div class="form-group">
          <label class="form-label">选择日期</label>
          <input
            type="date"
            v-model="form.date"
            class="form-input"
            :min="minDate"
            required
          />
          <span class="form-error" v-if="errors.date">{{ errors.date }}</span>
        </div>

        <div class="form-group">
          <label class="form-label">选择时间段</label>
          <div class="time-slots">
            <button
              type="button"
              v-for="slot in timeSlots"
              :key="slot"
              class="time-slot"
              :class="{ active: form.time_slot === slot }"
              @click="form.time_slot = slot"
            >
              {{ slot }}
            </button>
          </div>
          <span class="form-error" v-if="errors.time_slot">{{ errors.time_slot }}</span>
        </div>

        <div class="form-group">
          <label class="form-label">服务时长</label>
          <div class="duration-options">
            <button
              type="button"
              v-for="d in durationOptions"
              :key="d.value"
              class="duration-option"
              :class="{ active: form.duration === d.value }"
              @click="form.duration = d.value"
            >
              {{ d.label }}
            </button>
          </div>
          <span class="form-error" v-if="errors.duration">{{ errors.duration }}</span>
        </div>

        <div class="form-group">
          <label class="form-label">您的姓名</label>
          <input
            type="text"
            v-model="form.customer_name"
            class="form-input"
            placeholder="请输入您的姓名"
            required
          />
          <span class="form-error" v-if="errors.customer_name">{{ errors.customer_name }}</span>
        </div>

        <div class="form-group">
          <label class="form-label">联系电话</label>
          <input
            type="tel"
            v-model="form.customer_phone"
            class="form-input"
            placeholder="请输入联系电话"
            required
          />
          <span class="form-error" v-if="errors.customer_phone">{{ errors.customer_phone }}</span>
        </div>

        <div class="form-group">
          <label class="form-label">备注（可选）</label>
          <textarea
            v-model="form.notes"
            class="form-input"
            rows="3"
            placeholder="有任何特殊要求可以告诉我们..."
          ></textarea>
        </div>

        <div class="booking-summary" v-if="form.date && form.time_slot && form.duration">
          <h4>预约摘要</h4>
          <div class="summary-item">
            <span>日期</span>
            <span>{{ form.date }}</span>
          </div>
          <div class="summary-item">
            <span>时间</span>
            <span>{{ form.time_slot }}</span>
          </div>
          <div class="summary-item">
            <span>时长</span>
            <span>{{ form.duration }}小时</span>
          </div>
          <div class="summary-item total">
            <span>合計料金</span>
            <span>¥{{ calculatePrice().toLocaleString() }}円</span>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">取消</button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading" class="spinner" style="width:20px;height:20px;"></span>
            <span v-else>确认预约</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const props = defineProps({
  characterId: {
    type: Number,
    required: true
  },
  characterName: {
    type: String,
    default: ''
  },
  characterPrice: {
    type: Number,
    default: 299
  }
})

const emit = defineEmits(['close', 'submit'])

const loading = ref(false)
const errors = reactive({})

const form = reactive({
  date: '',
  time_slot: '',
  duration: 2,
  customer_name: '',
  customer_phone: '',
  notes: ''
})

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const timeSlots = [
  '09:00-11:00',
  '11:00-13:00',
  '14:00-16:00',
  '16:00-18:00',
  '19:00-21:00'
]

const durationOptions = [
  { label: '2小时', value: 2 },
  { label: '4小时', value: 4 },
  { label: '6小时', value: 6 },
  { label: '8小时', value: 8 }
]

const validateForm = () => {
  let isValid = true
  errors.date = ''
  errors.time_slot = ''
  errors.duration = ''
  errors.customer_name = ''
  errors.customer_phone = ''

  if (!form.date) {
    errors.date = '请选择日期'
    isValid = false
  }

  if (!form.time_slot) {
    errors.time_slot = '请选择时间段'
    isValid = false
  }

  if (!form.duration) {
    errors.duration = '请选择时长'
    isValid = false
  }

  if (!form.customer_name.trim()) {
    errors.customer_name = '请输入姓名'
    isValid = false
  }

  if (!form.customer_phone.trim()) {
    errors.customer_phone = '请输入联系电话'
    isValid = false
  } else if (!/^1[3-9]\d{9}$/.test(form.customer_phone)) {
    errors.customer_phone = '请输入有效的手机号码'
    isValid = false
  }

  return isValid
}

const calculatePrice = () => {
  return props.characterPrice * form.duration
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true

  try {
    const orderData = {
      character_id: props.characterId,
      ...form
    }

    emit('submit', orderData)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.booking-modal {
  max-width: 600px;
}

.time-slots,
.duration-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
}

.time-slot,
.duration-option {
  padding: 10px;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  background: var(--card-bg-solid);
  color: var(--text-color);
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.time-slot:hover,
.duration-option:hover {
  border-color: var(--primary);
  background: var(--primary-light);
}

.time-slot.active,
.duration-option.active {
  background: var(--bg-gradient);
  border-color: transparent;
  color: var(--text-color);
  font-weight: 600;
}

.booking-form {
  margin-top: 20px;
}

.booking-summary {
  background: var(--bg-color);
  border-radius: var(--border-radius);
  padding: 20px;
  margin: 20px 0;
}

.booking-summary h4 {
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
}

.summary-item.total {
  border-bottom: none;
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--accent);
  padding-top: 15px;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
}

@media (max-width: 480px) {
  .form-actions {
    flex-direction: column;
  }

  .form-actions button {
    width: 100%;
  }
}
</style>
