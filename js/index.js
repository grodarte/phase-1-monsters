let page = 1
let floor = 0
let ceiling = 50
const limit = 51
let allMonsters
let allMonsterElements

document.addEventListener("DOMContentLoaded", () => {
    newMonsterForm()
    getMonsters().then(hideMonsters)

    document.getElementById("forward").addEventListener("click", () => {
        if (allMonsterElements.length > ceiling){
            floor += limit
            ceiling += limit
            page ++
            hideMonsters()
       }
    })

    document.getElementById("back").addEventListener("click", () => {
       if (page > 1){
        floor -= limit
        ceiling -= limit
        page --
        hideMonsters()
    }
    })
})

//GETs monsters from API and creates elements for each monster to display on the page
function getMonsters(pageNumber) {
    return fetch(`http://localhost:3000/monsters`)
    .then(res=>res.json())
    .then(monsterData=> {
        allMonsters = Array.from(monsterData)
        for (const monster of monsterData){
            renderMonstersOnPage(monster)
        }
        allMonsterElements = Array.from(document.getElementsByClassName("monster-info"))
    })
}

function renderMonstersOnPage(monster){
    const monsterCard = document.createElement("div")
    monsterCard.className = "monster-info"
    monsterCard.id = monster.id
    monsterCard.innerHTML = `
        <h2>${monster.name}</h2>
        <h4>Age: ${monster.age}</h4>
        <p>Bio: ${monster.description}</p>
    `
    document.getElementById("monster-container").appendChild(monsterCard)
}

//displays first 50 monsters, and then increments by 50 up or down when fwd/back buttons are pushed
function hideMonsters(){
    for (let i=0; i < allMonsterElements.length; i++){
        if (i < ceiling && i >= floor) {
            allMonsterElements[i].style.display = "block"
        } else {
            allMonsterElements[i].style.display = "none"
        }
    }
    window.scrollTo(0,0)
}


// POSTs new monster to monster collection in API
function newMonsterForm(){
    const monsterForm = document.createElement("form")
    monsterForm.id = "monster-form"
    monsterForm.innerHTML = `
        <input id="name" placeholder="name...">
        <input id="age" placeholder="age...">
        <input id="description" placeholder="description...">
        <button>Create</button>
    `

    document.getElementById("create-monster").appendChild(monsterForm)

    monsterForm.addEventListener("submit", e => {
        e.preventDefault()
        createNewMonster(e)
        monsterForm.reset()
    })
}

function createNewMonster(e){
    fetch ("http://localhost:3000/monsters", {
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            Accept:"application/json"
        },
        body: JSON.stringify({
            name: e.target["name"].value,
            age: e.target["age"].value,
            description: e.target["description"].value
        }
        )
    })
}