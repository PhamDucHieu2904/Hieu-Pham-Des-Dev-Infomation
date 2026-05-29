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
        document.body.style.zoom = ""; 
        
        // 1. Lấy bề ngang vật lý của màn hình điện thoại người dùng (Ví dụ: 390px hoặc 414px)
        const screenWidth = window.screen.width;
        
        // 2. Tính toán tỷ lệ thu nhỏ để 1080px nhét vừa khít vào màn hình
        // Ví dụ máy rộng 390px -> Tỷ lệ là: 390 / 1080 = 0.361
        const initialScale = screenWidth / 1080;
        
        // 3. Ép tỷ lệ này vào thẻ Meta
        // - width=1080: Giữ nguyên bàn làm việc 1080px cho CSS hoạt động
        // - initial-scale: Ép trình duyệt phải thu nhỏ đúng tỷ lệ đã tính ở trên ngay khi load
        // - user-scalable=yes: Cho phép người dùng zoom in/out thoải mái sau đó
        viewportMeta.setAttribute("content", `width=1080, initial-scale=${initialScale}, user-scalable=yes`);
        
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
    }, 800); 

    // TĂNG LÊN 2800ms: Để logo có đủ thời gian lùi về góc và thả Footer xuống
    setTimeout(() => {
        body.classList.remove('intro-step-2');
    }, 1500); 
});