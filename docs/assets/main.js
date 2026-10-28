"use strict";

const printButton = document.getElementById("print-resume");

if (printButton && typeof window.print === "function") {
  printButton.addEventListener("click", () => window.print());
  printButton.hidden = false;
}