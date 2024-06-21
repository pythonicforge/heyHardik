// script.js

const tl = gsap.timeline({ paused: true, reversed: true });

const animateOpenNav = () => {
    tl.to('.nav-container', {
        autoAlpha: 1,
        duration: 0.5,
        ease: "power2.inOut",
        delay: 0.1,
    });

    tl.to('.site-logo', {
        color: "#fff",
        duration: 0.5,
        ease: "power2.inOut",
    }, "-=0.4");

    tl.from(".flex > div", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.inOut",
        stagger: {
            amount: 0.1
        }
    });

    tl.to(".nav-link > a", {
        top: 0,
        ease: "power2.inOut",
        duration: 1,
        stagger: {
            amount: 0.2
        }
    }, "-=0.6");

    tl.from(".nav-footer", {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
    }, "-=0.8");
};

const openNav = () => {
    animateOpenNav();
    const navBtn = document.getElementById("menu-toggle-btn");
    const navContainer = document.querySelector('.nav-container');

    navBtn.onclick = function () {
        navBtn.classList.toggle("active");
        if (tl.reversed()) {
            navContainer.style.visibility = "visible";
            tl.play();
        } else {
            tl.reverse().eventCallback("onReverseComplete", () => {
                navContainer.style.visibility = "hidden";
            });
        }
    };
};

openNav();
