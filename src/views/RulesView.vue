<script setup></script>

<template>
  <div class="space-y-8 py-8">
    <RouterLink to="/" class="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline">
      ← Về trang chủ
    </RouterLink>

    <!-- Banner thông báo -->
    <section class="overflow-hidden rounded-2xl border-l-8 border-orange-500 bg-gradient-to-br from-blue-800 to-blue-950 p-5 text-white shadow-lg sm:p-6">
      <div class="flex items-center gap-3">
        <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-lg">📣</span>
        <div>
          <p class="text-xs font-bold uppercase tracking-wide text-blue-200">Thông báo chính thức từ BTC</p>
          <p class="text-xl font-extrabold uppercase sm:text-2xl">Đồng Lươn Badminton Cup 2026</p>
        </div>
      </div>
      <div class="mt-4 space-y-3 rounded-xl bg-white/10 p-4 text-sm leading-relaxed sm:text-base">
        <p>
          <strong>Thông báo:</strong> Đúng <strong>19h30 - 21h30</strong> tối thứ 6 ngày <strong>31/7/2026</strong> giải đấu
          "Đồng Lươn Badminton Cup 2026" sẽ được khởi tranh. Yêu cầu các lông thủ tham gia giải có mặt đúng giờ.
        </p>
        <p>
          Mình cập nhật một số luật đặc biệt của giải: Nam không được phát bắn hay cao sâu Nữ (Nam phát bắn, cao sâu Nam thì
          bình thường), Nữ không được phát bắn nữ nhưng phát cao sâu bình thường (Nữ được phát bắn Nam). Các trường hợp phát
          bắn hay cao sâu vi phạm bị xử đánh lại, nếu cố tình lần 2 bị trừ 1 điểm. Nam đập cầu trúng đầu Nữ bị trừ 1 điểm, Nữ
          đập cầu trúng đầu Nữ đánh lại tình huống không bị trừ điểm.
        </p>
        <p>
          Thời gian thi đấu 19h30 - 21h30. Đến muộn 10 phút - 29 phút khi gọi vào trận bị trừ 3 - 5 điểm. Muộn 30 phút trở đi
          xử thua (Trường hợp đặc biệt BTC sẽ có thể xử lý khác).
        </p>
        <p class="border-t border-white/20 pt-3 italic text-blue-100">
          Trân trọng kính mời tất cả các lông thủ đến xem và cổ vũ cho các vận động viên để giải đấu thêm sôi động, kịch tính,
          và hoàn thành mỹ mãn. Thanks All!
        </p>
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
            <tr>
              <td class="px-4 py-3 font-semibold text-slate-800">Nam phát cầu cho Nữ</td>
              <td class="px-4 py-3">
                <p class="font-bold text-red-600">KHÔNG ĐƯỢC <span class="font-normal text-slate-700">phát bắn hay cao sâu.</span></p>
                <p class="mt-1 text-xs text-slate-500">
                  Vi phạm: Xử đánh lại. Cố tình vi phạm lần 2 → <span class="font-bold text-slate-800">trừ 1 điểm</span>.
                </p>
              </td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-semibold text-slate-800">Nam phát cầu cho Nam</td>
              <td class="px-4 py-3 font-semibold text-emerald-600">Phát bắn &amp; cao sâu bình thường</td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-semibold text-slate-800">Nữ phát cầu cho Nữ</td>
              <td class="px-4 py-3">
                <p class="font-bold text-red-600">
                  KHÔNG ĐƯỢC <span class="font-normal text-slate-700">phát bắn, nhưng được phát cao sâu bình thường.</span>
                </p>
                <p class="mt-1 text-xs text-slate-500">
                  Vi phạm: Xử đánh lại. Cố tình vi phạm lần 2 → <span class="font-bold text-slate-800">trừ 1 điểm</span>.
                </p>
              </td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-semibold text-slate-800">Nữ phát cầu cho Nam</td>
              <td class="px-4 py-3 font-semibold text-emerald-600">Được phát bắn &amp; cao sâu bình thường</td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-semibold text-slate-800">Nam đập cầu trúng đầu Nữ</td>
              <td class="px-4 py-3">
                <span class="rounded-lg border border-orange-300 bg-orange-50 px-2 py-1 text-xs font-bold text-orange-700">Trừ 1 điểm</span>
                <span class="ml-1 text-slate-700">của bên đập</span>
              </td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-semibold text-slate-800">Nữ đập cầu trúng đầu Nữ</td>
              <td class="px-4 py-3 font-semibold text-emerald-600">Đánh lại tình huống (không bị trừ điểm)</td>
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
          <p class="mt-3 font-bold text-slate-900">19h30 - 21h30 tối thứ 6 ngày 31/07/2026.</p>
          <p class="mt-1 text-sm text-slate-600">
            Yêu cầu tất cả các lông thủ tham gia giải có mặt đúng giờ để điểm danh &amp; khởi động.
          </p>
        </div>
        <div class="rounded-2xl border border-orange-200 bg-orange-50 p-5 shadow-sm">
          <p class="flex items-center gap-2 text-sm font-bold uppercase text-orange-700">⚠️ Xử lý đến muộn</p>
          <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
            <li><strong>Muộn 10 - 29 phút</strong> khi gọi vào trận: Bị trừ <strong>3 - 5 điểm</strong>.</li>
            <li><strong>Muộn từ 30 phút trở đi:</strong> Xử thua trận.</li>
            <li class="italic text-slate-500">(Trường hợp đặc biệt BTC sẽ có thể xem xét xử lý khác).</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Cách giải đấu vận hành -->
    <section>
      <span class="inline-block rounded-full bg-blue-950 px-3 py-1 text-xs font-bold text-white">Thể lệ</span>
      <h2 class="mt-2 text-xl font-extrabold uppercase text-blue-950 sm:text-2xl">Cách giải đấu vận hành</h2>

      <div class="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <ul class="space-y-3 text-sm text-slate-700 sm:text-base">
          <li>
            <strong class="text-slate-900">Đội hình:</strong> Mỗi đội là một cặp nam - nữ, bốc thăm ngẫu nhiên từ 12 lông thủ
            nam và 12 lông thủ nữ.
          </li>
          <li><strong class="text-slate-900">Thời lượng:</strong> Mỗi trận 15 phút, hết giờ cặp nào nhiều điểm hơn thắng.</li>
          <li>
            <strong class="text-slate-900">Vòng 1 – loại trực tiếp:</strong> 6 trận. Cặp thắng vào Nhánh A (A1-A6), cặp thua
            vào Nhánh B (B1-B6). Thua vòng 1 vẫn còn nguyên cơ hội vô địch.
          </li>
          <li>
            <strong class="text-slate-900">Vòng 2 – vòng tròn:</strong> 4 bảng × 3 cặp, mỗi bảng 3 trận. Mỗi cặp đánh 2 trận.
            Nhất bảng đi tiếp.
          </li>
          <li><strong class="text-slate-900">Xếp hạng bảng:</strong> Số trận thắng → hiệu số điểm → tổng điểm ghi được.</li>
          <li>
            <strong class="text-slate-900">Vòng 3 – chung kết nhánh:</strong> Nhất bảng A1 gặp nhất bảng A2, nhất bảng B1 gặp
            nhất bảng B2.
          </li>
          <li>
            <strong class="text-slate-900">Vòng 4 – chung kết tổng:</strong> Vô địch nhánh A gặp Vô địch nhánh B để xác định
            Lươn Chúa thực sự của giải.
          </li>
        </ul>
      </div>
    </section>

    <!-- Thông tin thi đấu & đóng góp -->
    <section>
      <span class="inline-block rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">Địa điểm &amp; lệ phí</span>
      <h2 class="mt-2 text-xl font-extrabold uppercase text-blue-950 sm:text-2xl">Thông tin thi đấu &amp; đóng góp</h2>

      <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-[11px] font-bold uppercase text-slate-400">Ngày thi đấu</p>
          <p class="mt-1 font-bold text-slate-900">Thứ 6, 31/07/2026</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-[11px] font-bold uppercase text-slate-400">Giờ</p>
          <p class="mt-1 font-bold text-slate-900">19h30 - 21h30</p>
          <p class="text-xs text-slate-500">Có mặt đúng 19h30</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-[11px] font-bold uppercase text-slate-400">Địa điểm</p>
          <p class="mt-1 font-bold text-slate-900">THPT Khương Đình</p>
          <p class="text-xs text-slate-500">Sân 1 · 2 · 3</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-[11px] font-bold uppercase text-slate-400">Trận cuối</p>
          <p class="mt-1 font-bold text-slate-900">Tranh ngôi Lươn Chúa</p>
          <p class="text-xs text-slate-500">Vô địch A gặp Vô địch B</p>
        </div>
      </div>
    </section>
  </div>
</template>
