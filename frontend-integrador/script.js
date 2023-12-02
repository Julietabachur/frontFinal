document.addEventListener("DOMContentLoaded", function () {
    const whatsappFloat = document.getElementById("whatsappFloat");
    const footer = document.getElementById("footer");
  
    window.addEventListener("scroll", function () {
      const scrollY = window.scrollY;
      const footerOffset = footer.offsetTop;
  
      if (scrollY > footerOffset) {
        whatsappFloat.classList.add("fixed");
      } else {
        whatsappFloat.classList.remove("fixed");
      }
    });
  });
  