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