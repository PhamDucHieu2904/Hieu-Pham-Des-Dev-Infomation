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
        
        // Trình duyệt sẽ tự động chạy ngầm đi lấy file JSON về ngay khi load trang
        fetch('data/showcase.json')
            .then(response => response.json())
            .then(data => {
                showcaseData = data; // Nạp dữ liệu vào kho
                console.log("Database Loaded:", showcaseData);
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