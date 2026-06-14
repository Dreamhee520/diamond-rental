<template>
  <div class="review-card">
    <div class="review-header">
      <div class="reviewer-avatar">
        {{ review.name?.[0] || '用' }}
      </div>
      <div class="reviewer-info">
        <h4 class="reviewer-name">{{ review.name || '匿名用户' }}</h4>
        <div class="review-rating">
          <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= review.rating }">★</span>
        </div>
      </div>
      <span class="review-date">{{ review.date || '2024-01-01' }}</span>
    </div>

    <p class="review-content">{{ review.content || '非常愉快的体验，下次还会再来！' }}</p>

    <div class="review-footer">
      <span class="review-service">服务: {{ review.service || '陪伴服务' }}</span>
      <span class="review-helpful" @click="$emit('helpful', review.id)">
        ♥ {{ review.helpful || 0 }}
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  review: {
    type: Object,
    required: true
  }
})

defineEmits(['helpful'])
</script>

<style scoped>
.review-card {
  background: var(--card-bg);
  border-radius: var(--border-radius-lg);
  padding: 30px;
  box-shadow: var(--card-shadow);
  transition: all 0.3s ease;
}

.review-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--card-shadow-hover);
}

.review-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.reviewer-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--bg-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.reviewer-info {
  flex: 1;
}

.reviewer-name {
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.review-rating {
  display: flex;
  gap: 2px;
}

.star {
  color: #e0e0e0;
  font-size: 1rem;
}

.star.filled {
  color: #ffd700;
}

.review-date {
  font-size: 0.85rem;
  color: var(--text-lighter);
}

.review-content {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text-light);
  margin-bottom: 20px;
}

.review-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
  font-size: 0.9rem;
}

.review-service {
  color: var(--text-light);
}

.review-helpful {
  color: var(--primary-dark);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
}

.review-helpful:hover {
  color: #e74c3c;
  transform: scale(1.1);
}
</style>
