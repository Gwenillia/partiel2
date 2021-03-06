// update les labels au chargement de la page pour les bouger lors de la complétion
let labels;
let labelsClient;
let inputs;
let input;

document.addEventListener('DOMContentLoaded', function () {
    updateLabelsInputs();
    serviceList();
});

function updateLabelsInputs() {
    labels = document.getElementsByClassName('labelLigne');
    labelsClient = document.getElementsByClassName('clientLabel');
    inputs = document.getElementsByClassName('dataInput');
    input = document.querySelectorAll('input');
    checkEmptyness();
}

function checkEmptyness() {

    // label, borderbottom & hint
    for (let i = 0; i < labelsClient.length; i++) {
        if (inputs[i].children[0].value) {
            labelsClient[i].classList.add('invisible');
            inputs[i].children[0].classList.add('notEmptyBorderClient');
        } else {
            labelsClient[i].classList.remove('invisible');
            inputs[i].children[0].classList.remove('notEmptyBorderClient');
        }
    }

    // lines Labels and border
    for (let i = 4; i < (labels.length + 4); i++) {
        if (i > 7 && inputs[i].children[0].value) {
            labels[i - 4].classList.add('invisible');
            inputs[i].children[0].classList.add('notEmptyBorder');
        } else if (i <= 7 && inputs[i].children[0].value) {
            labels[i - 4].classList.add('notEmpty');
            inputs[i].children[0].classList.add('notEmptyBorder');
        } else {
            labels[i - 4].classList.remove('notEmpty');
            inputs[i].children[0].classList.remove('notEmptyBorder');
        }
    }

    // Hints
    const coordsArr = [input[1], input[2], input[4]];
    coordsArr.forEach(function (e) {
        if (e.value) {
            e.parentNode.children[2].classList.add('invisible');
        } else {
            e.parentNode.children[2].classList.remove('invisible');
        }
    });
    resizeInput();
    checkPrices();
}



function hauteurTextArea() {
    const textarea = document.querySelectorAll('textarea');

    for (let i = 0; i < textarea.length; i++) {
        if (textarea[i].scrollHeight > textarea[i].clientHeight) {
            textarea[i].style.height = textarea[i].scrollHeight + 'px';
        } else {
            textarea[i].style.height = 3.6 + 'rem';
        }
    }
}

// règle la width des inputs en fonction de leur value


function resizeInput() {
    for (let i = 0; i < input.length && i < 5; i++) {
        input[i].style.minWidth = 15 + 'rem';
        input[i].style.width = input[i].value.length + 'ch';
    }
}

// ajout et suppression de ligne

const row = document.getElementsByClassName('rowContent');
const rowContainer = document.getElementsByClassName('rowContainer');

const addBtn = document.getElementById('addLigne');

addBtn.addEventListener('click', () => {
    rowContainer[0].insertAdjacentHTML('beforeend', '<div class="rowContent notFirstLine">' + row[0].innerHTML + '</div>');
    updateLabelsInputs();
});

function delLigne(e) {
    if (row.length > 1) {
        if (e.parentNode.classList.contains('notFirstLine')) {
            e.parentNode.remove();
        }
    }
    checkEmptyness();
}

// PRICES
function checkPrices() {
    const prices = document.querySelectorAll('[price^=price]');
    const pHT = document.getElementById('pHT');
    const pTTC = document.getElementById('pTTC');


    let sumHT = 0;
    let sumTTC = 0;

    prices.forEach(function (e) {
        let qte = e.parentNode.parentNode.children[2].children[0].value;
        if (parseInt(e.value)) {
            sumHT = (sumHT + (parseFloat(e.value) * qte));
            sumHT = (Math.round(sumHT * 100) / 100).toFixed(2);
            sumHT = parseFloat(sumHT);
            sumTTC = (sumHT * 1.2);
            sumTTC = (Math.round(sumTTC * 100) / 100).toFixed(2);
            pHT.innerText = sumHT.toString();
            pTTC.innerText = sumTTC.toString();
        }
    });
}

// Modale
const addBTN = document.querySelector('#addService');
const closeModale = document.querySelectorAll('.closeModale');
const modale = document.querySelector('#modale');
const main = document.querySelector('main');
addBTN.addEventListener('click', () => {
    modale.style.display = 'flex';
    main.style.display = 'none';
});

closeModale.forEach(function (e) {
    e.addEventListener('click', () => {
        modale.style.display = 'none';
        main.style.display = 'block';
    });
});

const select = document.querySelector('#selectService');


function serviceList() {
    fetch('data.json')
        .then(res => res.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                select.innerHTML = select.innerHTML + '<option data-prix="' + data[i]['prix'] + '"' + ' data-qte="' + data[i]['quantité'] + '"' + ' data-desc="' + data[i]['description'] + '" value="' + data[i]['reference'] + '">' + data[i]['reference'] + '</option>';
            }
        });
}

const addToInvoiceBTN = document.querySelector('#addToInvoice');
addToInvoiceBTN.addEventListener('click', () => {
    rowContainer[0].insertAdjacentHTML('afterend', '<div class="rowContent notFirstLine" id="addedByModale">' + row[0].innerHTML + '</div>');
    const rowByModale = document.querySelector('#addedByModale');
    rowByModale.children[0].children[0].value = select.options[select.selectedIndex].text;
    if (select.options[select.selectedIndex].dataset.desc !== 'null') {
        rowByModale.children[1].children[0].value = select.options[select.selectedIndex].dataset.desc;
    }
    rowByModale.children[2].children[0].value = select.options[select.selectedIndex].dataset.qte;
    rowByModale.children[3].children[0].value = select.options[select.selectedIndex].dataset.prix;

    updateLabelsInputs();
    hauteurTextArea();
});