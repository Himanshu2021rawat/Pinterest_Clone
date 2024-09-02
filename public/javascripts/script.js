const scroll = new LocomotiveScroll({
  el: document.querySelector(".main"),
  smooth: true,
});

document.addEventListener("DOMContentLoaded", () => {
  const imagecards = document.querySelectorAll(".imagecard");

  imagecards.forEach((imagecard, index) => {
    gsap.fromTo(
      imagecard,
      { opacity: 0, y: 0 },
      { opacity: 1, y: -280, duration: 2, delay: index * 0.5 }
    );
  });
});

gsap.to(".circle", {
  opacity: 0.4,
  y: -30,
  duration: 1,
  ease: "power1.inOut",
  yoyo: true,
  repeat: -1,
});

let eyeOpen = document.querySelector(".eyeopen");
let eyeClose = document.querySelector(".eyeclose");
let passwordInput = document.querySelector("[name='password']");

eyeOpen.addEventListener("click", function () {
  passwordInput.type = "text"; // Show password
  eyeOpen.style.display = "none"; // Hide open eye icon
  eyeClose.style.display = "block"; // Show close eye icon
});

eyeClose.addEventListener("click", function () {
  passwordInput.type = "password"; // Hide password
  eyeOpen.style.display = "block"; // Show open eye icon
  eyeClose.style.display = "none"; // Hide close eye icon
});
