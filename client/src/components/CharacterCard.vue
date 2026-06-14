<template>
  <div class="character-card" @click="$emit('click', character.id)" :style="{ animationDelay: `${(character.id - 1) * 0.08}s` }">
    <div class="card-image">
      <div class="image-frame">
        <div class="character-avatar" :style="{ background: getGradient(character.id) }">
          <img v-if="character.avatar && !imgFailed" :src="character.avatar" :alt="character.name" class="avatar-img" @error="onImgError" />
          <span v-if="!character.avatar || imgFailed" class="character-initial">{{ character.name?.[0] || '?' }}</span>
        </div>
        <div class="frame-border"></div>
      </div>
      <div class="card-badge" v-if="character.available || character.status === 'active'">
        <span class="status-dot"></span>
        可预约
      </div>
      <div class="card-overlay">
        <span class="overlay-text">查看详情 →</span>
      </div>
    </div>

    <div class="card-body">
      <div class="card-top">
        <h3 class="character-name">
          {{ character.name }}
          <span class="character-name-jp">{{ character.name_jp }}</span>
        </h3>
        <div class="rating" v-if="character.rating">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#d4a060"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <span>{{ character.rating }}</span>
        </div>
      </div>

      <div class="role-tag" v-if="character.role_tag">{{ character.role_tag }}</div>

      <div class="character-tags">
        <span class="tag" v-for="tag in (character.personality_tags || character.tags || []).slice(0, 3)" :key="tag">{{ tag }}</span>
      </div>

      <p class="character-desc">{{ character.description || character.short_desc || '温柔体贴，善解人意，给你最温暖的陪伴...' }}</p>

      <div class="card-footer">
        <div class="price">
          <span class="price-value">¥{{ (character.price_per_hour || character.price || 10000).toLocaleString() }}</span>
          <span class="price-unit">円/時間</span>
        </div>
        <button class="btn-book" @click.stop="$emit('book', character.id)">
          立即预约
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  character: { type: Object, required: true }
})

defineEmits(['click', 'book'])

const imgFailed = ref(false)
const onImgError = () => { imgFailed.value = true }

const getGradient = (id) => {
  const gradients = [
    'linear-gradient(135deg, #f8c8dc 0%, #e090b0 100%)',
    'linear-gradient(135deg, #c8d8f0 0%, #98b8d8 100%)',
    'linear-gradient(135deg, #f0d8a8 0%, #d4a060 100%)',
    'linear-gradient(135deg, #c8e8d8 0%, #90c0a8 100%)',
    'linear-gradient(135deg, #e0c8f0 0%, #b898d0 100%)',
    'linear-gradient(135deg, #f0d0c8 0%, #d8a898 100%)',
    'linear-gradient(135deg, #d8e8f0 0%, #a0c0d8 100%)',
    'linear-gradient(135deg, #f8e0c8 0%, #e0b890 100%)',
    'linear-gradient(135deg, #e0e0f0 0%, #b0b0d0 100%)',
    'linear-gradient(135deg, #c8e8e0 0%, #90c0b8 100%)',
    'linear-gradient(135deg, #f0c8e0 0%, #d0a0c0 100%)',
    'linear-gradient(135deg, #e8e0d0 0%, #c8b898 100%)'
  ]
  return gradients[(id - 1) % gradients.length]
}
</script>

<style scoped>
.character-card {
  position: relative;
  background: rgba(30, 20, 50, 0.55);
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  overflow: hidden;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.35),
    0 1px 4px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1.2);
  cursor: pointer;
  animation: cardIn 0.6s ease both;
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(30px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* Glass highlight pseudo-element */
.character-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 24px;
  z-index: 1;
  pointer-events: none;
  background: radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.06) 0%, transparent 60%);
  opacity: 0.6;
  transition: opacity 0.4s;
}

.character-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.5),
    0 8px 20px rgba(0, 0, 0, 0.35),
    0 0 0 1px rgba(248, 200, 220, 0.25),
    0 0 40px rgba(248, 200, 220, 0.1);
  border-color: rgba(248, 200, 220, 0.3);
}

.character-card:hover::before {
  opacity: 1;
}

.card-image {
  position: relative;
  padding: 32px;
  background: linear-gradient(180deg, rgba(248,200,220,0.1) 0%, rgba(200,216,240,0.05) 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 240px;
  overflow: hidden;
  z-index: 0;
}

.card-image::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20%;
  right: 20%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
}

.image-frame {
  position: relative;
}

.character-avatar {
  width: 170px;
  height: 170px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 0 0 4px rgba(255,255,255,0.15),
    0 8px 30px rgba(0,0,0,0.25);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1.2);
  position: relative;
  z-index: 2;
}

.character-card:hover .character-avatar {
  transform: scale(1.06);
  box-shadow:
    0 0 0 6px rgba(248,200,220,0.3),
    0 0 30px rgba(248,200,220,0.2),
    0 12px 40px rgba(0,0,0,0.35);
}

.frame-border {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: 2px dashed rgba(212,160,96,0.15);
  animation: spin 20s linear infinite;
  opacity: 0;
  transition: opacity 0.4s;
}

.character-card:hover .frame-border {
  opacity: 1;
  border-color: rgba(212,160,96,0.35);
}

.character-initial {
  font-size: 3.2rem;
  font-weight: 800;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

/* Card overlay on hover */
.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(6, 4, 14, 0.45);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.35s;
  z-index: 3;
}

.character-card:hover .card-overlay { opacity: 1; }

.overlay-text {
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  padding: 12px 28px;
  border: 2px solid rgba(255,255,255,0.5);
  border-radius: 12px;
  letter-spacing: 0.06em;
  background: rgba(255,255,255,0.05);
}

.card-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(20, 10, 30, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #5ee2a0;
  border: 1px solid rgba(94, 226, 160, 0.15);
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  z-index: 2;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #5ee2a0;
  animation: dotPulse 2s ease infinite;
}

@keyframes dotPulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(94,226,160,0.4); }
  50% { opacity: 0.6; box-shadow: 0 0 0 6px rgba(94,226,160,0); }
}

.card-body {
  padding: 22px 28px 28px;
  position: relative;
  z-index: 0;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.character-name {
  font-size: 1.3rem;
  font-weight: 700;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.character-name-jp {
  font-size: 0.82rem;
  color: var(--text-lighter);
  font-weight: 400;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--accent);
}

.role-tag {
  display: inline-block;
  padding: 5px 16px;
  background: linear-gradient(135deg, rgba(248,200,220,0.2), rgba(200,216,240,0.2));
  color: var(--text-color);
  border-radius: 20px;
  font-size: 0.82rem;
  font-weight: 600;
  margin-bottom: 12px;
  border: 1px solid rgba(248,200,220,0.15);
}

.character-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
}

.tag {
  padding: 5px 14px;
  background: rgba(248,200,220,0.12);
  color: var(--text-color);
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid rgba(248,200,220,0.08);
}

.character-desc {
  font-size: 0.92rem;
  color: var(--text-light);
  margin-bottom: 20px;
  line-height: 1.75;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 18px;
  border-top: 1px solid rgba(255,255,255,0.06);
}

.price {
  display: flex;
  align-items: baseline;
  gap: 4px;
  white-space: nowrap;
  flex-shrink: 0;
}

.price-value {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--accent);
  text-shadow: 0 0 20px rgba(212,160,96,0.3);
}

.price-unit {
  font-size: 0.82rem;
  color: var(--text-lighter);
  font-weight: 500;
}

.btn-book {
  padding: 12px 28px;
  background: linear-gradient(135deg, #f5a6b8 0%, #d4a060 100%);
  color: #fff;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(240,160,180,0.3);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1.2);
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.btn-book::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.btn-book:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 28px rgba(240,160,180,0.5);
}

.btn-book:hover::after {
  left: 100%;
}

.btn-book svg {
  transition: transform 0.2s;
}

.btn-book:hover svg {
  transform: translateX(3px);
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 1024px) {
  .card-image {
    padding: 24px;
    min-height: 200px;
  }
  .character-avatar {
    width: 140px;
    height: 140px;
  }
  .character-name {
    font-size: 1.15rem;
  }
}

@media (max-width: 640px) {
  .card-image {
    padding: 20px;
    min-height: 170px;
  }
  .character-avatar {
    width: 110px;
    height: 110px;
  }
  .character-name {
    font-size: 1.05rem;
  }
  .character-name-jp {
    display: none;
  }
  .card-badge {
    position: static;
    display: inline-flex;
    margin-bottom: 8px;
  }
  .card-top {
    flex-direction: column;
    gap: 8px;
    margin-bottom: 8px;
  }
  .character-tags {
    margin-bottom: 10px;
  }
  .tag {
    font-size: 0.75rem;
    padding: 4px 10px;
  }
  .character-desc {
    font-size: 0.85rem;
    margin-bottom: 14px;
    -webkit-line-clamp: 2;
  }
  .card-footer {
    padding-top: 12px;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
  }
  .price {
    font-size: 0.9rem;
    gap: 2px;
  }
  .price-value {
    font-size: 1.2rem;
  }
  .price-unit {
    font-size: 0.75rem;
  }
  .btn-book {
    padding: 10px 18px;
    font-size: 0.85rem;
    flex-grow: 1;
    justify-content: center;
  }
}
</style>
