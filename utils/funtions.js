
import { openCart } from "../script/cartToggle.js";

const allProductsUrl = 'https://course-api.com/javascript-store-products'

// 'https://course-api.com/javascript-store-single-product?id=rec43w3ipXvP28vog'

const singleProductUrl =
'https://course-api.com/javascript-store-single-product'

let store = getStorageItem('store');
let cart = getStorageItem('cart');
const cartItemDOM = getElement('.cart-items-container');
const cartItemCountDOM = getElement('.cart-item-count');
const cartTotalCostDom = getElement('.cart-total');

  function getElement(selection){
    const element = document.querySelector(selection);
    if(element){
        return element
    } else {
        throw new Error(`Please check ${selection} selector, no such element exist`)
    }
}

async function fetchData(source, displayDom){
    displayDom.innerHTML = `
    <div class="section-loading">
        <h3>Loading.....</h3>
    </div>`
    try {
        const response = await fetch(source);
        if(response.status >=200 && response.status <= 299){
            const data = await response.json();
            return data;
            
        } else {
            displayDom.innerHTML = `
            <div class=" error">
                <h3>Sorry something went wrong.....</h3>
            </div>
            <a href="index.html" class="btn">Back</a>
            `
        }
        
    } catch (error) {
        displayDom.innerHTML = `
            <div class="section-loading">
                <h3>Sorry, There was an error.....</h3>
            </div>
            `
    }
}

function setUpStore(products){
    store = products.map((product)=> {
        const {id, fields:{featured, company, name, price, image:img},} = product;
        const imageSrc = img[0].thumbnails.large.url;

        return {
            id, 
            featured, 
            company, 
            name, 
            price, 
            imageSrc
        }
    });

    setStorageItem('store', store);
}


function formatPrice(price) {
    let formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format((price / 100).toFixed(2))
    return formattedPrice
}


  function displayHTML(products, element, filter){
    const productHTML = products.map((product) => {

        const {id, name, price, imageSrc} = product;
        
        return `
        <article class="single-product">
        <div class="top">
            <img src="${imageSrc}" alt="${name}" class="product-img">
            <div class="product-icons">
                <a href="product.html?id=${id}" class="product-icon">
                    <i class="fas fa-search"></i>
                </a>
                <button class="product-cart-btn product-icon" data-id="${id}">
                    <i class="fas fa-shopping-cart"></i>
                </button>
            </div>
        </div>
        
        <div class="footer">
            <h3 class="product-name">${name}</h3>
            <p class="product-price">${formatPrice(price)}</p>
        </div>
    </article>
        `
    }).join('');

    if(!filter){
        element.addEventListener('click', addToCart)
    }

    
    return productHTML;
}

function addToCart(e){
        const parent = e.target.parentElement;
        if(parent.classList.contains('product-cart-btn') || e.target.classList.contains('product-cart-btn')){
            const targetID = parent.dataset.id || e.target.dataset.id;

            let item = cart.find((cartItem)=> cartItem.id === targetID);

            if(!item){
                let product = store.find((storeItem)=> storeItem.id === targetID);
                product = { ...product, amount: 1};
                cart = [...cart, product]
                addCartDom(product);
                
            } else{
                const amount = increaseAmount(targetID);
                const items = [...cartItemDOM.querySelectorAll('.item-quantity')];
                console.log(amount, items)
                const newAmount = items.find((value) => value.dataset.id === targetID);
                newAmount.textContent = amount;
            }
            displayCartItemCount();
            displayCartTotalCost()
            setStorageItem('cart', cart);
            openCart();
        }
    
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

function removeItem(id){
    cart = cart.filter((cartItem)=> cartItem.id !== id);
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

function increaseAmount(id) {
    let newAmount;
    cart = cart.map((cartItem) => {
        if (cartItem.id === id) {
        newAmount = cartItem.amount + 1;
        cartItem = { ...cartItem, amount: newAmount };
        }
        return cartItem;
    });
    return newAmount;
}

function decreaseAmount(id) {
    let newAmount;
    cart = cart.map((cartItem) => {
      if (cartItem.id === id) {
        newAmount = cartItem.amount - 1;
        cartItem = { ...cartItem, amount: newAmount };
      }
      return cartItem;
    });
    return newAmount;
}

function displayCartItemsDOM() {
    cart.forEach((cartItem) => {
      addCartDom(cartItem);
    });
}

export {getElement, fetchData, allProductsUrl, singleProductUrl, setUpStore, formatPrice, store, displayHTML, addToCart ,displayCartItemCount, displayCartTotalCost, displayCartItemsDOM, cart, setUpCartFunctionality}