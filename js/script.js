function applySmartScaling() {
    const isPortrait = window.innerHeight > window.innerWidth;
    let viewportMeta = document.querySelector("meta[name=viewport]");

    if (!viewportMeta) {
        viewportMeta = document.createElement("meta");
        viewportMeta.name = "viewport";
        document.head.appendChild(viewportMeta);
    }

    if (isPortrait) {
        document.body.style.zoom = ""; 
        const screenWidth = window.screen.width;
        const initialScale = screenWidth / 1080;
        viewportMeta.setAttribute("content", `width=1080, initial-scale=${initialScale}, user-scalable=yes`);
        
        document.body.classList.add('is-mobile-device');
    } else {
        viewportMeta.setAttribute("content", "width=device-width, initial-scale=1.0");
        const screenWidth = document.documentElement.clientWidth || window.innerWidth;
        const scaleFactor = screenWidth / 1920;
        document.body.style.zoom = scaleFactor;
        
        document.body.classList.remove('is-mobile-device');
    }
}

applySmartScaling();
window.addEventListener('resize', applySmartScaling);
window.addEventListener('orientationchange', applySmartScaling); 

// Hệ thống Intro Animation
document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    body.classList.add('intro-step-1');

    setTimeout(() => {
        body.classList.remove('intro-step-1');
        body.classList.add('intro-step-2');
    }, 800); 

    setTimeout(() => {
        body.classList.remove('intro-step-2');
    }, 1500); 
});

// =========================================
// HỆ THỐNG CHUYỂN TRANG (TAB NAVIGATION)
// =========================================
document.addEventListener("DOMContentLoaded", () => {
    // Tìm tất cả các nút trên thanh Nav và tất cả các Trang có class 'page-section'
    const navButtons = document.querySelectorAll('.nav-menu .nav-btn');
    const pages = document.querySelectorAll('.page-section');

    navButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault(); // CHẶN LỆNH SCROLL: Ép trình duyệt không được cuộn xuống

            // Lấy ID của trang đích (Ví dụ: bấm nút Design Lab sẽ lấy chuỗi "#design-lab")
            const targetId = this.getAttribute('href');
            const targetPage = document.querySelector(targetId);

            // Nếu trang (Dev Portal, Contact) chưa code xong thì không làm gì cả
            if (!targetPage) return; 

            // 1. Đổi màu nút Nav: Xóa sáng ở nút cũ, bật sáng ở nút vừa bấm
            navButtons.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            // 2. Tắt toàn bộ đèn: Ẩn tất cả các trang đi
            pages.forEach(page => {
                page.style.display = 'none';
            });

            // 3. Bật đèn sân khấu: Hiện trang được gọi lên
            targetPage.style.display = 'flex'; 
            
            // Xóa hiệu ứng Intro animation (Nếu đang có) để tránh lỗi giật layout
            document.body.classList.remove('intro-step-1', 'intro-step-2');
        });
    });
});