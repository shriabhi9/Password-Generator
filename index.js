const InputSlider = document.querySelector("#slider-counter");
const LengthDisplay = document.querySelector("#data-lengthNum");
const PasswordDisplay = document.querySelector("#pswrd-box");
const copyBtn = document.querySelector("#cpy-btn");
const copyMsg = document.querySelector("#cpy-msg");
const Indicator = document.querySelector("#strength");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const generateBtn = document.querySelector("#generate-btn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

let password = "";
let passwordLength = 10;
let checkCount = 0;
let symbols = "!@#$%^&*()_-+=<>?";

// password ki length ko set kr deta hai
function handelSlider() {
    InputSlider.value = passwordLength;
    LengthDisplay.innerText = passwordLength;
}

function getRandInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function setIndicator(color){
    Indicator.style.background = color;
}

// random number btw 0,9
function generateRandomNumber() {
    return getRandInt(0, 9);
}
// random lower case btw a to z
function generatelowerCase() {
    return String.fromCharCode(getRandInt(97, 123));
}
// random upper case btw A to Z
function generateUpperCase() {
    return String.fromCharCode(getRandInt(65, 91));
}

// function that will generate random num between 0 to len of symbol and on
// the basis of that num [index] we will take random symbol from the string

function generateRandomSymbol() {
    const rndNum = getRandInt(0, symbols.length);
    return symbols.charAt(rndNum);
}

//handel check box change
function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        } 
    });

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handelSlider();
    }

}
// // copy clipboard
async function copyContent() {
    try {
        await navigator.clipboard.writeText(PasswordDisplay.value);
        copyMsg.innerHTML = "Copied";
    } 
    catch (e) {
        alert("Failed!");
    }
    
    // to make copy wala span visible
    copyMsg.classList.add("active");
    
    setTimeout(()=>{
        copyMsg.classList.add("opacity-0");
        copyMsg.classList.remove("active");
    },2000);
}

InputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handelSlider();
});

copyBtn.addEventListener('click',()=>{
    if(PasswordDisplay.value) copyContent();
})

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

//suffel password:- Fisher yates method
function shufflePassword(array){
    for(let i = array.length- 1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el)=>(str += el));
    return str;
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSymbol = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolCheck.checked) hasSymbol = true;

    if(hasUpper && hasLower && (hasNum || hasSymbol) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSymbol) && passwordLength >= 6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }

}




generateBtn.addEventListener('click',()=>{
    if(checkCount <= 0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handelSlider();
    }
    
    // remove old password
    password = "";

    let funArr = [];
    if(uppercaseCheck.checked){
        funArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funArr.push(generatelowerCase);
    }
    if(numbersCheck.checked){
        funArr.push(generateRandomNumber);
    }
    if(symbolCheck.checked){
        funArr.push(generateRandomSymbol);
    }

    // compulsory addition
    for(let i = 0; i<funArr.length; i++){
        password += funArr[i]();
    }

    for(let i = 0; i < passwordLength-funArr.length; i++){
        let randIdx = getRandInt(0,funArr.length);
        password += funArr[randIdx]();
    }

    // shuffle the password
    password = shufflePassword(Array.from(password));

    // show in UI
    PasswordDisplay.value = password;

    //calculate strength
    calcStrength();

})