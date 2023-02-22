import { getElement } from "../utils/funtions.js";

const navToggle = getElement('.nav-toggle');
const mobileMenu = getElement('.mobile-menu-overlay');

const closeMobileMenuBtn = getElement('.mobile-menu-close');

navToggle.addEventListener('click', ()=>{
    mobileMenu.classList.add('show');
})

closeMobileMenuBtn.addEventListener('click', ()=>{
    mobileMenu.classList.remove('show');
})