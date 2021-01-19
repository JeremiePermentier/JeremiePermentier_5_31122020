// Récupération du formulaire dans le dom

let buttonSend = document.getElementById('send');

// Récupération des données dans le localstorage

let cart = JSON.parse(localStorage.getItem("cart"));

//Création d'un tableau pour le panier

let cartArray = [];

// Création de plusieurs objets pour récupérer les input du formulaire

let formObj = [
    {
        elementNotValid: document.getElementById("name"),
        regexValid: /^[a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+([-'\s][a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+)?$/,
        element: document.getElementById("divName"),
        message: " il manque votre nom"
    },
    {
        elementNotValid: document.getElementById("firstName"),
        regexValid: /^[a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+([-'\s][a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+)?$/,
        element: document.getElementById("divFirstName"),
        message: "il manque votre prénom"
    },
    {
        elementNotValid: document.getElementById("postal"),
        regexValid: /^[0-9]{5,5}$/,
        element: document.getElementById("divNumber"),
        message: "il manque le nom de votre rue"
    },
    {
        elementNotValid: document.getElementById("road"),
        regexValid: /^[a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+([-'\s][a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+)?$/,
        element: document.getElementById("divRoad"),
        message: "il manque le nom de votre rue"
    },
    {
        elementNotValid: document.getElementById("city"),
        regexValid: /^[a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+([-'\s][a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+)?$/,
        element: document.getElementById("divCity"),
        message: "il manque le nom de votre ville"
    },
    {
        elementNotValid: document.getElementById("mail"),
        regexValid: /^[a-zA-Z-]+@[a-zA-Z-]+\.[a-zA-Z]{2,6}$/,
        element: document.getElementById("divEmail"),
        message: "il manque votre adresse email"
    }
];
var prenomValid = /^[a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+([-'\s][a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+)?$/;



fetch("http://localhost:3000/api/cameras/")
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
        }else{
            alert("Votre panier est vide");
        }
    }
    buttonSend.addEventListener("click", sendOrder)

});


function sendOrder(e){
    let validate = true;

    for(i = 0; i < formObj.length; i++){
        let divInfo = document.createElement("div");
        if (formObj[i].elementNotValid.validity.valueMissing){
            formObj[i].element.appendChild(divInfo);
            divInfo.className = "alert alert-danger my-3";
            divInfo.textContent = formObj[i].message;
            form.className += " animation-form";
            validate = false;
            e.preventDefault();
        }else if(formObj[i].regexValid.test(formObj[i].elementNotValid.value) == false){
            formObj[i].element.appendChild(divInfo);
            divInfo.className = "alert alert-warning my-3";
            divInfo.textContent = formObj[i].message;
            form.className += " animation-form";
            validate = false;
            e.preventDefault();
        }
    }

    if(validate == true){
        e.preventDefault();

    let name = document.getElementById('name').value;
    let firstName = document.getElementById('firstName').value;
    let road = document.getElementById('road').value;
    let city = document.getElementById('city').value;
    let email = document.getElementById('mail').value;

    fetch("http://localhost:3000/api/cameras/order", {
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
        window.location.assign("http://127.0.0.1:5500/frontend/order.html");
    })
    }

}