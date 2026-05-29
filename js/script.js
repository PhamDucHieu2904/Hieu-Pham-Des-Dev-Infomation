/* =========================================
   HỆ THỐNG AUTO-SCALE ĐỒNG NHẤT (FIX LỖI MOBILE REAL DEVICE)
   ========================================= */
function applySmartScaling() {
    const isPortrait = window.innerHeight > window.innerWidth;
    let viewportMeta = document.querySelector("meta[name=viewport]");

    if (!viewportMeta) {
        viewportMeta = document.createElement("meta");
        viewportMeta.name = "viewport";
        document.head.appendChild(viewportMeta);
    }

    if (isPortrait) {
        // --- 1. MÀN HÌNH DỌC (MOBILE) ---
        // XÓA BỎ lệnh zoom rác gây vỡ layout trên điện thoại
        document.body.style.zoom = ""; 
        
        // TUYỆT CHIÊU: Ép trình duyệt điện thoại khai báo màn hình rộng đúng 1080px
        // Trình duyệt sẽ TỰ ĐỘNG fit toàn bộ web vừa khít màn hình mượt mà 100%
        // Lệnh user-scalable=no sẽ KHÓA CHẶT không cho người dùng zoom bậy bạ
        viewportMeta.setAttribute("content", "width=1080, user-scalable=no");
        
        document.body.classList.add('is-mobile-device');
    } else {
        // --- 2. MÀN HÌNH NGANG (PC) ---
        // Trả lại viewport mặc định cho PC
        viewportMeta.setAttribute("content", "width=device-width, initial-scale=1.0");
        
        // PC hỗ trợ thuộc tính zoom rất tốt, nên ta giữ nguyên logic cũ của bạn cho PC
        const screenWidth = document.documentElement.clientWidth || window.innerWidth;
        const scaleFactor = screenWidth / 1920;
        document.body.style.zoom = scaleFactor;
        
        document.body.classList.remove('is-mobile-device');
    }
}

// Chạy 1 lần lúc vừa tải trang
applySmartScaling();
window.addEventListener('resize', applySmartScaling);
window.addEventListener('orientationchange', applySmartScaling); // Lắng nghe thêm sự kiện xoay màn hình


// Hệ thống Intro Animation
document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    body.classList.add('intro-step-1');

    // TĂNG LÊN 1500ms: Để logo bay vút lên (1s) và có 0.5s dừng lại ngầu lòi ở giữa
    setTimeout(() => {
        body.classList.remove('intro-step-1');
        body.classList.add('intro-step-2');
    }, 1000); 

    // TĂNG LÊN 2800ms: Để logo có đủ thời gian lùi về góc và thả Footer xuống
    setTimeout(() => {
        body.classList.remove('intro-step-2');
    }, 2000); 
});