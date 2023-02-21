function getElement(selection){
    const element = document.querySelector(selection);
    if(element){
        return element
    } else {
        throw new Error(`Please check ${selection} selector, no such element exist`)
    }
}

const cartTogggle = getElement('.cart-toggle');
const navToggle = getElement('.nav-toggle');
const mobileMenu = getElement('.mobile-menu-overlay');
const cartMenu = getElement('.cart-overlay');
const closeCartBtn = getElement('.close-cart-btn');
const closeMobileMenuBtn = getElement('.mobile-menu-close');

cartTogggle.addEventListener('click', ()=>{
    cartMenu.classList.add('show');
});

closeCartBtn.addEventListener('click', ()=>{
    cartMenu.classList.remove('show');
})

navToggle.addEventListener('click', ()=>{
    mobileMenu.classList.add('show');
})

closeMobileMenuBtn.addEventListener('click', ()=>{
    mobileMenu.classList.remove('show');
})