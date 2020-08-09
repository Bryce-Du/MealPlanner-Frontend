const mealURL = "http://localhost:3000/api/meals"

document.addEventListener('DOMContentLoaded', () => {
    makeWeek()
    fetchMeals()
})

document.addEventListener('click', (e) => {
    if (e.target.outerHTML === "<td></td>"){
        if (e.target.innerHTML === ""){
            let cell = e.target
            const rightCol = document.getElementById("right-sidebar")
            // let timeSlot = cell.parentElement.rowIndex
            const day = cell.parentElement.parentElement.firstChild.cells[cell.cellIndex].innerHTML
            const timeText = cell.parentElement.firstChild.innerHTML
            const time = ((cell.parentElement.rowIndex-1) + ":00")
            rightCol.innerHTML = `
                <h3>Add a meal at ${timeText} on ${day}</h3>
                <form action="${mealURL}" method="POST" autocomplete="off">
                    <label>Name:<input name="name" id="name"></label>
                    <input type="hidden" name="mealTime" id="mealTime" value="${day} ${time}">
                    <input type="submit" value="Add Meal">
                </form>
            `
            // cell.id = "blip"
            // document.getElementById("blip").popover({
            //     html: true,
            //     title: "make a new meal",
            //     content: "new meal form here"
            // })
            
            // failed attempt to use popovers, may revisit
            
            
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
        console.log(object)
      })
}

function renderMeals(mealArray){
    mealArray.forEach(meal => {
        let [date, time] = meal.attributes.mealtime.split("T")
        let dateKey = new Date(date)
        let dayHeaders = Array.from(document.querySelectorAll(".day-header"))
        let day = dayHeaders.find(th => th.innerHTML === dateKey.toDateString())
        let table = document.querySelector("table")
        let hour = (parseInt(time.substring(0, 2)) + 1)
        if (!!day) {
            renderMeal(table.rows[hour].cells[day.cellIndex], meal.attributes)           
        }
    })
}

function renderMeal(mealCell, mealAttr){
    mealCell.setAttribute("class", "bg-primary text-white")
    mealCell.innerHTML = meal.attributes.name
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
    for(i=0; i<7; i++){
        d.setDate(today+i)
        headerHTML += `<th class="day-header" scope="col">${d.toDateString()}</th>`
    }
    headerHTML += "</tr>"
    return headerHTML
}

function makeHours(){
    let rowHTML = ""
    let hour = ""
    for(i=0; i<24; i++){
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
    for (j=0; j<7; j++){
        cellHTML += "<td></td>"
    }
    return cellHTML
}