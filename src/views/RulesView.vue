<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../store/authStore.js'
import { useTournamentStore } from '../store/tournamentStore.js'

const auth = useAuthStore()
const store = useTournamentStore()

const formatRulesLines = computed(() => (store.rulesContent.formatRules ?? '').split('\n').filter(Boolean))

function update(path, event) {
  store.updateRulesContent(path, event.target.value)
}
</script>

<template>
  <div class="space-y-8 py-8">
    <RouterLink to="/" class="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline">
      ← Về trang chủ
    </RouterLink>

    <!-- Banner thông báo -->
    <section class="overflow-hidden rounded-2xl border-l-8 border-orange-500 bg-gradient-to-br from-blue-800 to-blue-950 p-5 text-white shadow-lg sm:p-6">
      <div class="flex items-center gap-3">
        <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-lg">📣</span>
        <div class="min-w-0 flex-1">
          <p class="text-xs font-bold uppercase tracking-wide text-blue-200">Thông báo chính thức từ BTC</p>
          <p v-if="!auth.isAdmin" class="text-xl font-extrabold uppercase sm:text-2xl">{{ store.rulesContent.announcementTitle }}</p>
          <input
            v-else
            :value="store.rulesContent.announcementTitle"
            class="mt-1 w-full rounded-lg border border-white/30 bg-white/10 px-2 py-1 text-xl font-extrabold uppercase text-white placeholder-blue-200 sm:text-2xl"
            @change="update('announcementTitle', $event)"
          />
        </div>
      </div>
      <div class="mt-4 space-y-3 rounded-xl bg-white/10 p-4 text-sm leading-relaxed sm:text-base">
        <p v-if="!auth.isAdmin" class="whitespace-pre-line">{{ store.rulesContent.announcementBody }}</p>
        <textarea
          v-else
          :value="store.rulesContent.announcementBody"
          rows="8"
          class="w-full rounded-lg border border-white/30 bg-white/10 p-2 text-sm text-white placeholder-blue-200 sm:text-base"
          @change="update('announcementBody', $event)"
        ></textarea>
        <p v-if="!auth.isAdmin" class="border-t border-white/20 pt-3 italic text-blue-100">{{ store.rulesContent.announcementClosing }}</p>
        <textarea
          v-else
          :value="store.rulesContent.announcementClosing"
          rows="2"
          class="w-full rounded-lg border border-white/30 bg-white/10 p-2 text-sm italic text-white placeholder-blue-200"
          @change="update('announcementClosing', $event)"
        ></textarea>
      </div>
    </section>

    <!-- Chi tiết luật phát cầu & đập cầu -->
    <section>
      <span class="inline-block rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">Cập nhật luật</span>
      <h2 class="mt-2 text-xl font-extrabold uppercase text-blue-950 sm:text-2xl">
        Chi tiết luật đặc biệt (phát cầu &amp; đập cầu)
      </h2>
      <p class="mt-1 text-sm text-slate-500">Quy định thi đấu áp dụng cho tất cả các trận.</p>

      <div class="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table class="w-full text-left text-sm">
          <thead class="bg-blue-950 text-white">
            <tr>
              <th class="px-4 py-3 font-bold uppercase tracking-wide">Tình huống thi đấu</th>
              <th class="px-4 py-3 font-bold uppercase tracking-wide">Quy định &amp; xử lý</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="(row, i) in store.rulesContent.serveRules" :key="i">
              <td class="px-4 py-3 align-top font-semibold text-slate-800">
                <span v-if="!auth.isAdmin">{{ row.situation }}</span>
                <input
                  v-else
                  :value="row.situation"
                  class="w-full rounded border border-slate-300 px-2 py-1 text-sm"
                  @change="update(`serveRules.${i}.situation`, $event)"
                />
              </td>
              <td class="px-4 py-3 align-top text-slate-700">
                <p v-if="!auth.isAdmin" class="whitespace-pre-line">{{ row.handling }}</p>
                <textarea
                  v-else
                  :value="row.handling"
                  rows="2"
                  class="w-full rounded border border-slate-300 px-2 py-1 text-sm"
                  @change="update(`serveRules.${i}.handling`, $event)"
                ></textarea>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Quy định đến muộn -->
    <section>
      <span class="inline-block rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">Kỷ luật</span>
      <h2 class="mt-2 text-xl font-extrabold uppercase text-blue-950 sm:text-2xl">Quy định đến muộn &amp; thời gian</h2>

      <div class="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="flex items-center gap-2 text-sm font-bold uppercase text-blue-950">⏰ Thời gian thi đấu chính thức</p>
          <template v-if="!auth.isAdmin">
            <p class="mt-3 font-bold text-slate-900">{{ store.rulesContent.officialTime }}</p>
            <p class="mt-1 text-sm text-slate-600">{{ store.rulesContent.officialTimeNote }}</p>
          </template>
          <template v-else>
            <input
              :value="store.rulesContent.officialTime"
              class="mt-3 w-full rounded border border-slate-300 px-2 py-1 text-sm font-bold"
              @change="update('officialTime', $event)"
            />
            <textarea
              :value="store.rulesContent.officialTimeNote"
              rows="2"
              class="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm"
              @change="update('officialTimeNote', $event)"
            ></textarea>
          </template>
        </div>
        <div class="rounded-2xl border border-orange-200 bg-orange-50 p-5 shadow-sm">
          <p class="flex items-center gap-2 text-sm font-bold uppercase text-orange-700">⚠️ Xử lý đến muộn</p>
          <p v-if="!auth.isAdmin" class="mt-3 whitespace-pre-line text-sm text-slate-700">{{ store.rulesContent.latePenalties }}</p>
          <textarea
            v-else
            :value="store.rulesContent.latePenalties"
            rows="4"
            class="mt-3 w-full rounded border border-orange-300 px-2 py-1 text-sm"
            @change="update('latePenalties', $event)"
          ></textarea>
        </div>
      </div>
    </section>

    <!-- Cách giải đấu vận hành -->
    <section>
      <span class="inline-block rounded-full bg-blue-950 px-3 py-1 text-xs font-bold text-white">Thể lệ</span>
      <h2 class="mt-2 text-xl font-extrabold uppercase text-blue-950 sm:text-2xl">Cách giải đấu vận hành</h2>

      <div class="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <ul v-if="!auth.isAdmin" class="list-disc space-y-2 pl-5 text-sm text-slate-700 sm:text-base">
          <li v-for="(line, i) in formatRulesLines" :key="i">{{ line }}</li>
        </ul>
        <template v-else>
          <textarea
            :value="store.rulesContent.formatRules"
            rows="10"
            class="w-full rounded border border-slate-300 p-2 text-sm"
            @change="update('formatRules', $event)"
          ></textarea>
          <p class="mt-1 text-xs text-slate-400">Mỗi dòng là 1 gạch đầu dòng.</p>
        </template>
      </div>
    </section>

    <!-- Thông tin thi đấu & đóng góp -->
    <section>
      <span class="inline-block rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">Địa điểm &amp; lệ phí</span>
      <h2 class="mt-2 text-xl font-extrabold uppercase text-blue-950 sm:text-2xl">Thông tin thi đấu &amp; đóng góp</h2>

      <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="(card, i) in store.rulesContent.eventInfoCards" :key="i" class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <template v-if="!auth.isAdmin">
            <p class="text-[11px] font-bold uppercase text-slate-400">{{ card.label }}</p>
            <p class="mt-1 font-bold text-slate-900">{{ card.value }}</p>
            <p v-if="card.note" class="text-xs text-slate-500">{{ card.note }}</p>
          </template>
          <template v-else>
            <input
              :value="card.label"
              class="w-full rounded border border-slate-300 px-2 py-1 text-[11px] font-bold uppercase"
              @change="update(`eventInfoCards.${i}.label`, $event)"
            />
            <input
              :value="card.value"
              class="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm font-bold"
              @change="update(`eventInfoCards.${i}.value`, $event)"
            />
            <input
              :value="card.note"
              placeholder="(không bắt buộc)"
              class="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-xs"
              @change="update(`eventInfoCards.${i}.note`, $event)"
            />
          </template>
        </div>
      </div>
    </section>
  </div>
</template>
