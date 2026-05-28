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

    // Sau 1s: Logo bay về góc, Header/Footer hiện ra
    setTimeout(() => {
        body.classList.remove('intro-step-1');
        body.classList.add('intro-step-2');
    }, 1000); 

    // Sau 2s: Nội dung chính bắt đầu trượt xuống và Fade in
    setTimeout(() => {
        body.classList.remove('intro-step-2');
    }, 2000); 
});