// =========================================
// HỆ THỐNG SMART SCALING (CỦA BẠN)
// =========================================
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

// =========================================
// INTRO ANIMATION & TAB NAV (CỦA BẠN)
// =========================================
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

document.addEventListener("DOMContentLoaded", () => {
    const navButtons = document.querySelectorAll('.nav-menu .nav-btn');
    const pages = document.querySelectorAll('.page-section');

    navButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault(); 
            const targetId = this.getAttribute('href');
            const targetPage = document.querySelector(targetId);
            if (!targetPage) return; 

            navButtons.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            pages.forEach(page => page.style.display = 'none');
            targetPage.style.display = 'flex'; 
            
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

    // --- 1. SETUP LOGIC MOBILE (KIẾN TRÚC UNITY LERP) ---
    const allMobileSlides = document.querySelectorAll('.dl-software-slide');
    let currentMobileIndex = 1;

    // CÁC BIẾN CHO UNITY UPDATE LOOP
    let currentAngle = -40; // Góc thực tế
    let targetAngle = -40;  // Góc đích muốn đến
    
    let currentRadius = 1600; // Bán kính thực tế
    let targetRadius = 1600;  // Bán kính đích (Khi vuốt sẽ thu nhỏ lại)
    
    let isMobileLoopRunning = false;

    // VÒNG LẶP UPDATE (Chạy liên tục 60fps)
    function mobileUpdateLoop() {
        if (!document.body.classList.contains('is-mobile-device')) {
            isMobileLoopRunning = false;
            return; 
        }

        // Lerp Góc xoay
        currentAngle += (targetAngle - currentAngle) * 0.12; 
        
        // Lerp Bán kính (Thu hẹp/Mở rộng độ giãn của các tấm thẻ)
        currentRadius += (targetRadius - currentRadius) * 0.12; 
        
        // 1. Dịch Camera tiến/lùi theo bán kính hiện tại
        cylinder.style.transform = `translateZ(-${currentRadius}px) rotateY(${currentAngle}deg)`;

        // 2. Ép tất cả 9 tấm thẻ lùi sát vào trục quay hoặc giãn ra xa
        allMobileSlides.forEach((slide, index) => {
            slide.style.transform = `rotateY(${index * 40}deg) translateZ(${currentRadius}px)`;
        });

        requestAnimationFrame(mobileUpdateLoop);
    }

    function setupMobileCylinder() {
        if (document.body.classList.contains('is-mobile-device')) {
            if (!isMobileLoopRunning) {
                isMobileLoopRunning = true;
                mobileUpdateLoop();
            }
            rotateMobileTo(currentMobileIndex); 
        }
    }
    setupMobileCylinder();

    function rotateMobileTo(index) {
        if (index < 0) index = 0;
        if (index > 8) index = 8;
        currentMobileIndex = index;

        targetAngle = index * -40;
        targetRadius = 1600; // Đảm bảo luôn bung giãn màn hình khi nhả tay ra

        allMobileSlides.forEach(slide => slide.classList.remove('active-slide'));
        if(allMobileSlides[index]) allMobileSlides[index].classList.add('active-slide');

        let groupName = "";
        let btnIndex = 0;
        if (index >= 0 && index <= 2) { groupName = "PHOTOSHOP"; btnIndex = 0; }
        else if (index >= 3 && index <= 5) { groupName = "ILLUSTRATOR"; btnIndex = 1; }
        else if (index >= 6 && index <= 8) { groupName = "BLENDER"; btnIndex = 2; }

        mobileBtns.forEach(b => b.classList.remove('active'));
        if(mobileBtns[btnIndex]) mobileBtns[btnIndex].classList.add('active');

        updateTitle(groupName);
    }

    // --- SỰ KIỆN KÉO THẢ (DRAG & SNAP) ---
    let isDragging = false;
    let hasMoved = false;
    let startX = 0;
    let startAngle = -40;

    scene.addEventListener('touchstart', e => {
        if(!document.body.classList.contains('is-mobile-device')) return;
        isDragging = true;
        hasMoved = false;
        startX = e.touches[0].clientX;
        
        startAngle = currentAngle;
        targetAngle = currentAngle; 
    }, {passive: true});

    scene.addEventListener('touchmove', e => {
        if(!isDragging || !document.body.classList.contains('is-mobile-device')) return;
        
        let deltaX = e.touches[0].clientX - startX;

        if (!hasMoved) {
            if (Math.abs(deltaX) > 10) {
                hasMoved = true;
                scene.classList.add('is-dragging'); 
                
                // KHI XÁC NHẬN ĐANG KÉO: ÉP BÁN KÍNH NHỎ LẠI (Túm các thẻ lại với nhau)
                targetRadius = 1100; 
            } else {
                return;
            }
        }
        
        let sensitivity = 0.25; 
        targetAngle = startAngle + (deltaX * sensitivity); 
    }, {passive: true});

    const handleTouchEnd = (e) => {
        if(!isDragging || !document.body.classList.contains('is-mobile-device')) return;
        isDragging = false;
        
        if (!hasMoved) return; // Nếu là Click thì bỏ qua bước Snap

        scene.classList.remove('is-dragging');
        targetRadius = 1600; // Khi nhả tay ra -> Bung giãn các thẻ về vị trí cũ
        
        let deltaX = e.changedTouches[0].clientX - startX;
        let nearestIndex = Math.round(targetAngle / -40);

        if (deltaX < -40 && nearestIndex === currentMobileIndex) nearestIndex++;
        else if (deltaX > 40 && nearestIndex === currentMobileIndex) nearestIndex--;
        
        rotateMobileTo(nearestIndex); 
    };

    scene.addEventListener('touchend', handleTouchEnd, {passive: true});
    scene.addEventListener('touchcancel', handleTouchEnd, {passive: true});

    mobileBtns.forEach((btn, btnIndex) => {
        btn.addEventListener('click', function() {
            if(this.classList.contains('active') || !document.body.classList.contains('is-mobile-device')) return;
            let targetIndex = (btnIndex * 3) + 1; 
            rotateMobileTo(targetIndex);
        });
    });

    // --- 2. SETUP LOGIC CHO DESKTOP ---
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

    // --- 3. ĐỔI TITLE GLITCH EFFECT ---
    function updateTitle(newName) {
        if (titleText.innerText === newName) return;
        titleText.classList.add('title-glitch');
        titleText.style.opacity = ''; 
        setTimeout(() => {
            titleText.innerText = newName;
            titleText.classList.remove('title-glitch');
        }, 300);
    }

    // --- 4. XỬ LÝ LỖI KHI XOAY MÀN HÌNH (MOBILE <-> DESKTOP) ---
    window.addEventListener('resize', () => {
        let currentModeIsMobile = document.body.classList.contains('is-mobile-device');
        if (currentModeIsMobile) {
            setupMobileCylinder();
        } else {
            allMobileSlides.forEach(slide => slide.style.transform = ''); 
            cylinder.style.transform = `translateZ(-1200px) rotateY(${currentDesktopIndex * -120}deg)`;
        }
    });
});