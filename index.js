const mealURL = "http://localhost:3000/api/meals"
const ingredientURL = "http://localhost:3000/api/ingredients"

let ingredients

document.addEventListener('DOMContentLoaded', () => {
    makeWeek()
    fetchMeals()
    fetchIngredients()
})

document.addEventListener('click', (e) => {
    if (e.target.outerHTML === "<td></td>"){
        if (e.target.innerHTML === ""){
            let cell = e.target
            clearLastSelection()
            cell.setAttribute("class", "bg-success")
            const rightCol = document.getElementById("right-sidebar")
            // let timeSlot = cell.parentElement.rowIndex
            const day = cell.parentElement.parentElement.firstChild.cells[cell.cellIndex].innerHTML
            const timeText = cell.parentElement.firstChild.innerHTML
            const time = ((cell.parentElement.rowIndex-1) + ":00")
            let ingredientFormId = 0
            rightCol.innerHTML = `
                <h3>Add a meal at ${timeText} on ${day}</h3>
                <form action="${mealURL}" method="POST" autocomplete="off">
                    <label>Name:<input name="name" id="name"></label><br>
                    <input type="hidden" name="mealTime" id="mealTime" value="${day} ${time}">
                    <label>Ingredients:</label><br>
                    <input name="ingredient" id="ingredient-${ingredientFormId++}">
                    <br><br><input type="submit" value="Add Meal">
                </form>
            `
            
        }
    }
})

document.addEventListener("submit", (e) => {
    console.log(e.target)
    let name = document.querySelector("#name").value
    let mealTime = document.querySelector("#mealTime").value
    submitMeal(name, mealTime)
    e.preventDefault()
})

function submitMeal(name, mealTime){
    return fetch(mealURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: name,
          mealtime: mealTime
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
    let [date, time] = mealtimeString.split("T")
    let dateKey = new Date(date)
    let dayHeaders = Array.from(document.querySelectorAll(".day-header"))
    let day = dayHeaders.find(th => th.innerHTML === dateKey.toDateString())
    let hour = (parseInt(time.substring(0, 2)) + 1)
    let table = document.querySelector("table")
    if (!!day) {
        return table.rows[hour].cells[day.cellIndex + 1]           
    }
}

function renderMeals(mealArray){
    mealArray.forEach(meal => {
        renderMeal(getCellFromMealTime(meal.attributes.mealtime), meal.attributes)
    })
}

function renderMeal(mealCell, mealAttr){
    if (!!mealCell){
        mealCell.setAttribute("class", "bg-primary text-white")
        mealCell.innerHTML = mealAttr.name
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

function fetchIngredients(){
    return fetch(ingredientURL)
    .then(function(response){
        return response.json()
    })
    .then(function(object){
        ingredients = object.data
        console.log(ingredients)
    })
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

function autocompleteIngredient(input){

}