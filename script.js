//DOM Elements
const mainScreen = document.querySelector(".screen");
const screenRightLeft = document.querySelector(".screen-right-left");
const screenRightRight = document.querySelector(".screen-right-right");
const prevBtn = document.querySelector(".btn-prev");
const nextBtn = document.querySelector(".btn-next");
const pokeName = document.querySelector(".poke-name");
const pokeId = document.querySelector(".poke-id");
const imgFront = document.querySelector(".poke-front-image");
const imgBack = document.querySelector(".poke-back-image");
const weight = document.querySelector(".poke-weight");
const height = document.querySelector(".poke-height");
const typeOne = document.querySelector(".poke-type-one");
const typeTwo = document.querySelector(".poke-type-two");
const pokeListItems = document.querySelectorAll(".list-item");


//Constants
const TYPES = [
    'normal','fighting','flying','poison','ground','rock',
    'bug','ghost','steel','fire','water','grass','electric',
    'psychic','ice','dragon','dark','fairy'
]

let prevUrl = null;
let nextUrl = null;

//Functions

const capitalize = (str) => str[0].toUpperCase() + str.substr(1);

const resetScreen = () => {
    for(const type of TYPES){
        mainScreen.classList.remove(type);
    }
}


//update right side of pokedex - every time clicked next/prev is update the 20 list items
const fetchPokeList = url => {
    fetch(url)
    .then(res => res.json())
    .then(data => {
        const { results, next, previous } = data;
        nextUrl = next;
        prevUrl = previous;
        for (let i = 0; i < pokeListItems.length; i++) {
            const pokeListItem = pokeListItems[i];
            const resultData = results[i]
            
            if(resultData){
                const { name, url } = resultData;
                const urlArray = url.split('/');
                const id = urlArray[urlArray.length - 2];
                pokeListItems[i].innerHTML = id + ' ' + resultData['name'];
            }else{
                pokeListItems[i].innerHTML = ''
            }
        }

    });
}

//onclick
const handleNextButtonClick = () => {
    if (nextUrl){
        fetchPokeList(nextUrl)
    }
}

const handlePrevButtonClick = () => {
    if (prevUrl){
        fetchPokeList(prevUrl)
    }
}

const handlePokeListItem = (e) => {
    if (!e.target) return;

    const listItem = e.target;
    if(!listItem.textContent) return;

    const id = listItem.textContent.split(' ')[0];

    choosePokemon(`https://pokeapi.co/api/v2/pokemon/${id}`)
}

//function to update left screen, gets the url of pokemon and display
const choosePokemon = url => {
fetch(url)
    .then(res => res.json())
    .then(data => {
        resetScreen();
        //deal with poke types (1 or 2)
        const types = data['types'];
        const type1 = types[0];
        const type2 = types[1];
        typeOne.textContent = capitalize(type1['type']['name']);
        if (type2) {
            typeTwo.classList.remove("hide");
            typeTwo.textContent = capitalize(type2['type']['name']);
        }else{
            typeTwo.classList.add("hide");
            typeTwo.textContent = '';
        }
        //to change bg color
        mainScreen.classList.add(type1['type']['name']); 
        //info
        pokeName.textContent = capitalize(data['name']);
        pokeId.textContent = '#' + data['id'].toString().padStart(3, '0');
        weight.textContent = data['weight'];
        height.textContent = data['height'];
        //imgs
        imgFront.src = data['sprites']['front_default'] || '';
        imgBack.src = data['sprites']['back_default'] || '';

    })
    .catch(err => console.log('Error!' + err))
}


    


//EventListeners

nextBtn.addEventListener('click', handleNextButtonClick);
prevBtn.addEventListener('click', handlePrevButtonClick);
for (const pokeListItem of pokeListItems){
    pokeListItem.addEventListener('click', handlePokeListItem);
}

//initilize app

fetchPokeList('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20')
choosePokemon('https://pokeapi.co/api/v2/pokemon/1');