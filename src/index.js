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
    const rightCol = document.getElementById("right-sidebar")
    if (e.target.outerHTML === "<td></td>" || e.target.outerHTML === `<td class=""></td>`){
        if (e.target.innerHTML === ""){
            ingredientFormId = 0
            let cell = e.target
            clearLastSelection()
            cell.setAttribute("class", "bg-success")
            rightCol.innerHTML = mealForm(cell, "POST")
        }
    } else if (e.target.classList[0] === "bg-primary") {
        clearLastSelection()
        let mealCell = e.target
        rightCol.innerHTML = Meal.all.find(meal => meal.id === mealCell.id).detailsHTML()
    } else if (e.target.id === `ingredient-add`) {
        e.preventDefault()
        let ingrForm = document.getElementById("ingredient-form")
        ingrForm.innerHTML += ingredientInputs()
    } else if (e.target.id === `edit-button`) {
        let meal = Meal.all.find(meal => meal.id === e.target.dataset.id)
        rightCol.innerHTML = mealForm(meal.getCellFromMealTime(), "PATCH", meal)
    } else if (e.target.classList[0] === 'delete-ingredient-button'){
        e.preventDefault()
        let deletingID = e.target.id.split("-")[2]
        let deletingEl = document.getElementById(`ingredient-${deletingID}`)
        document.getElementById("ingredient-form").removeChild(deletingEl)
        document.getElementById("ingredient-form").removeChild(e.target)
    }
})

document.addEventListener("submit", (e) => {
    e.preventDefault()
    let name = document.querySelector("#name").value
    let mealtime = document.querySelector("#mealtime").value
    let id = document.querySelector("#mealID")
    let ingredients = document.querySelectorAll(".ingredient-input")
    let rightCol = document.getElementById("right-sidebar")
    if(e.target.id === "create-form"){
        submitMeal(name, mealtime, ingredients)
        rightCol.innerHTML = ""
    } else if(e.target.id === "edit-form"){
        patchMeal(name, mealtime, ingredients, id.value)
    }
})
function mealForm(cell, method, meal = null){
    const day = cell.parentElement.parentElement.firstChild.cells[cell.cellIndex].innerHTML
    const timeText = cell.parentElement.firstChild.innerHTML
    const time = ((cell.parentElement.rowIndex-1) + ":00")
    return formHTML = `
        <h3>${!meal ? "Add Meal" : "Update Meal"} at ${timeText} on ${day}</h3>
        <form action="${!meal ? mealURL : mealURL + "/" + meal.id} method="${method}" autocomplete="off" id="${method === "POST" ? "create" : "edit"}-form">
            <input type="hidden" name="mealtime" id="mealtime" value="${day} ${time}">
            ${!!meal ? `<input type="hidden" name="mealID" id="mealID" value="${meal.id}">`: ""}
            <label>Name:<input name="name" id="name" ${!!meal ? `value="${meal.name}"`: ""}></label><br>
            <label>Ingredients:</label><br>
            <div id="ingredient-form">
                ${ingredientInputs(meal)}
            </div>
            <br><button id="ingredient-add">Add More Ingredients</button>
            <br><br><input type="submit" value="${!meal ? `Add Meal` : `Update Meal`}">
        </form>
    `
}

function ingredientInputs(meal = null){
    let ingrInputs=""
    if(!!meal){
        meal.ingredients.forEach(ingr => {
            ingrInputs += `
                <input class="ingredient-input" name="ingredients" id="ingredient-${ingredientFormId}" list="ingredient-datalist" value="${ingr.name}"></input>
                <button id="delete-ingredient-${ingredientFormId++}" class="delete-ingredient-button">X</button>
            `
        })
    }else{
        ingrInputs += `
            <input class="ingredient-input" name="ingredients" id="ingredient-${ingredientFormId}" list="ingredient-datalist"></input>
            <button id="delete-ingredient-${ingredientFormId++}" class="delete-ingredient-button">X</button>
        `
    }
    return ingrInputs
}

function submitMeal(name, mealtime, ingredients){
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
                mealtime: mealtime,
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

function patchMeal(name, mealtime, ingredients, id){
    let ingrArr = []
    ingredients.forEach(ingr => ingrArr.push(ingr.value))
    fetch((mealURL + "/" + id), {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            meal:
            {
                name: name,
                mealtime: mealtime,
            },
            ingredients: ingrArr,
            id: id
        })
    })
    .then(function(response){
        return response.json()
    })
    .then(function(object){
        let meal = Meal.all.find(meal => meal.id === object.data.id)
        meal.update(object.data)
        meal.render()
        document.getElementById("right-sidebar").innerHTML = meal.detailsHTML()
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