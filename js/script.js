/* =========================================
   HỆ THỐNG AUTO-SCALE & ĐIỀU HƯỚNG MOBILE
   ========================================= */

// Hàm 1: Chỉ chạy đúng 1 lần khi mới vào web để ép tỷ lệ chuẩn
function setInitialScale() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Chỉ tính tỷ lệ nếu đang ở màn hình ngang (Laptop/PC)
    if (screenWidth >= screenHeight) {
        const scaleFactor = screenWidth / 1920;
        document.body.style.zoom = scaleFactor;
    }
}

// Hàm 2: Hàm kiểm tra Mobile (Chỉ dùng để bật/tắt thông báo)
function checkMobileLayout() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    if (screenHeight > screenWidth) {
        document.body.classList.add('is-mobile-device');
    } else {
        document.body.classList.remove('is-mobile-device');
    }
}

// THỰC THI:
// 1. Ép tỷ lệ 1 lần duy nhất ngay lúc vừa tải trang
setInitialScale();

// 2. Kiểm tra layout mobile ngay lúc tải trang
checkMobileLayout();

// 3. Lắng nghe sự kiện: Chỉ chạy lại hàm checkMobileLayout khi resize
// (Không chạy lại hàm setInitialScale nữa để người dùng tự do Zoom)
window.addEventListener('resize', checkMobileLayout);

document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    body.classList.add('intro-step-1');

    // Sau 1s: Logo bay về góc, Header/Footer hiện ra
    setTimeout(() => {
        body.classList.remove('intro-step-1');
        body.classList.add('intro-step-2');
    }, 1000); 

    // Sau 2s: Nội dung chính bắt đầu trượt xuống và Fade in (opacity 0 -> 1)
    setTimeout(() => {
        body.classList.remove('intro-step-2');
    }, 2000); 
});