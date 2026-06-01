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
/* =========================================
   DESIGN LAB - 3D CYLINDER ROTATION
   ========================================= */
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.dl-btn');
    const cylinder = document.getElementById('software-cylinder');
    const titleText = document.querySelector('.dl-top-title h2');
    const slides = document.querySelectorAll('.dl-software-slide');
    const scene = document.getElementById('main-scene');

    if (!cylinder || !titleText || !scene) return;

    buttons.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            if(this.classList.contains('active')) return;

            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // 1. Tắt 2 màn hình bên hông ngay lập tức
            scene.classList.add('is-rotating');

            const angle = index * -120;
            
            // 2. Chờ 150ms để màn hình 2 bên "tắt hẳn" rồi mới bắt đầu xoay Trụ
            setTimeout(() => {
                cylinder.style.transform = `translateZ(-1200px) rotateY(${angle}deg)`;

                slides.forEach(slide => slide.classList.remove('active-slide'));
                slides[index].classList.add('active-slide');
            }, 150);

            // Đổi chữ Title
            const pageName = this.querySelector('span').innerText;
            titleText.style.opacity = 0;
            
            setTimeout(() => {
                titleText.innerText = pageName;
                titleText.style.opacity = 1;
            }, 400); 

            // 3. Sau khi Main Screen xoay đến nơi (150ms chờ + 800ms xoay = 950ms) thì nhả tàng hình ra!
            setTimeout(() => {
                scene.classList.remove('is-rotating');
            }, 950); 
        });
    });

    if(slides.length > 0) {
        slides[0].classList.add('active-slide');
    }
});