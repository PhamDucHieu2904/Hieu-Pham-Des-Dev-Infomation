/* =========================================
   HỆ THỐNG AUTO-SCALE ĐỒNG NHẤT (PC & MOBILE)
   ========================================= */
function applySmartScaling() {
    // Ép trình duyệt đọc kích thước phần cứng thực tế, chống lỗi F5
    const screenWidth = document.documentElement.clientWidth || window.innerWidth;
    const screenHeight = document.documentElement.clientHeight || window.innerHeight;

    if (screenHeight > screenWidth) {
        // --- 1. MÀN HÌNH DỌC (MOBILE) ---
        const scaleFactor = screenWidth / 1080;
        document.body.style.zoom = scaleFactor;
        document.body.classList.add('is-mobile-device');
    } else {
        // --- 2. MÀN HÌNH NGANG (PC) ---
        const scaleFactor = screenWidth / 1920;
        document.body.style.zoom = scaleFactor;
        document.body.classList.remove('is-mobile-device');
    }
}

// Chạy 1 lần lúc vừa tải trang
applySmartScaling();
window.addEventListener('resize', applySmartScaling);

// (Phần code animation bên dưới giữ nguyên)

// Hệ thống Intro Animation
document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    body.classList.add('intro-step-1');

    // TĂNG LÊN 1500ms: Để logo bay vút lên (1s) và có 0.5s dừng lại ngầu lòi ở giữa
    setTimeout(() => {
        body.classList.remove('intro-step-1');
        body.classList.add('intro-step-2');
    }, 1500); 

    // TĂNG LÊN 2800ms: Để logo có đủ thời gian lùi về góc và thả Footer xuống
    setTimeout(() => {
        body.classList.remove('intro-step-2');
    }, 2800); 
});