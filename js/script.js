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

    const techBtns = document.querySelectorAll('.tech-btn');
    const designLabNavBtn = document.querySelector('.nav-btn[href="#design-lab"]');
    techBtns.forEach((btn, index) => {
        // Chỉ xử lý 3 nút đầu tiên: Photoshop (0), Illustrator (1), Blender (2)
        if (index <= 2) { 
            btn.addEventListener('click', function(e) {
                e.preventDefault(); // Chặn hành vi nhảy trang mặc định của thẻ <a>

                // Bước 1: Chuyển trang sang Design Lab
                if (designLabNavBtn) designLabNavBtn.click();

                // Bước 2: Đợi 50ms để trang Design Lab hiển thị lên, sau đó xoay màn hình 3D
                setTimeout(() => {
                    if (document.body.classList.contains('is-mobile-device')) {
                        // Nếu là Mobile: Kích hoạt nút dưới đáy. 
                        // (Hàm này đã được lập trình sẵn công thức nhảy tới thẻ số 2 của group!)
                        if (mobileBtns[index]) mobileBtns[index].click();
                    } else {
                        // Nếu là Desktop: Kích hoạt nút ở thanh bên trái.
                        if (desktopBtns[index]) desktopBtns[index].click();
                    }
                }, 50);
            });
        }
    });
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

        currentAngle += (targetAngle - currentAngle) * 0.12; 
        currentRadius += (targetRadius - currentRadius) * 0.12; 
        
        // 1. Xoay Camera
        cylinder.style.transform = `translateZ(-${currentRadius}px) rotateY(${currentAngle}deg)`;

        // 2. BÍ QUYẾT TỐI ƯU: Chỉ cập nhật 1 biến CSS duy nhất vào khối trụ cha. 
        // Trình duyệt sẽ dùng C++ tự động giãn 9 tấm thẻ con bên trong mà JS không cần đụng tới nữa!
        cylinder.style.setProperty('--current-radius', `${currentRadius}px`);

        requestAnimationFrame(mobileUpdateLoop);
    }

    function setupMobileCylinder() {
        if (document.body.classList.contains('is-mobile-device')) {
            // Thay vì ép transform từng frame, ta chỉ "cắm cọc" góc xoay 1 lần duy nhất lúc khởi tạo
            allMobileSlides.forEach((slide, index) => {
                slide.style.setProperty('--slide-angle', `${index * 40}deg`);
            });
            
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
        
        // === KHÓA TƯƠNG TÁC: Nếu Panel đang mở thì cấm vuốt màn hình ===
        const showcaseModal = document.getElementById('showcase-modal');
        if (showcaseModal && showcaseModal.classList.contains('active')) return;

        isDragging = true;
        hasMoved = false;
        startX = e.touches[0].clientX;
        
        startAngle = currentAngle;
        targetAngle = currentAngle; 
    }, {passive: true});

    scene.addEventListener('touchmove', e => {
        if(!isDragging || !document.body.classList.contains('is-mobile-device')) return;
        
        // === KHÓA TƯƠNG TÁC: Nếu Panel đang mở thì cấm vuốt màn hình ===
        const showcaseModal = document.getElementById('showcase-modal');
        if (showcaseModal && showcaseModal.classList.contains('active')) return;

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
    // =========================================
    // LOGIC THANH TRƯỢT (SLIDER) SHOWCASE
    // =========================================
    const sliderWrap = document.getElementById('showcase-slider');
    const sliderThumb = document.getElementById('slider-thumb');
    const showcaseGallery = document.getElementById('showcase-gallery');
    const galleryContent = document.getElementById('gallery-content');

    if(sliderWrap && sliderThumb && showcaseGallery && galleryContent) {
        
        // --- 1. TẠO 30 Ô VUÔNG DATA GIẢ ĐỂ TEST ---
        galleryContent.innerHTML = ''; // Xóa sạch ruột
        for (let i = 1; i <= 30; i++) {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerText = i; // Đánh số từ 1 đến 30 để bạn dễ nhìn quá trình trượt
            galleryContent.appendChild(item);
        }

        // --- 2. HỆ THỐNG TÍNH TOÁN TRƯỢT ---
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

        // --- 3. KÉO THẢ BẰNG CHUỘT ---
        sliderThumb.addEventListener('mousedown', () => {
            isSliderDragging = true;
            document.body.style.userSelect = 'none'; 
        });

        document.addEventListener('mousemove', (e) => {
            if (!isSliderDragging) return;
            const rect = sliderWrap.getBoundingClientRect();
            let x = e.clientX - rect.left;
            updateSlider(x / rect.width);
        });

        document.addEventListener('mouseup', () => {
            isSliderDragging = false;
            document.body.style.userSelect = '';
        });

        // Hỗ trợ Touch Mobile
        sliderThumb.addEventListener('touchstart', () => { isSliderDragging = true; }, {passive: true});
        document.addEventListener('touchmove', (e) => {
            if (!isSliderDragging) return;
            const rect = sliderWrap.getBoundingClientRect();
            let x = e.touches[0].clientX - rect.left;
            updateSlider(x / rect.width);
        }, {passive: true});
        document.addEventListener('touchend', () => { isSliderDragging = false; });

        // --- 4. LĂN CHUỘT TRÊN MÀN HÌNH ---
        showcaseGallery.addEventListener('wheel', (e) => {
            if(document.body.classList.contains('is-mobile-device')) return;
            const maxScroll = galleryContent.scrollWidth - showcaseGallery.clientWidth;
            if(maxScroll > 0) {
                e.preventDefault(); 
                let delta = e.deltaY > 0 ? 0.05 : -0.05; 
                updateSlider(scrollProgress + delta);
            }
        }, { passive: false });

        // --- 5. ĐIỀU HƯỚNG BẰNG PHÍM MŨI TÊN (MỚI) ---
        document.addEventListener('keydown', (e) => {
            if(document.body.classList.contains('is-mobile-device')) return;
            // Chỉ kích hoạt phím mũi tên khi cái Panel này đang được bật sáng
            const showcaseModal = document.getElementById('showcase-modal');
            if (!showcaseModal.classList.contains('active')) return;

            const maxScroll = galleryContent.scrollWidth - showcaseGallery.clientWidth;
            if(maxScroll <= 0) return;

            // Mỗi lần bấm mũi tên sẽ trượt khoảng 5% thanh slider (Bạn có thể tăng/giảm số 0.05 này)
            if (e.key === 'ArrowRight') {
                updateSlider(scrollProgress + 0.05);
            } else if (e.key === 'ArrowLeft') {
                updateSlider(scrollProgress - 0.05);
            }
        });
    }
// =========================================
    // ĐIỀU KHIỂN BẬT/TẮT SHOWCASE PANEL & DATA
    // =========================================
    const showcaseModal = document.getElementById('showcase-modal');
    const closeShowcaseBtn = document.getElementById('close-showcase-btn');
    const allScreens = document.querySelectorAll('.dl-panel'); 

    if(showcaseModal && closeShowcaseBtn) {
        
        // 1. TẠO KHO TRỐNG VÀ TẢI DỮ LIỆU TỪ FILE JSON
        let showcaseData = {};
        
        fetch('data/showcase.json')
            .then(response => response.json())
            .then(data => {
                showcaseData = data; 
                
                // === A. VÒNG LẶP ĐỔ ẢNH LÊN MÀN HÌNH 3D ===
                allScreens.forEach((panel, index) => {
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
                    
                    let clipPathD = isSide 
                        ? 'M117.1,38.7L464.6,98c17.5,3,30.3,18.1,30.3,35.9v431.6c0,17.7-12.8,32.9-30.3,35.9l-347.5,59.1c-22.2,3.8-42.5-13.3-42.5-35.8V74.6C74.6,52.1,94.9,34.9,117.1,38.7z'
                        : 'M1368.6,556.1c-74.2-4-150.5-6.9-226.8-8.7l-8.7-8.3H793.7l-8.7,8.3c-76.3,1.8-152.6,4.7-226.8,8.7c-4.9-0.7-9.6-2.6-13.6-5.5c-8.2-5.9-13.1-15.4-13.1-25.5V438l12.2-13.9V213.5l-12.2-13.9v-87.1c0-9.1,3.9-17.7,10.8-23.7c4.7-4,10.3-6.6,16.4-7.4c74.2,4,150.7,6.9,227.3,8.7l10,7.8l1.4,1.1H849c37.7,0.5,76.2,0.7,114.5,0.7s76.8-0.2,114.5-0.7h51.5l2.3-1.8l9-7.1c76.7-1.8,153.1-4.7,227.3-8.7c6.1,0.8,11.7,3.4,16.4,7.4c6.9,6,10.8,14.6,10.8,23.7v88.4l-11.1,12.7v210.6l11.1,12.7v88.4c0,10.1-4.9,19.6-13.1,25.5C1378.2,553.5,1373.5,555.4,1368.6,556.1z';

                    const clipId = `clip-thumb-${targetId}-${index}`;

                    // Dọn dẹp tàn dư cũ
                    const oldLayer = panel.querySelector('.panel-img-layer');
                    if(oldLayer) oldLayer.remove();
                    const oldMobLayer = panel.querySelector('.mobile-img-layer');
                    if(oldMobLayer) oldMobLayer.remove();

                    // ==========================================
                    // 1. PHÂN LUỒNG MOBILE (DÙNG NATIVE SVG CHỐNG MỜ 100%)
                    // ==========================================
                    const isMobilePanel = panel.closest('.slide-mobile-only');
                    if (isMobilePanel) {
                        const imgSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        imgSvg.setAttribute('viewBox', viewBox);
                        imgSvg.classList.add('mobile-img-layer');
                        imgSvg.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 5; pointer-events: none;';

                        // Tự động tính tâm xoay chuẩn xác của khung SVG
                        let cx = parseFloat(vb[0]) + parseFloat(vb[2]) / 2;
                        let cy = parseFloat(vb[1]) + parseFloat(vb[3]) / 2;

                        imgSvg.innerHTML = `
                            <defs><clipPath id="${clipId}"><path d="${clipPathD}" /></clipPath></defs>
                            <g clip-path="url(#${clipId})">
                                <path fill="#001532" d="${clipPathD}" />

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
                        panel.style.setProperty('--screen-bg', 'transparent');
                        panel.classList.add('has-thumb');

                        if (images.length > 1) { 
                            const svgWrap = imgSvg.querySelector('.mob-vhs-wrap');
                            const htmlWrap = imgSvg.querySelector('.mob-vhs-html');
                            const allImages = imgSvg.querySelectorAll('image'); 
                            setTimeout(() => {
                                setInterval(() => {
                                    // Kích hoạt chớp nháy
                                    if(svgWrap) svgWrap.classList.add('is-glitching');
                                    if(htmlWrap) htmlWrap.classList.add('is-glitching');
                                    setTimeout(() => {
                                        // Đổi ảnh SVG
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
                        return; // Ngắt luồng Mobile
                    }

                    // ==========================================
                    // 2. PHÂN LUỒNG DESKTOP
                    // ==========================================
                    const imgSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    imgSvg.setAttribute('viewBox', viewBox);
                    imgSvg.classList.add('panel-img-layer');
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
                    panel.style.setProperty('--screen-bg', 'transparent');
                    panel.classList.add('has-thumb');

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

                // === B. KHỞI TẠO CLICK MỞ BẢNG SHOWCASE (Sẽ hoạt động khi có data) ===
                allScreens.forEach(screen => {
                    screen.addEventListener('click', () => {
                        const targetId = screen.getAttribute('data-target');
                        if (!targetId || !showcaseData[targetId]) return; 

                        const data = showcaseData[targetId];

                        const titleEl = document.querySelector('.showcase-title');
                        const footerEl = document.querySelector('.showcase-footer p');
                        if(titleEl) titleEl.innerText = data.title;
                        if(footerEl) footerEl.innerText = data.desc;

                        galleryContent.innerHTML = ''; 
                        data.images.forEach(src => {
                            const img = document.createElement('img');
                            img.src = src;
                            img.loading = 'lazy'; 
                            img.onerror = function() { this.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='; };
                            img.className = 'gallery-item';
                            galleryContent.appendChild(img);
                        });

                        if (document.body.classList.contains('is-mobile-device')) {
                            showcaseGallery.scrollTop = 0; 
                        } else {
                            scrollProgress = 0; 
                            if (sliderWrap) sliderWrap.style.setProperty('--progress', `0%`);
                            galleryContent.style.transform = `translateX(0px)`;
                        }

                        showcaseModal.classList.add('active');
                    });
                });
            })
            .catch(error => {
                console.error("Lỗi khi tải Database JSON:", error);
            });
        // 2. MỞ PANEL & ĐỔ DỮ LIỆU KHI CLICK
        allScreens.forEach(screen => {
            screen.addEventListener('click', () => {
                const targetId = screen.getAttribute('data-target');
                
                // Nếu chưa load xong data hoặc chưa cấu hình ID thì bỏ qua
                if (!targetId || !showcaseData[targetId]) return; 

                const data = showcaseData[targetId];

                // A. Đổ Text vào Title và Footer
                const titleEl = document.querySelector('.showcase-title');
                const footerEl = document.querySelector('.showcase-footer p');
                if(titleEl) titleEl.innerText = data.title;
                if(footerEl) footerEl.innerText = data.desc;

                // B. Dọn dẹp Slider cũ và bơm Ảnh mới vào (Kèm tính năng Lazy Load)
                galleryContent.innerHTML = ''; 
                data.images.forEach(src => {
                    const img = document.createElement('img');
                    img.src = src;
                    img.loading = 'lazy'; // Kích hoạt tải lười cho nhẹ web
                    img.onerror = function() { this.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='; };
                    img.className = 'gallery-item';
                    galleryContent.appendChild(img);
                });

                // C. Reset vị trí cuộn về mức 0 
                if (document.body.classList.contains('is-mobile-device')) {
                    showcaseGallery.scrollTop = 0; 
                } else {
                    scrollProgress = 0; 
                    if (sliderWrap) sliderWrap.style.setProperty('--progress', `0%`);
                    galleryContent.style.transform = `translateX(0px)`;
                }

                // D. Bật Panel lên
                showcaseModal.classList.add('active');
            });
        });

        // 3. TẮT PANEL KHI BẤM NÚT "X"
        closeShowcaseBtn.addEventListener('click', () => {
            showcaseModal.classList.remove('active');
        });

        // 4. TẮT PANEL KHI ẤN PHÍM "ESC"
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && showcaseModal.classList.contains('active')) {
                showcaseModal.classList.remove('active');
            }
        });
    }
});