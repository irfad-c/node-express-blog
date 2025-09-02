//DOMContentLoaded
//This code will wait until the whole HTML page is loaded before running the script.
//It will not wait for the css,images,video..loading

document.addEventListener("DOMContentLoaded", function () {
  const allButtons = document.querySelectorAll(".searchBtn");
  const searchBar = document.querySelector(".searchBar");
  const searchInput = document.getElementById("searchInput");
  const searchClose = document.getElementById("searchClose");

  for (var i = 0; i < allButtons.length; i++) {
    allButtons[i].addEventListener("click", function () {
      searchBar.style.visibility = "visible";
      //Here we will change our classname from .searchBar to .searchBar .open
      searchBar.classList.add("open");
      //this refers to the button that was clicked
      //Below style is for screen readers
      this.setAttribute("aria-expanded", "true");
      //The browser automatically put the cursor inside the search box.
      searchInput.focus();
    });
  }

  searchClose.addEventListener("click", function () {
    searchBar.style.visibility = "hidden";
    searchBar.classList.remove("open");
    this.setAttribute("aria-expanded", "false");
  });
});
