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
   DESIGN LAB - 3D CYLINDER ROTATION (DESKTOP & MOBILE)
   ========================================= */
document.addEventListener('DOMContentLoaded', function() {
    const cylinder = document.getElementById('software-cylinder');
    const titleText = document.querySelector('.dl-top-title h2');
    const scene = document.getElementById('main-scene');
    
    const desktopBtns = document.querySelectorAll('.desktop-nav .dl-btn');
    const mobileBtns = document.querySelectorAll('.mobile-nav .dl-btn-mobile');

    if (!cylinder || !titleText || !scene) return;

    let isMobile = document.body.classList.contains('is-mobile-device');
    
    // --- 1. SETUP LOGIC CHO MOBILE (9 MẶT) ---
    const allMobileSlides = document.querySelectorAll('.dl-software-slide');
    let currentMobileIndex = 1; // Khởi đầu mở app ở đúng Màn hình GIỮA của Photoshop (Chỉ số 1)
    let touchStartX = 0;
    let touchEndX = 0;

    // Hàm sắp xếp 9 tấm màn hình thành hình tròn
    function setupMobileCylinder() {
        if (document.body.classList.contains('is-mobile-device')) {
            allMobileSlides.forEach((slide, index) => {
                // Xoay mỗi mặt 40 độ (360/9). Phóng trục Z ra 2300px để màn hình không bị cấn nhau
                slide.style.transform = `rotateY(${index * 40}deg) translateZ(1500px)`;
            });
            rotateMobileTo(currentMobileIndex); // Xoay vào giữa PS
        }
    }
    setupMobileCylinder();

    // Hàm xoay khối trụ Mobile & Đồng bộ Giao diện
    function rotateMobileTo(index) {
        // Khóa cuộn 2 đầu (Không cho trượt quá PS và quá Blender)
        if (index < 0) index = 0;
        if (index > 8) index = 8;
        currentMobileIndex = index;

        // Xoay 3D
        const angle = index * -40; 
        cylinder.style.transform = `translateZ(-1500px) rotateY(${angle}deg)`;

        // Tắt đèn cũ, Bật đèn màn hình mới
        allMobileSlides.forEach(slide => slide.classList.remove('active-slide'));
        allMobileSlides[index].classList.add('active-slide');

        // Logic Đồng bộ Tiêu đề & Nút bấm
        let groupName = "";
        let btnIndex = 0;
        if (index >= 0 && index <= 2) { groupName = "PHOTOSHOP"; btnIndex = 0; }
        else if (index >= 3 && index <= 5) { groupName = "ILLUSTRATOR"; btnIndex = 1; }
        else if (index >= 6 && index <= 8) { groupName = "BLENDER"; btnIndex = 2; }

        // Cập nhật Nút dưới đáy
        mobileBtns.forEach(b => b.classList.remove('active'));
        if(mobileBtns[btnIndex]) mobileBtns[btnIndex].classList.add('active');

        // Cập nhật Title Glitch
        updateTitle(groupName);
    }

 // --- BẮT ĐẦU: KHỐI SỰ KIỆN KÉO THẢ (TÍCH HỢP LERP SMOOTHING) ---
    let isDragging = false;
    let hasMoved = false;
    let startX = 0;
    
    let startAngle = 0;
    let targetAngle = -40; // Vị trí Đích muốn tới (Bắt đầu ở PS = -40)
    let currentAngle = -40; // Vị trí Thực tế của Camera
    let animationFrameId;

    // HÀM LERP: Cập nhật liên tục 60fps
    function lerpAnimation() {
        if (!document.body.classList.contains('is-mobile-device')) return;

        // Công thức Mathf.Lerp: current += (target - current) * speed
        // Số 0.08 là độ mượt. Càng nhỏ càng mượt (trễ), càng lớn càng nhạy.
        currentAngle += (targetAngle - currentAngle) * 0.08; 
        
        cylinder.style.transform = `translateZ(-1600px) rotateY(${currentAngle}deg)`;

        // Dừng vòng lặp nếu ngón tay đã nhấc lên VÀ khối trụ đã xoay đến đích (sai số < 0.05)
        if (!isDragging && Math.abs(targetAngle - currentAngle) < 0.05) {
            currentAngle = targetAngle; // Chốt hạ chính xác góc
            cylinder.style.transform = `translateZ(-1600px) rotateY(${currentAngle}deg)`;
            cancelAnimationFrame(animationFrameId);
            return;
        }
        
        animationFrameId = requestAnimationFrame(lerpAnimation);
    }

    // 1. KHI NGÓN TAY CHẠM
    scene.addEventListener('touchstart', e => {
        if(!document.body.classList.contains('is-mobile-device')) return;
        isDragging = true;
        hasMoved = false;
        startX = e.touches[0].clientX;
        
        // SỬA LỖI GIẬT: Phải lấy góc đang xoay hiện tại (currentAngle) làm mốc bắt đầu
        startAngle = currentAngle; 
        targetAngle = currentAngle; 
        
        cancelAnimationFrame(animationFrameId);
        lerpAnimation(); 
    }, {passive: true});

    // 2. KHI NGÓN TAY DI CHUYỂN
    scene.addEventListener('touchmove', e => {
        if(!isDragging || !document.body.classList.contains('is-mobile-device')) return;
        
        let deltaX = e.touches[0].clientX - startX;

        if (!hasMoved) {
            if (Math.abs(deltaX) > 10) {
                hasMoved = true;
                scene.classList.add('is-dragging');
            } else {
                return;
            }
        }
        
        let sensitivity = 0.25; 
        targetAngle = startAngle + (deltaX * sensitivity); 
    }, {passive: true});

    // 3. KHI NHẤC NGÓN TAY LÊN (SNAP - ĐÃ FIX LỖI TREO LƯNG LỬNG)
    const handleTouchEnd = (e) => {
        if(!isDragging || !document.body.classList.contains('is-mobile-device')) return;
        isDragging = false;
        
        if (!hasMoved) return; 
        
        scene.classList.remove('is-dragging');
        
        let deltaX = e.changedTouches[0].clientX - startX;
        
        // CHÌA KHÓA Ở ĐÂY: Ưu tiên bắt dính vào mặt gần với vị trí ngón tay nhả ra nhất!
        let nearestIndex = Math.round(targetAngle / -40);

        // QUÁN TÍNH THÔNG MINH: 
        // Chỉ khi vuốt nhẹ nhưng nhanh (khoảng cách > 40px) mà nearestIndex vẫn rớt lại trang cũ, 
        // thì ta mới ÉP nó sang trang kế tiếp.
        if (deltaX < -40 && nearestIndex === currentMobileIndex) {
            nearestIndex++;
        } else if (deltaX > 40 && nearestIndex === currentMobileIndex) {
            nearestIndex--;
        }
        
        // Khóa 2 đầu giới hạn (Không cho trượt ra ngoài 9 màn hình)
        if (nearestIndex < 0) nearestIndex = 0;
        if (nearestIndex > 8) nearestIndex = 8;
        
        rotateMobileTo(nearestIndex);
    };

    scene.addEventListener('touchend', handleTouchEnd, {passive: true});
    scene.addEventListener('touchcancel', handleTouchEnd, {passive: true});

    // HÀM ROTATE NÂNG CẤP (Dành cho Snap và Click Nút)
    // Sửa lại hàm rotateMobileTo hiện tại của bạn thành thế này:
    window.rotateMobileTo = function(index) {
        if (index < 0) index = 0;
        if (index > 8) index = 8;
        currentMobileIndex = index;

        // Set đích đến cho vòng lặp Lerp tự bám theo (thay vì css transition)
        targetAngle = index * -40; 
        
        // Kích nổ động cơ nếu nó đang ngủ
        cancelAnimationFrame(animationFrameId);
        lerpAnimation();

        // Đồng bộ giao diện
        allMobileSlides.forEach(slide => slide.classList.remove('active-slide'));
        allMobileSlides[index].classList.add('active-slide');

        let groupName = "";
        let btnIndex = 0;
        if (index >= 0 && index <= 2) { groupName = "PHOTOSHOP"; btnIndex = 0; }
        else if (index >= 3 && index <= 5) { groupName = "ILLUSTRATOR"; btnIndex = 1; }
        else if (index >= 6 && index <= 8) { groupName = "BLENDER"; btnIndex = 2; }

        mobileBtns.forEach(b => b.classList.remove('active'));
        if(mobileBtns[btnIndex]) mobileBtns[btnIndex].classList.add('active');

        updateTitle(groupName);
    };
    // --- KẾT THÚC: KHỐI SỰ KIỆN KÉO THẢ (TÍCH HỢP LERP) ---

    // Bắt sự kiện Click Nút Mobile
    mobileBtns.forEach((btn, btnIndex) => {
        btn.addEventListener('click', function() {
            if(this.classList.contains('active') || !document.body.classList.contains('is-mobile-device')) return;
            // Công thức đưa thẳng vào màn hình Giữa: PS (1), AI (4), BLENDER (7)
            let targetIndex = (btnIndex * 3) + 1; 
            rotateMobileTo(targetIndex);
        });
    });


    // --- 2. SETUP LOGIC CHO DESKTOP (Giữ nguyên của bạn) ---
    const desktopSlides = document.querySelectorAll('.slide-desktop');
    let currentDesktopIndex = 0;

    desktopBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            if(this.classList.contains('active') || document.body.classList.contains('is-mobile-device')) return;

            desktopBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            scene.classList.add('is-rotating');

            const angle = index * -120;
            currentDesktopIndex = index;

            setTimeout(() => {
                cylinder.style.transform = `translateZ(-1200px) rotateY(${angle}deg)`;
                desktopSlides.forEach(slide => slide.classList.remove('active-slide'));
                desktopSlides[index].classList.add('active-slide');
            }, 150);

            updateTitle(this.querySelector('span').innerText);
            setTimeout(() => { scene.classList.remove('is-rotating'); }, 950);
        });
    });

    // --- 3. HÀM DÙNG CHUNG: ĐỔI TITLE GLITCH EFFECT ---
    function updateTitle(newName) {
        if (titleText.innerText === newName) return;
        titleText.classList.add('title-glitch');
        titleText.style.opacity = ''; 
        setTimeout(() => {
            titleText.innerText = newName;
            titleText.classList.remove('title-glitch');
        }, 300);
    }

    // Lắng nghe đổi xoay màn hình (Resize từ Mobile <-> Desktop) để setup lại
    window.addEventListener('resize', () => {
        let currentModeIsMobile = document.body.classList.contains('is-mobile-device');
        if (currentModeIsMobile) {
            setupMobileCylinder();
        } else {
            allMobileSlides.forEach(slide => slide.style.transform = ''); // Xóa xoay 40 độ
            cylinder.style.transform = `translateZ(-1200px) rotateY(${currentDesktopIndex * -120}deg)`;
        }
    });
});