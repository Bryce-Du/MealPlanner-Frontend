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
        fetchMeal(mealCell.id)
    } else if (e.target.id === `ingredient-add`) {
        e.preventDefault()
        let ingrForm = document.getElementById("ingredient-form")
        ingrForm.innerHTML += `
            <input class="ingredient-input" name="ingredients" id="ingredient-${ingredientFormId++}" list="ingredient-datalist"></input>
        `
    }
})

document.addEventListener("submit", (e) => {
    let name = document.querySelector("#name").value
    let mealTime = document.querySelector("#mealTime").value
    console.log(mealTime)
    let ingredient = document.querySelector("#ingredient-0").value
    submitMeal(name, mealTime, ingredient)
    document.getElementById("right-sidebar").innerHTML = ""
    e.preventDefault()
})

function submitMeal(name, mealTime, ingredient){
    return fetch(mealURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: name,
          mealtime: mealTime,
          ingredient: ingredient
        })
      })
      .then(function(response){
        return response.json()
      })
      .then(function(object){
        renderMeal(getCellFromMealTime(object.data.attributes.mealtime), object.data.attributes)
      })
}

function getCellFromMealTime(mealtimeString){
    let time = mealtimeString.split("T")[1]
    let day = new Date(mealtimeString)
    let dayHeaders = Array.from(document.querySelectorAll(".day-header"))
    let dayIndex = dayHeaders.find(th => th.innerHTML === day.toDateString()).cellIndex
    let hour = (parseInt(time.substring(0, 2)) + 1)
    let table = document.querySelector("table")
    if (!!dayIndex) {
        return table.rows[hour].cells[dayIndex]           
    }
}

function renderMeals(mealArray){
    mealArray.forEach(meal => {
        renderMeal(getCellFromMealTime(meal.attributes.mealtime), meal)
    })
}

function renderMeal(mealCell, meal){
    if (!!mealCell){
        mealCell.setAttribute("class", "bg-primary")
        mealCell.innerHTML = meal.attributes.name
        mealCell.id = meal.id
    }
}

function fetchMeals(){
    return fetch(mealURL)
    .then(function(response){
        return response.json()
    })
    .then(function(object){
        console.log(object.data)
        renderMeals(object.data)
    })
}

function fetchMeal(mealID){
    fetch(mealURL + `/${mealID}`)
    .then(function(response){
        return response.json()
    })
    .then(function(object){
        const rightCol = document.getElementById("right-sidebar")
        rightCol.innerHTML = mealDetailsHTML(object.data)
        console.log(object.data)
    })
}

function mealDetailsHTML(meal){
    let date = new Date(meal.attributes.mealtime)
    const ingredientLIs = (string, ingr) => string + "<li>" + ingr.name + "</li>"
    
    return `
        <h3>${meal.attributes.name}</h3>
        <p>Made on ${date.toDateString()}</p>
        <p>Calories: </p>
        <h5>Ingredients:</h5>
        <ul>
            ${meal.attributes.ingredients.reduce(ingredientLIs, "")}
        </ul>
    `
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
        <div class="row">
            <div class="col-3 bg-secondary"></div>
            <div class="col-6 bg-light">
                <table class="table table-bordered table-striped table-sm">
                    ${weekdayHeaders()}
                    ${makeHours()}
                </table>
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

function makeCells(){
    let cellHTML = ""
    for (let j=0; j<7; j++){
        cellHTML += "<td></td>"
    }
    return cellHTML
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