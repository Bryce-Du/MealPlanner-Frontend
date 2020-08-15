const mealURL = "http://localhost:3000/api/meals"
const ingredientURL = "http://localhost:3000/api/ingredients"

let ingredients
let ingredientFormId = 0

document.addEventListener('DOMContentLoaded', () => {
    makeWeek()
    fetchMeals()
    fetchIngredients()
})

document.addEventListener('click', (e) => {
    console.log()
    if (e.target.outerHTML === "<td></td>" || e.target.outerHTML === `<td class=""></td>`){
        if (e.target.innerHTML === ""){
            let cell = e.target
            clearLastSelection()
            cell.setAttribute("class", "bg-success")
            const rightCol = document.getElementById("right-sidebar")
            // let timeSlot = cell.parentElement.rowIndex
            const day = cell.parentElement.parentElement.firstChild.cells[cell.cellIndex].innerHTML
            const timeText = cell.parentElement.firstChild.innerHTML
            const time = ((cell.parentElement.rowIndex-1) + ":00")
            rightCol.innerHTML = `
                <h3>Add a meal at ${timeText} on ${day}</h3>
                <form action="${mealURL}" method="POST" autocomplete="off">
                    <label>Name:<input name="name" id="name"></label><br>
                    <input type="hidden" name="mealTime" id="mealTime" value="${day} ${time}">
                    <label>Ingredients:</label><br>
                    <div id="ingredient-form">
                        <input class="ingredient-input" name="ingredients" id="ingredient-${ingredientFormId++}" list="ingredient-datalist">
                    </div>
                    <br><button id="ingredient-add">Add More Ingredients</button>
                    <br><br><input type="submit" value="Add Meal">
                </form>
            `
        }
    } else if (e.target.classList[0] === "bg-primary") {
        clearLastSelection()
        let mealCell = e.target
        const rightCol = document.getElementById("right-sidebar")
        rightCol.innerHTML = Meal.all.find(meal => meal.id === mealCell.id).detailsHTML()
    } else if (e.target.id === `ingredient-add`) {
        e.preventDefault()
        let ingrForm = document.getElementById("ingredient-form")
        const newInput = document.createElement("input")
        newInput.setAttribute("class", "ingredient-input")
        newInput.setAttribute("name", "ingredients")
        newInput.setAttribute("id", `ingredient-${ingredientFormId++}`)
        newInput.setAttribute("list", "ingredient-datalist")
        ingrForm.appendChild(newInput)
    }
})

document.addEventListener("submit", (e) => {
    let name = document.querySelector("#name").value
    let mealTime = document.querySelector("#mealTime").value
    console.log(mealTime)
    let ingredients = document.querySelectorAll(".ingredient-input")
    submitMeal(name, mealTime, ingredients)
    document.getElementById("right-sidebar").innerHTML = ""
    e.preventDefault()
})

function submitMeal(name, mealTime, ingredients){
    let ingrArr = []
    ingredients.forEach(ingr => ingrArr.push(ingr.value))
    return fetch(mealURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            meal:
            {
                name: name,
                mealtime: mealTime,
            },
            ingredients: ingrArr
        })
    })
    .then(function(response){
        return response.json()
    })
    .then(function(object){
        const newMeal = new Meal(object.data.id, object.data.attributes)
        newMeal.render()
    })
}

function patchMeals(){
    fetch(mealURL, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            meal:
            {
                name: name,
                mealtime: mealTime,
            },
            ingredients: ingrArr
        })
    })
    .then(function(response){
        return response.json()
    })
    .then(function(object){
        const newMeal = new Meal(object.data.id, object.data.attributes)
        newMeal.render()
    })
}

function fetchMeals(){
    return fetch(mealURL)
    .then(function(response){
        return response.json()
    })
    .then(meals => {
        meals.data.forEach(meal => {
            const newMeal = new Meal(meal.id, meal.attributes)
            newMeal.render()
        })  
    })
}

function fetchIngredients(){
    return fetch(ingredientURL)
    .then(function(response){
        return response.json()
    })
    .then(function(object){
        ingredients = object.data
        ingredientDatalist()
    })
}

function ingredientDatalist(){
    const ingredientsDL = document.createElement("datalist")
    ingredientsDL.id = "ingredient-datalist"
    ingredients.forEach(ingredient => ingredientsDL.innerHTML += `<option>${ingredient.attributes.name}</option>`)
    document.querySelector('body').appendChild(ingredientsDL)
}

function makeWeek(){
    const week = document.createElement('div')
    week.innerHTML = `
        <div class="row vh-100">
            <div class="col-3 bg-secondary"></div>
            <div class="col-6 bg-light">
                <div class="row overflow-auto vh-100">
                    <table class="table table-bordered table-striped table-sm">
                        ${weekdayHeaders()}
                        ${makeHours()}
                        ${makeFooter()}
                    </table>
                </div>
            </div>
            <div class="col-3 bg-secondary" id="right-sidebar"></div>
        </div>
    `
    document.querySelector('.container-fluid').appendChild(week)
}

function weekdayHeaders(){
    let headerHTML = "<tr><th></th>"
    let d = new Date()
    let today = d.getDate()
    for(let i=0; i<7; i++){
        d.setDate(today+i)
        headerHTML += `<th class="day-header" scope="col">${d.toDateString()}</th>`
    }
    headerHTML += "</tr>"
    return headerHTML
}

function makeHours(){
    let rowHTML = ""
    let hour = ""
    for(let i=0; i<24; i++){
        if (i === 0){hour = "12 am"}
        else if (i < 12){hour = `${i} am`}
        else if (i === 12){hour = `${i} pm`}
        else {hour = `${i-12} pm`}
        rowHTML += `<tr align="right"><th scope="row">${hour}</th>${makeCells()}</tr>`
    }
    return rowHTML
}

function makeCells(content = ""){
    let cellHTML = ""
    for (let j=0; j<7; j++){
        cellHTML += `<td>${content}</td>`
    }
    return cellHTML
}

function makeFooter(){
    return `
        <tr class="bg-danger" id="calorie-footer">
            <th scope="row">Total Cals:</th>${makeCells(0)}
        </tr>
    `
}

function clearLastSelection(){
    document.querySelectorAll(".bg-success").forEach(cell => cell.setAttribute("class", ""))
}

function autocompleteIngredient(){
    let input = document.querySelector(".ingredient-input")
    input.addEventListener("input", (e) => {
        console.log(this.value)
    })
}