// Récupération du formulaire dans le dom

let buttonSend = document.getElementById('send');

// Récupération des données dans le localstorage

let cart = JSON.parse(localStorage.getItem("cart"));

//Création d'un tableau pour le panier

let cartArray = [];

// Création de plusieurs objets pour récupérer les input du formulaire

let formObj = [
    {
        elementParent: document.getElementById("divName"),
        elementNotValid: document.getElementById("name"),
        regexValid: /^[a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+([-'\s][a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+)?$/,
        element: document.getElementById("divName"),
        error: "il manque votre nom",
        errorRegex: "Votre nom ne peut que contenir une lettre majuscule au début"
    },
    {
        elementParent: document.getElementById("divFirstName"),
        elementNotValid: document.getElementById("firstName"),
        regexValid: /^[a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+([-'\s][a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+)?$/,
        element: document.getElementById("divFirstName"),
        error: "il manque votre prénom",
        errorRegex: "Votre prénom ne peut que contenir une lettre majuscule au début"
    },
    {
        elementParent: document.getElementById("divPostal"),
        elementNotValid: document.getElementById("postal"),
        regexValid: /^[0-9]{5,5}$/,
        element: document.getElementById("divNumber"),
        error: "il manque votre code postal",
        errorRegex: "Votre code postal doit contenir 5 chiffres"
    },
    {
        elementParent: document.getElementById("divRoad"),
        elementNotValid: document.getElementById("road"),
        regexValid: /^([0-9]*)[-'\s]*[a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+([-'\s][a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+)*$/,
        element: document.getElementById("divRoad"),
        error: "il manque votre rue",
        errorRegex: "Le nom de la rue doit contenir les chiffres au début et les lettres à la suite."
    },
    {
        elementParent: document.getElementById("divCity"),
        elementNotValid: document.getElementById("city"),
        regexValid: /^[a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+([-'\s][a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+)*$/,
        element: document.getElementById("divCity"),
        error: "il manque votre ville",
        errorRegex: "Le nom de votre ville ne doit pas contenir de chiffre ou que des lettres en capitales"
    },
    {
        elementParent: document.getElementById("divEmail"),
        elementNotValid: document.getElementById("mail"),
        regexValid: /^[a-zA-Z-]+@[a-zA-Z-]+\.[a-zA-Z]{2,6}$/,
        element: document.getElementById("divEmail"),
        error: "il manque votre email",
        errorRegex: "Votre email ne correspond pas au format d'une adresse email"
    }
];

if(localStorage.getItem("order")){
    localStorage.removeItem("order");
}

fetch(`${urlApi}api/cameras/`)
.then(response => response.json())
.then(data => {
    result = data
    
    for (i = 0; i < cart.length; i++){
        if(cart[i].id == result[i]._id){
            let count = 0;
            while(count < cart[i].quantity){
                cartArray.push(cart[i].id);
                count++;
            }
        }
    }
    buttonSend.addEventListener("click", sendOrder)
})

function sendOrder(e){
    
    let validate = true;
    
    for(i = 0; i < formObj.length; i++){
        let divParent = formObj[i].elementParent;
        let divInfo = divParent.childNodes;
        if (formObj[i].elementNotValid.validity.valueMissing){
            divInfo[5].className = "alert alert-danger my-3 text-white";
            divInfo[5].textContent = formObj[i].error;
            form.className += " animation-form";
            validate = false;
            e.preventDefault();
        }else if(formObj[i].regexValid.test(formObj[i].elementNotValid.value) == false){
            divInfo[5].className = "alert alert-warning my-3";
            divInfo[5].textContent = formObj[i].errorRegex;
            form.className += " animation-form";
            validate = false;
            e.preventDefault();
        } else {
            divInfo[5].className = "d-none";
        }
    }

    if(validate == true){
        e.preventDefault();

    let name = document.getElementById('name').value;
    let firstName = document.getElementById('firstName').value;
    let road = document.getElementById('road').value;
    let city = document.getElementById('city').value;
    let email = document.getElementById('mail').value;

    fetch(`${urlApi}api/cameras/order`, {
        method: 'POST',
        body: JSON.stringify({
            contact: {
            firstName: name,
            lastName: firstName,
            address: road,
            city: city,
            email: email
            },
            products: cartArray
            
        }),
        headers:{
            "Content-Type":"application/json ; charset=UTF-8"
        }
    })
    .then(function(response){
        return response.json()
    })
    .then(function(result){
        result.priceTotaly = total.reduce(reducer);
        localStorage.setItem("order", JSON.stringify(result));
        window.location.assign(`./order.html`);
    })
    }

}