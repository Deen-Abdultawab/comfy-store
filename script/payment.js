import "../script/cartToggle.js"
import "../script/navToggle.js"
import "../utils/setUpCart.js"


import { getElement, formatPrice } from "../utils/funtions.js";

let priceDOM = getElement('.formPrice');
let refDOM = getElement('.refNumber');
let randomValues = [1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'];
const cartItemDOM = getElement('.cart-items-container');
const cartItemCountDOM = getElement('.cart-item-count');
let cart = getStorageItem('cart');

setRefNumber()
setTotalPrice();
setUpCartFunctionality();

const paymentForm = document.getElementById('paymentForm');
paymentForm.addEventListener("submit", payWithPaystack, false);
function payWithPaystack(e) {
  e.preventDefault();
  

  let handler = PaystackPop.setup({
    key: 'pk_test_9453e2604d7a95be11914db27682fea76cbeda02', // Replace with your public key
    email: document.getElementById("email-address").value,
    amount: document.getElementById("amount").value * 100,
    ref: document.getElementById("refno").value,
    
    // ''+Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
    // label: "Optional string that replaces customer email"
    onClose: function(){
      alert('Window closed.');
    },
    callback: function(response){
      let message = 'Payment complete! Reference: ' + response.reference;
      alert(message);
    }
  });

  handler.openIframe();
}

function getRandom(items){
    return Math.floor(Math.random() * items.length)
}


function setTotalPrice(){
    let total = cart.reduce((total, cartItem)=>{
        return (total += cartItem.price * cartItem.amount);
    }, 0);
    
    priceDOM.value = total;
    priceDOM.textContent = formatPrice(total);
    return total;
}

function setRefNumber(){
    let refNumber = randomValues[getRandom(randomValues)];
    for(let i = 0; i < 6; i++){
        refNumber += randomValues[getRandom(randomValues)];
    }
    
    refDOM.value = refNumber;
    refDOM.textContent = refNumber;

}

const cartTotalCostDom = getElement('.cart-total');



// functions: keeps throwing bugs when i exported setTotalPrice to function.js so i instead copied all necessary functions here. similar problem was faced in product.js and i dont like this as it only increases mu code size and makes it looks less DRY and clean. Siolutions will be greatly appreciated.


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
    
    setTotalPrice();
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
        setTotalPrice();
        setTotalPrice();
        setStorageItem('cart', cart);
    }) 
} 


export {setTotalPrice}