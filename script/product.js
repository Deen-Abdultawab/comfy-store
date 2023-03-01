import "../script/cartToggle.js"
import "../script/navToggle.js"
import "../utils/setUpCart.js"

import {getElement, singleProductUrl, formatPrice} from "../utils/funtions.js"
import { openCart } from "../script/cartToggle.js"

const singleProductDOM = getElement('.single-product-container') ;
const pageHeader = getElement('.page-header');
const cartItemDOM = getElement('.cart-items-container');
const imgSrc = getElement('.single-product-img');
const title = getElement('.title')
const productCompany = getElement('.product-company');
const productPrice = getElement('.product-price');
const productColorContainer = getElement('.product-color-container');
const productDesc = getElement('.product-desc');
const addToCartBtn = getElement('.addToCartBtn');
const cartItemCountDOM = getElement('.cart-item-count');
const cartTotalCostDom = getElement('.cart-total');


let targetID;
let cart = getStorageItem('cart');
let store = getStorageItem('store');






async function init (){
    const params = new URLSearchParams(window.location.search);
    const singleID = params.get('id');

    try {
        const response = await fetch(`${singleProductUrl}?id=${singleID}`);
        if(response.status >=200 && response.status <= 299){
            const data = await response.json();

            const {id, fields:{name, company, price, colors, description:desc, image},} = data;
            targetID = id;

            const imageSrc = image[0].thumbnails.large.url;

            document.title = `Comfy Store || ${name.toUpperCase()}`
            pageHeader.innerHTML = `<h1>Home / ${name}</h1>`;
            
            const productColors = colors.map((color)=> {
                return `
                <span class="product-color" style="background-color: ${color};">
                </span>`
        
         }).join(' ');

        imgSrc.src = imageSrc;
        title.textContent = name;
        productCompany.textContent = company;
        productPrice.textContent = formatPrice(price);
        productColorContainer.innerHTML = `${productColors}`;
        productDesc.textContent = desc;
            
            
        } else {
            console.log(response.status, response.statusText);
            singleProductDOM.innerHTML = `
            <div class=" error">
                <h3>Sorry something went wrong.....</h3>
            </div>
            <a href="index.html" class="btn">Back</a>
            `
        }
    } catch (error) {
        singleProductDOM.innerHTML = `
            <div class=" losding">
                <h3>Sorry,there was an error.....</h3>
            </div>
            <a href="index.html" class="btn">Back</a>
            `
    }
    
    setUpCartFunctionality();
}

window.addEventListener('DOMContentLoaded', init);




addToCartBtn.addEventListener('click', ()=>{
    let item = cart.find((cartItem)=> cartItem.id === targetID);

    if(!item){
        let product = store.find((storeItem)=> storeItem.id === targetID);
        product = {...product, amount: 1};
        console.log(product);
        cart = [...cart, product];
        addCartDom(product)
        
    } else {
        const amount = increaseAmount(targetID);
        const items = [...cartItemDOM.querySelectorAll('.item-quantity')];
        const newAmount = items.find((value) => value.dataset.id === targetID);
        console.log(newAmount);
        newAmount.textContent = amount;
    }
    displayCartItemCount();
    displayCartTotalCost()
    setStorageItem('cart', cart);
    openCart();
})

function increaseAmount(sourceID) {
    let newAmount;
    cart = cart.map((cartItem) => {
        if (cartItem.id === sourceID) {
        newAmount = cartItem.amount + 1;
        cartItem = { ...cartItem, amount: newAmount };
        }
        return cartItem;
    });
    return newAmount;
}

function decreaseAmount(sourceID) {
    let newAmount;
    cart = cart.map((cartItem) => {
      if (cartItem.id === sourceID) {
        newAmount = cartItem.amount - 1;
        cartItem = { ...cartItem, amount: newAmount };
      }
      return cartItem;
    });
    return newAmount;
}

function addCartDom({ id, name, price, imageSrc, amount }){    
    const article = document.createElement('div');
    article.classList.add('cart-items');
    article.setAttribute('data-id', id);

    article.innerHTML = `
    <div class="col-1">
        <img src="${imageSrc}" class="cart-item-img" alt="${name}">
    </div>
    <div class="col-2">
        <div cart-info>
            <h4 class="title">${name}</h4>
            <p class="price">${formatPrice(price)}</p>

            <button class="remove-btn" data-id="${id}">
                remove
            </button>
        </div>
        <div class="ctrl-btns" >
            <button class="increase-btn" data-id="${id}">
                <i class="fas fa-chevron-up"></i>
            </button>
            <span class="item-quantity" data-id="${id}">${amount}</span>
            <button class="decrease-btn" data-id="${id}">
                <i class="fas fa-chevron-down"></i>
            </button>
        </div>
    </div>
    `;

    cartItemDOM.appendChild(article);
    console.log(article)
}

function setStorageItem(name, item) {
    localStorage.setItem(name, JSON.stringify(item))
}

function getStorageItem (item) {
    let storageItem = localStorage.getItem(item)
    if (storageItem) {
      storageItem = JSON.parse(localStorage.getItem(item))
    } else {
      storageItem = []
    }
    return storageItem
}

function displayCartItemCount(){
    let amount = cart.reduce((total, cartItem)=>{
        return (total += cartItem.amount)
    }, 0);

    cartItemCountDOM.textContent = amount;
}

function displayCartTotalCost(){
    let total = cart.reduce((total, cartItem)=>{
        return (total += cartItem.price * cartItem.amount);
    }, 0);
    

    cartTotalCostDom.textContent = `Total : ${formatPrice(total)} `;
}

function removeItem(id){
    cart = cart.filter((cartItem)=> cartItem.id !== id);
}

function setUpCartFunctionality(){
    cartItemDOM.addEventListener('click', (e)=>{
        let targetItem = e.target;
        let targetID = targetItem.dataset.id;
        let targetParent = targetItem.parentElement;
        let parentID = targetParent.dataset.id;

        if(targetItem.classList.contains('remove-btn')){
            removeItem(targetID);
            targetParent.parentElement.parentElement.remove();
        };

        if(targetParent.classList.contains('increase-btn')){
            const newAmount = increaseAmount(parentID);
            
            targetParent.nextElementSibling.textContent = newAmount;
        }

        if(targetParent.classList.contains('decrease-btn')){
            const newAmount = decreaseAmount(parentID);
            if(newAmount === 0){
                removeItem(parentID);
                targetParent.parentElement.parentElement.parentElement.remove();

            } else {
                targetParent.previousElementSibling.textContent = newAmount;
            }
        }
        displayCartItemCount();
        displayCartTotalCost();
        setStorageItem('cart', cart);
    }) 
} 



