// =========================================
// 1. HỆ THỐNG SMART SCALING & CINEMATIC FADE
// =========================================
let lastDeviceMode = null;

function performScaleLogic(isPortrait) {
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

function applySmartScaling() {
    const isPortrait = window.innerHeight > window.innerWidth;
    const currentMode = isPortrait ? 'mobile' : 'desktop';
    const designLabSection = document.getElementById('design-lab');

    // Nếu có sự thay đổi giữa ngang và dọc -> Kích hoạt hiệu ứng Fade
    if (lastDeviceMode !== null && lastDeviceMode !== currentMode) {
        if (designLabSection) {
            designLabSection.style.transition = 'opacity 0.4s ease';
            designLabSection.style.opacity = '0';
        }
        
        setTimeout(() => {
            performScaleLogic(isPortrait);
            if (designLabSection) designLabSection.style.opacity = '1';
        }, 450); // Chờ màn hình tối hẳn rồi mới hoán đổi DOM
    } else {
        // Nếu load lần đầu hoặc chỉ kéo giãn cửa sổ (không đổi chế độ) -> Scale lập tức
        performScaleLogic(isPortrait);
    }
    
    lastDeviceMode = currentMode;
}

applySmartScaling();
window.addEventListener('resize', applySmartScaling);
window.addEventListener('orientationchange', applySmartScaling); 

// =========================================
// INTRO ANIMATION & TAB NAV (AN TOÀN TUYỆT ĐỐI)
// =========================================
document.addEventListener("DOMContentLoaded", () => {
    // --- 1. CHẠY INTRO LOGO BAY LÊN (TRẢ LẠI NGUYÊN BẢN 100%) ---
    const body = document.body;
    body.classList.add('intro-step-1');
    setTimeout(() => {
        body.classList.remove('intro-step-1');
        body.classList.add('intro-step-2');
    }, 800); 
    setTimeout(() => {
        body.classList.remove('intro-step-2');
    }, 1500); 

    // --- 2. HỆ THỐNG TRƯỢT TRANG KHI CLICK ---
    const navButtons = Array.from(document.querySelectorAll('.nav-menu .nav-btn'));
    const pages = Array.from(document.querySelectorAll('.page-section'));
    const mainWrapper = document.querySelector('.main-wrapper');
    
    let currentPageIndex = 0; 
    let isAnimating = false;  

    // KHÔNG CAN THIỆP VÀO DISPLAY LÚC KHỞI ĐỘNG ĐỂ BẢO TOÀN CSS ANIMATION

    navButtons.forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            e.preventDefault(); 
            
            // Khóa chốt an toàn
            if (isAnimating || index === currentPageIndex) return; 
            isAnimating = true;

            const targetId = this.getAttribute('href');
            const targetPage = document.querySelector(targetId);
            const currentPage = pages[currentPageIndex];
            if (!targetPage) { isAnimating = false; return; }

            // Đổi màu Nút
            navButtons.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            // Tính toán hướng trượt
            const isSlidingRight = index > currentPageIndex; 
            const inClass = isSlidingRight ? 'slide-in-right' : 'slide-in-left';
            const outClass = isSlidingRight ? 'slide-out-left' : 'slide-out-right';

            // Xóa display:none, trả lại quyền hiển thị nguyên gốc cho trang đích (CSS sẽ tự lo)
            targetPage.style.display = ''; 
            
            // Đo đạc và khóa chiều cao chống sập, chống giật thanh cuộn
            const maxH = Math.max(currentPage.offsetHeight, targetPage.offsetHeight);
            
            mainWrapper.style.position = 'relative';
            mainWrapper.style.overflowX = 'hidden';
            mainWrapper.style.minHeight = maxH + 'px'; 

            // Gắn class chuẩn bị trượt
            currentPage.classList.add('sliding-page');
            targetPage.classList.add('sliding-page');

            // Ép trình duyệt tính toán lại layout ngay lập tức
            void targetPage.offsetWidth; 

            // Cấp lệnh chạy Animation
            currentPage.classList.add(outClass);
            targetPage.classList.add(inClass);

            // Gỡ bỏ Intro nếu user click quá nhanh
            body.classList.remove('intro-step-1', 'intro-step-2');

            // 0.4s SAU: DỌN DẸP SẠCH SẼ
            setTimeout(() => {
                currentPage.style.display = 'none';
                
                currentPage.classList.remove('sliding-page', outClass);
                targetPage.classList.remove('sliding-page', inClass);
                
                mainWrapper.style.position = '';
                mainWrapper.style.overflowX = '';
                mainWrapper.style.minHeight = ''; 
                
                currentPageIndex = index; 
                isAnimating = false;      
            }, 400); 
        });
    });
});

/* =========================================
   3. DESIGN LAB CORE: KIẾN TRÚC TÁCH LUỒNG
   ========================================= */
document.addEventListener('DOMContentLoaded', function() {
    // --- KHAI BÁO BIẾN TOÀN CỤC ---
    const desktopCylinder = document.getElementById('desktop-cylinder');
    const mobileCylinder = document.getElementById('mobile-cylinder');
    const desktopScene = document.getElementById('desktop-scene');
    const mobileScene = document.getElementById('mobile-scene');
    const titleText = document.querySelector('.dl-top-title h2');

    const desktopBtns = document.querySelectorAll('.desktop-nav .dl-btn');
    const mobileBtns = document.querySelectorAll('.mobile-nav .dl-btn-mobile');
    
    let showcaseData = {}; // Kho chứa JSON

    // --- LIÊN KẾT: TỪ TRANG CHỦ -> DESIGN LAB ---
    const techBtns = document.querySelectorAll('.tech-btn');
    const designLabNavBtn = document.querySelector('.nav-btn[href="#design-lab"]');
    techBtns.forEach((btn, index) => {
        if (index <= 2) { 
            btn.addEventListener('click', function(e) {
                e.preventDefault(); 
                if (designLabNavBtn) designLabNavBtn.click();

                setTimeout(() => {
                    if (document.body.classList.contains('is-mobile-device')) {
                        if (mobileBtns[index]) mobileBtns[index].click();
                    } else {
                        if (desktopBtns[index]) desktopBtns[index].click();
                    }
                }, 50);
            });
        }
    });

    // --- FETCH DATA VÀ KÍCH HOẠT HỆ THỐNG ---
    fetch('data/showcase.json')
        .then(response => response.json())
        .then(data => {
            showcaseData = data; 
            initDesktopScreens(); // Bơm Data cho khối 3D Desktop
            initMobileScreens();  // Bơm Data cho khối SVG Mobile
            initShowcaseModal();  // Khởi tạo bảng Popup
            initDevPortal(); 
        })
        .catch(error => console.error("Lỗi khi tải Database JSON:", error));

    // ==========================================
    // KHỐI 1: KHỞI TẠO MÀN HÌNH DESKTOP (TRUE 3D)
    // ==========================================
    function initDesktopScreens() {
        const desktopPanels = document.querySelectorAll('#desktop-scene .dl-panel');
        const clipPathSide = 'M117.1,38.7L464.6,98c17.5,3,30.3,18.1,30.3,35.9v431.6c0,17.7-12.8,32.9-30.3,35.9l-347.5,59.1c-22.2,3.8-42.5-13.3-42.5-35.8V74.6C74.6,52.1,94.9,34.9,117.1,38.7z';
        const clipPathCenter = 'M1368.6,556.1c-74.2-4-150.5-6.9-226.8-8.7l-8.7-8.3H793.7l-8.7,8.3c-76.3,1.8-152.6,4.7-226.8,8.7c-4.9-0.7-9.6-2.6-13.6-5.5c-8.2-5.9-13.1-15.4-13.1-25.5V438l12.2-13.9V213.5l-12.2-13.9v-87.1c0-9.1,3.9-17.7,10.8-23.7c4.7-4,10.3-6.6,16.4-7.4c74.2,4,150.7,6.9,227.3,8.7l10,7.8l1.4,1.1H849c37.7,0.5,76.2,0.7,114.5,0.7s76.8-0.2,114.5-0.7h51.5l2.3-1.8l9-7.1c76.7-1.8,153.1-4.7,227.3-8.7c6.1,0.8,11.7,3.4,16.4,7.4c6.9,6,10.8,14.6,10.8,23.7v88.4l-11.1,12.7v210.6l11.1,12.7v88.4c0,10.1-4.9,19.6-13.1,25.5C1378.2,553.5,1373.5,555.4,1368.6,556.1z';

        desktopPanels.forEach((panel, index) => {
            const targetId = panel.getAttribute('data-target');
            if (!targetId || !showcaseData[targetId]) return;

            const images = showcaseData[targetId].images;
            if (!images || images.length === 0) return;

            let currentIndex = Math.floor(Math.random() * images.length);
            const randomImg = images[currentIndex];

            const isSide = panel.classList.contains('left-panel') || panel.classList.contains('right-panel');
            const isRight = panel.classList.contains('right-panel');
            let viewBox = isSide ? '38 -18 514 715' : '480 30 965 580';
            let vb = viewBox.split(' ');
            let clipPathD = isSide ? clipPathSide : clipPathCenter;
            const clipId = `desk-clip-${targetId}-${index}`;

            const imgSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            imgSvg.setAttribute('viewBox', viewBox);
            imgSvg.classList.add('panel-img-layer');
            if (!isSide) imgSvg.style.zIndex = '3';
            let foClass = isSide ? (isRight ? 'fo-right' : 'fo-left') : 'fo-center';
            
            imgSvg.innerHTML = `
                <defs><clipPath id="${clipId}"><path d="${clipPathD}" /></clipPath></defs>
                <g clip-path="url(#${clipId})">
                    <path fill="#001532" d="${clipPathD}" />
                    <foreignObject x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}">
                        <div xmlns="http://www.w3.org/1999/xhtml" class="fo-wrapper ${foClass}">
                            <div class="glitch-wrapper">
                                <div class="fo-image-wrap">
                                    <div class="thumb-bg desk-thumb fo-base" style="background-image: url('${randomImg}')"></div>
                                    <div class="thumb-bg desk-thumb glitch-r" style="background-image: url('${randomImg}')"></div>
                                    <div class="thumb-bg desk-thumb glitch-c" style="background-image: url('${randomImg}')"></div>
                                    <div class="vhs-scanlines"></div>
                                    <div class="vhs-tracking"></div>
                                </div>
                            </div>
                        </div>
                    </foreignObject>
                </g>
            `; 
            panel.insertBefore(imgSvg, panel.firstChild);
            panel.classList.add('has-thumb');

            // Kích hoạt chớp nháy đổi ảnh (5 giây)
            if (images.length > 1) { 
                const imageWrap = imgSvg.querySelector('.fo-image-wrap');
                const allDivs = imgSvg.querySelectorAll('.thumb-bg'); 
                setTimeout(() => {
                    setInterval(() => {
                        imageWrap.classList.add('is-glitching');
                        setTimeout(() => {
                            let nextIndex;
                            do { nextIndex = Math.floor(Math.random() * images.length); } while (nextIndex === currentIndex);
                            currentIndex = nextIndex;
                            allDivs.forEach(div => div.style.backgroundImage = `url('${images[currentIndex]}')`);
                        }, 160); 
                        setTimeout(() => { imageWrap.classList.remove('is-glitching'); }, 400); 
                    }, 5000); 
                }, index * 300); 
            }
        });
    }

    // ==========================================
    // KHỐI 2: KHỞI TẠO MÀN HÌNH MOBILE (NATIVE SVG)
    // ==========================================
    function initMobileScreens() {
        const mobilePanels = document.querySelectorAll('#mobile-scene .dl-panel');
        const clipPathCenter = 'M1368.6,556.1c-74.2-4-150.5-6.9-226.8-8.7l-8.7-8.3H793.7l-8.7,8.3c-76.3,1.8-152.6,4.7-226.8,8.7c-4.9-0.7-9.6-2.6-13.6-5.5c-8.2-5.9-13.1-15.4-13.1-25.5V438l12.2-13.9V213.5l-12.2-13.9v-87.1c0-9.1,3.9-17.7,10.8-23.7c4.7-4,10.3-6.6,16.4-7.4c74.2,4,150.7,6.9,227.3,8.7l10,7.8l1.4,1.1H849c37.7,0.5,76.2,0.7,114.5,0.7s76.8-0.2,114.5-0.7h51.5l2.3-1.8l9-7.1c76.7-1.8,153.1-4.7,227.3-8.7c6.1,0.8,11.7,3.4,16.4,7.4c6.9,6,10.8,14.6,10.8,23.7v88.4l-11.1,12.7v210.6l11.1,12.7v88.4c0,10.1-4.9,19.6-13.1,25.5C1378.2,553.5,1373.5,555.4,1368.6,556.1z';
        let viewBox = '480 30 965 580';
        let vb = viewBox.split(' ');
        let cx = parseFloat(vb[0]) + parseFloat(vb[2]) / 2;
        let cy = parseFloat(vb[1]) + parseFloat(vb[3]) / 2;

        mobilePanels.forEach((panel, index) => {
            const targetId = panel.getAttribute('data-target');
            if (!targetId || !showcaseData[targetId]) return;

            const images = showcaseData[targetId].images;
            if (!images || images.length === 0) return;

            let currentIndex = Math.floor(Math.random() * images.length);
            const randomImg = images[currentIndex];
            const clipId = `mob-clip-${targetId}-${index}`;

            const imgSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            imgSvg.setAttribute('viewBox', viewBox);
            imgSvg.classList.add('mobile-img-layer');
            
            imgSvg.innerHTML = `
                <defs><clipPath id="${clipId}"><path d="${clipPathCenter}" /></clipPath></defs>
                <g clip-path="url(#${clipId})">
                    <path fill="#001532" d="${clipPathCenter}" />
                    
                    <g class="mob-vhs-wrap" style="transform-origin: ${cx}px ${cy}px; transform: rotate(-90deg) scale(1.5);">
                        <image href="${randomImg}" class="svg-base" x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}" preserveAspectRatio="xMidYMid meet" />
                        <image href="${randomImg}" class="svg-glitch-r" x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}" preserveAspectRatio="xMidYMid meet" />
                        <image href="${randomImg}" class="svg-glitch-c" x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}" preserveAspectRatio="xMidYMid meet" />
                    </g>

                    <foreignObject x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}">
                        <div xmlns="http://www.w3.org/1999/xhtml" class="mob-vhs-html" style="position: relative; width: 100%; height: 100%; transform: rotate(-90deg); transform-origin: center center;">
                            <div class="vhs-scanlines"></div>
                            <div class="vhs-tracking"></div>
                        </div>
                    </foreignObject>
                </g>
            `;
            panel.appendChild(imgSvg);
            panel.classList.add('has-thumb');

            // Kích hoạt chớp nháy Native SVG (5 giây)
            if (images.length > 1) { 
                const svgWrap = imgSvg.querySelector('.mob-vhs-wrap');
                const htmlWrap = imgSvg.querySelector('.mob-vhs-html');
                const allImages = imgSvg.querySelectorAll('image'); 
                setTimeout(() => {
                    setInterval(() => {
                        if(svgWrap) svgWrap.classList.add('is-glitching');
                        if(htmlWrap) htmlWrap.classList.add('is-glitching');
                        setTimeout(() => {
                            let nextIndex;
                            do { nextIndex = Math.floor(Math.random() * images.length); } while (nextIndex === currentIndex);
                            currentIndex = nextIndex;
                            allImages.forEach(img => img.setAttribute('href', images[currentIndex]));
                        }, 160); 
                        setTimeout(() => { 
                            if(svgWrap) svgWrap.classList.remove('is-glitching'); 
                            if(htmlWrap) htmlWrap.classList.remove('is-glitching'); 
                        }, 400); 
                    }, 5000); 
                }, index * 300); 
            }
        });
    }

    // ==========================================
    // KHỐI 3: ĐIỀU KHIỂN XOAY MÀN HÌNH (DESKTOP)
    // ==========================================
    const desktopSlides = document.querySelectorAll('.slide-desktop');
    let currentDesktopIndex = 0;

    desktopBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            if(this.classList.contains('active') || document.body.classList.contains('is-mobile-device')) return;

            desktopBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            desktopScene.classList.add('is-rotating');

            const angle = index * -120;
            currentDesktopIndex = index;

            setTimeout(() => {
                if(desktopCylinder) desktopCylinder.style.transform = `translateZ(-1200px) rotateY(${angle}deg)`;
                desktopSlides.forEach(slide => slide.classList.remove('active-slide'));
                if(desktopSlides[index]) desktopSlides[index].classList.add('active-slide');
            }, 150);

            updateTitle(this.querySelector('span').innerText);
            setTimeout(() => { desktopScene.classList.remove('is-rotating'); }, 950);
        });
    });

    // ==========================================
    // KHỐI 4: ĐIỀU KHIỂN XOAY MÀN HÌNH (MOBILE - VUỐT CHẠM LERP)
    // ==========================================
    const allMobileSlides = document.querySelectorAll('.slide-mobile');
    let currentMobileIndex = 1;
    let currentAngle = -40; 
    let targetAngle = -40;  
    let currentRadius = 1600; 
    let targetRadius = 1600;  
    let isMobileLoopRunning = false;

    function mobileUpdateLoop() {
        if (!document.body.classList.contains('is-mobile-device')) {
            isMobileLoopRunning = false; return; 
        }
        currentAngle += (targetAngle - currentAngle) * 0.12; 
        currentRadius += (targetRadius - currentRadius) * 0.12; 
        
        if(mobileCylinder) {
            mobileCylinder.style.transform = `translateZ(-${currentRadius}px) rotateY(${currentAngle}deg)`;
            mobileCylinder.style.setProperty('--current-radius', `${currentRadius}px`);
        }
        requestAnimationFrame(mobileUpdateLoop);
    }

    // Chạy loop khi xoay ngang/dọc
// --- XỬ LÝ LỖI KHI XOAY MÀN HÌNH (MOBILE <-> DESKTOP) ---
    window.addEventListener('resize', () => {
        let currentModeIsMobile = document.body.classList.contains('is-mobile-device');
        
        if (currentModeIsMobile) {
            // Đánh thức lại vòng lặp Mobile nếu nó đang ngủ
            if (typeof isMobileLoopRunning !== 'undefined' && !isMobileLoopRunning) {
                isMobileLoopRunning = true;
                if (typeof mobileUpdateLoop === 'function') mobileUpdateLoop();
            }
        } else {
            // Phục hồi lại góc xoay cho Desktop
            const desktopCylinder = document.getElementById('desktop-cylinder');
            if (desktopCylinder && typeof currentDesktopIndex !== 'undefined') {
                desktopCylinder.style.transform = `translateZ(-1200px) rotateY(${currentDesktopIndex * -120}deg)`;
            }
        }
    });
    // Gọi ngay lần đầu nếu khởi động bằng điện thoại
    if (document.body.classList.contains('is-mobile-device')) {
        allMobileSlides.forEach((slide, index) => { slide.style.setProperty('--slide-angle', `${index * 40}deg`); });
        isMobileLoopRunning = true;
        mobileUpdateLoop();
        rotateMobileTo(1);
    }

    function rotateMobileTo(index) {
        if (index < 0) index = 0;
        if (index > 8) index = 8;
        currentMobileIndex = index;
        targetAngle = index * -40;
        targetRadius = 1600; 

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

    let isDragging = false;
    let hasMoved = false;
    let startX = 0;
    let startAngle = -40;

    if(mobileScene) {
        mobileScene.addEventListener('touchstart', e => {
            if(!document.body.classList.contains('is-mobile-device')) return;
            const showcaseModal = document.getElementById('showcase-modal');
            if (showcaseModal && showcaseModal.classList.contains('active')) return;

            isDragging = true; hasMoved = false;
            startX = e.touches[0].clientX;
            startAngle = currentAngle; targetAngle = currentAngle; 
        }, {passive: true});

        mobileScene.addEventListener('touchmove', e => {
            if(!isDragging || !document.body.classList.contains('is-mobile-device')) return;
            const showcaseModal = document.getElementById('showcase-modal');
            if (showcaseModal && showcaseModal.classList.contains('active')) return;

            let deltaX = e.touches[0].clientX - startX;
            if (!hasMoved) {
                if (Math.abs(deltaX) > 10) {
                    hasMoved = true;
                    mobileScene.classList.add('is-dragging'); 
                    targetRadius = 1100; 
                } else return;
            }
            targetAngle = startAngle + (deltaX * 0.25); 
        }, {passive: true});

        const handleTouchEnd = (e) => {
            if(!isDragging || !document.body.classList.contains('is-mobile-device')) return;
            isDragging = false;
            if (!hasMoved) return; 

            mobileScene.classList.remove('is-dragging');
            targetRadius = 1600; 
            
            let deltaX = e.changedTouches[0].clientX - startX;
            let nearestIndex = Math.round(targetAngle / -40);

            if (deltaX < -40 && nearestIndex === currentMobileIndex) nearestIndex++;
            else if (deltaX > 40 && nearestIndex === currentMobileIndex) nearestIndex--;
            
            rotateMobileTo(nearestIndex); 
        };
        mobileScene.addEventListener('touchend', handleTouchEnd, {passive: true});
        mobileScene.addEventListener('touchcancel', handleTouchEnd, {passive: true});
    }

    // Nút điều khiển Mobile
    mobileBtns.forEach((btn, btnIndex) => {
        btn.addEventListener('click', function() {
            if(this.classList.contains('active') || !document.body.classList.contains('is-mobile-device')) return;
            let targetIndex = (btnIndex * 3) + 1; 
            rotateMobileTo(targetIndex);
        });
    });

    // Helper: Nháy chữ Text
    function updateTitle(newName) {
        if (titleText.innerText === newName) return;
        titleText.classList.add('title-glitch');
        titleText.style.opacity = ''; 
        setTimeout(() => {
            titleText.innerText = newName;
            titleText.classList.remove('title-glitch');
        }, 300);
    }

    // ==========================================
    // KHỐI 5: MODAL TRƯNG BÀY SẢN PHẨM & SLIDER
    // ==========================================
    function initShowcaseModal() {
        const showcaseModal = document.getElementById('showcase-modal');
        const closeShowcaseBtn = document.getElementById('close-showcase-btn');
        const sliderWrap = document.getElementById('showcase-slider');
        const sliderThumb = document.getElementById('slider-thumb');
        const showcaseGallery = document.getElementById('showcase-gallery');
        const galleryContent = document.getElementById('gallery-content');

        // Bắt click vào TOÀN BỘ Panel (Cả Desktop và Mobile)
        const allScreens = document.querySelectorAll('.dl-panel'); 
        allScreens.forEach(screen => {
            screen.addEventListener('click', () => {
                const targetId = screen.getAttribute('data-target');
                if (!targetId || !showcaseData[targetId]) return; 

                const data = showcaseData[targetId];

                // Bơm Text
                const titleEl = document.querySelector('.showcase-title');
                const footerEl = document.querySelector('.showcase-footer p');
                if(titleEl) titleEl.innerText = data.title;
                if(footerEl) footerEl.innerText = data.desc;

                // Bơm Ảnh
                galleryContent.innerHTML = ''; 
                data.images.forEach(src => {
                    const img = document.createElement('img');
                    img.src = src;
                    img.loading = 'lazy'; 
                    img.onerror = function() { this.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='; };
                    img.className = 'gallery-item';

                    // === THÊM DÒNG NÀY VÀO ===
                    // Cấm trình duyệt hiểu nhầm đây là hành động kéo ảnh ra Desktop
                    img.draggable = false; 

                    galleryContent.appendChild(img);
                });

                // Reset vị trí
                if (document.body.classList.contains('is-mobile-device')) {
                    showcaseGallery.scrollTop = 0; 
                } else {
                    scrollProgress = 0; 
                    if (sliderWrap) sliderWrap.style.setProperty('--progress', `0%`);
                    galleryContent.style.transform = `translateX(0px)`;
                }
                const scrollY = window.scrollY || document.documentElement.scrollTop;
                
                if (document.body.classList.contains('is-mobile-device')) {
                    // 1. NẾU LÀ ĐIỆN THOẠI (MOBILE)
                    // Chỉnh số ở đây (Ví dụ: - 50 để nhích lên cao một chút)
                    showcaseModal.style.top = `${scrollY + (window.innerHeight / 2) + 110}px`;
                    
                    document.body.style.overflow = 'hidden'; // Khóa nền chỉ trên mobile
                } else {
                    // 2. NẾU LÀ MÁY TÍNH (DESKTOP)
                    // Chỉnh số ở đây (Ví dụ: + 100 để hạ thấp xuống)
                    showcaseModal.style.top = `${scrollY + (window.innerHeight / 2) + 70}px`;
                }
                showcaseModal.classList.add('active');
            });
        });

        // ---------------------------------
        // LOGIC KÉO THẢ SLIDER (Chỉ chạy ở Desktop)
        // ---------------------------------
        // ---------------------------------
        // LOGIC KÉO THẢ SLIDER & GALLERY DRAG (Chỉ chạy ở Desktop)
        // ---------------------------------
        let scrollProgress = 0; 
        let isSliderDragging = false;

        function updateSlider(progress) {
            if(document.body.classList.contains('is-mobile-device')) return;
            scrollProgress = Math.max(0, Math.min(1, progress));
            sliderWrap.style.setProperty('--progress', `${scrollProgress * 100}%`);
            
            const maxScroll = galleryContent.scrollWidth - showcaseGallery.clientWidth;
            if(maxScroll > 0) {
                galleryContent.style.transform = `translateX(-${scrollProgress * maxScroll}px)`;
            }
        }
        window.resetShowcaseSlider = function() {
            if(document.body.classList.contains('is-mobile-device')) {
                showcaseGallery.scrollTop = 0;
            } else {
                updateSlider(0);
            }
        };
        // A. Kéo bằng thanh Slider nhỏ
        sliderThumb.addEventListener('mousedown', () => { isSliderDragging = true; document.body.style.userSelect = 'none'; });
        document.addEventListener('mousemove', (e) => {
            if (!isSliderDragging) return;
            const rect = sliderWrap.getBoundingClientRect();
            updateSlider((e.clientX - rect.left) / rect.width);
        });
        document.addEventListener('mouseup', () => { isSliderDragging = false; document.body.style.userSelect = ''; });

        sliderThumb.addEventListener('touchstart', () => { isSliderDragging = true; }, {passive: true});
        document.addEventListener('touchmove', (e) => {
            if (!isSliderDragging) return;
            const rect = sliderWrap.getBoundingClientRect();
            updateSlider((e.touches[0].clientX - rect.left) / rect.width);
        }, {passive: true});
        document.addEventListener('touchend', () => { isSliderDragging = false; });

        // ===============================================
        // B. KÉO TRỰC TIẾP TRÊN KHU VỰC HÌNH ẢNH (MỚI)
        // ===============================================
        let isGalleryDragging = false;
        let startX;
        let initialProgress;

        showcaseGallery.addEventListener('mousedown', (e) => {
            if(document.body.classList.contains('is-mobile-device')) return; // BẢO VỆ MOBILE
            isGalleryDragging = true;
            startX = e.pageX - showcaseGallery.offsetLeft;
            initialProgress = scrollProgress;
            galleryContent.style.transition = 'none'; // Tắt mượt để ảnh dính chặt chuột
        });

        showcaseGallery.addEventListener('mousemove', (e) => {
            if (!isGalleryDragging || document.body.classList.contains('is-mobile-device')) return; // BẢO VỆ MOBILE
            e.preventDefault();
            const x = e.pageX - showcaseGallery.offsetLeft;
            const walk = x - startX; 
            const maxScroll = galleryContent.scrollWidth - showcaseGallery.clientWidth;

            if (maxScroll > 0) {
                let progressDelta = -walk / maxScroll;
                updateSlider(initialProgress + progressDelta);
            }
        });

        const stopGalleryDrag = () => {
            if (!isGalleryDragging) return;
            isGalleryDragging = false;
            galleryContent.style.transition = 'transform 0.1s ease-out'; // Bật lại mượt
        };

        showcaseGallery.addEventListener('mouseup', stopGalleryDrag);
        showcaseGallery.addEventListener('mouseleave', stopGalleryDrag);

        // ===============================================
        // C. CUỘN CHUỘT VÀ BÀN PHÍM
        // ===============================================
        showcaseGallery.addEventListener('wheel', (e) => {
            if(document.body.classList.contains('is-mobile-device')) return; // BẢO VỆ MOBILE
            const maxScroll = galleryContent.scrollWidth - showcaseGallery.clientWidth;
            if(maxScroll > 0) {
                e.preventDefault(); 
                updateSlider(scrollProgress + (e.deltaY > 0 ? 0.05 : -0.05));
            }
        }, { passive: false });

        document.addEventListener('keydown', (e) => {
            if(document.body.classList.contains('is-mobile-device') || !showcaseModal.classList.contains('active')) return;
            const maxScroll = galleryContent.scrollWidth - showcaseGallery.clientWidth;
            if(maxScroll <= 0) return;

            if (e.key === 'ArrowRight') updateSlider(scrollProgress + 0.05);
            else if (e.key === 'ArrowLeft') updateSlider(scrollProgress - 0.05);
            else if (e.key === 'Escape') showcaseModal.classList.remove('active');
        });

        closeShowcaseBtn.addEventListener('click', () => { showcaseModal.classList.remove('active'); document.body.style.overflow = '';});
    }
    // ==========================================
    // KHỐI 6: KHỞI TẠO DEV PORTAL
    // ==========================================
    function initDevPortal() {
        const dpData = showcaseData['dev_labellab'];
        if (!dpData) return;

        // 1. Bơm Text Cơ Bản
        const titleEl = document.getElementById('dp-title-text');
        const subtitleEl = document.getElementById('dp-subtitle-text');
        const overviewEl = document.getElementById('dp-overview-text');
        if(titleEl) titleEl.innerText = dpData.title;
        if(subtitleEl) subtitleEl.innerText = dpData.subtitle;
        if(overviewEl) overviewEl.innerText = dpData.overview;

        // 2. Bơm Tech Tags
        const tagsList = document.getElementById('dp-tags-list');
        if (tagsList && dpData.tech_tags) {
            tagsList.innerHTML = '';
            dpData.tech_tags.forEach(tag => {
                let span = document.createElement('span');
                span.className = 'dp-tag';
                span.innerText = tag;
                tagsList.appendChild(span);
            });
        }

        // 3. Bơm Lists (Features & Advantages)
        const populateList = (elementId, dataArray) => {
            const listEl = document.getElementById(elementId);
            if (!listEl || !dataArray) return;
            listEl.innerHTML = '';
            dataArray.forEach(item => {
                let li = document.createElement('li');
                li.innerText = item;
                listEl.appendChild(li);
            });
        };
        populateList('dp-features-list', dpData.features);
        populateList('dp-advantages-list', dpData.advantages);

        // 4. Bơm Nút Bấm (Action Buttons)
        const btnsList = document.getElementById('dp-action-btns');
        if (btnsList && dpData.buttons) {
            btnsList.innerHTML = '';
            dpData.buttons.forEach(btn => {
                let a = document.createElement('a');
                a.href = btn.link;
                a.className = btn.type === 'disabled' ? 'dp-btn dp-btn-disabled' : 'dp-btn dp-btn-primary';
                a.innerText = btn.label;
                if(btn.type === 'disabled') a.addEventListener('click', e => e.preventDefault());
                else a.target = "_blank";
                btnsList.appendChild(a);
            });
        }

        // 5. Bơm Ảnh Thumbnail & Xử Lý Logic Click (Static/Gallery/Video)
        const mainThumb = document.getElementById('dp-main-thumb');
        const mediaTrigger = document.getElementById('dp-media-trigger');
        const overlay = document.querySelector('.dp-media-overlay');
        
        if (dpData.images && dpData.images.length > 0 && mainThumb) {
            mainThumb.src = dpData.images[0];
        }

        if (dpData.mediaType === 'static') {
            // Tắt chức năng click mở modal
            mediaTrigger.style.cursor = 'default';
            if (overlay) overlay.style.display = 'none';
        } else {
            // Kích hoạt click mở Showcase Modal (Tái sử dụng Panel của Design Lab)
            mediaTrigger.addEventListener('click', () => {
                const showcaseModal = document.getElementById('showcase-modal');
                const galleryContent = document.getElementById('gallery-content');
                const modalTitle = document.querySelector('.showcase-title');
                const modalFooter = document.querySelector('.showcase-footer p');
                const sliderWrap = document.getElementById('showcase-slider');

                if (modalTitle) modalTitle.innerText = dpData.title;
                if (modalFooter) modalFooter.innerText = dpData.subtitle;

                galleryContent.innerHTML = ''; 

                if (dpData.mediaType === 'video' && dpData.videoUrl) {
                    // Nếu là Video: Nhúng iframe YouTube
                    const iframe = document.createElement('iframe');
                    iframe.src = dpData.videoUrl;
                    iframe.className = 'gallery-item';
                    iframe.style.border = 'none';
                    iframe.allowFullscreen = true;
                    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                    galleryContent.appendChild(iframe);
                    if(sliderWrap) sliderWrap.style.display = 'none'; // Ẩn thanh kéo nếu là video
                } else {
                    // Nếu là Gallery: Render ảnh như bình thường
                    if(sliderWrap) sliderWrap.style.display = 'flex';
                    dpData.images.forEach(src => {
                        const img = document.createElement('img');
                        img.src = src; img.loading = 'lazy'; img.draggable = false; 
                        img.className = 'gallery-item';
                        galleryContent.appendChild(img);
                    });
                }

                // Reset vị trí slider
                if(window.resetShowcaseSlider) window.resetShowcaseSlider();
                const scrollY = window.scrollY || document.documentElement.scrollTop;
                
                if (document.body.classList.contains('is-mobile-device')) {
                    // 1. NẾU LÀ ĐIỆN THOẠI (MOBILE)
                    // Chỉnh số ở đây (Ví dụ: - 50 để nhích lên cao một chút)
                    showcaseModal.style.top = `${scrollY + (window.innerHeight / 2) + 110}px`;
                    
                    document.body.style.overflow = 'hidden'; // Khóa nền chỉ trên mobile
                } else {
                    // 2. NẾU LÀ MÁY TÍNH (DESKTOP)
                    // Chỉnh số ở đây (Ví dụ: + 100 để hạ thấp xuống)
                    showcaseModal.style.top = `${scrollY + (window.innerHeight / 2) + 70}px`;
                }
                showcaseModal.classList.add('active');
            });
        }
    }
});