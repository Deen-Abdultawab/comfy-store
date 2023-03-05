import "../script/cartToggle.js"
import "../script/navToggle.js"
import "../utils/setUpCart.js"

import { getElement, formatPrice, cart } from "../utils/funtions.js";

let priceDOM = getElement('.formPrice');
let refDOM = getElement('.refNumber');
let randomValues = [1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'];

setRefNumber()
setTotalPrice();

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


export {setTotalPrice}