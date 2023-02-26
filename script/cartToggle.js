import { getElement } from "../utils/funtions.js";

const cartMenu = getElement('.cart-overlay');
const closeCartBtn = getElement('.close-cart-btn');
const cartTogggle = getElement('.cart-toggle');

cartTogggle.addEventListener('click', ()=>{
    cartMenu.classList.add('show');
});

closeCartBtn.addEventListener('click', ()=>{
    cartMenu.classList.remove('show');
})

export function openCart (){
    cartMenu.classList.add('show');
}