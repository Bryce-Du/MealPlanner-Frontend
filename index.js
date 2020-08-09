const mealURL = "http://localhost:3000/meals"

document.addEventListener('DOMContentLoaded', () => {
    makeWeek()
    
})

document.addEventListener('click', (e) => {
    if (e.target.outerHTML === "<td></td>"){
        if (e.target.innerHTML === ""){
            let cell = e.target
            const rightCol = document.getElementById("right-sidebar")
            // let timeSlot = cell.parentElement.rowIndex
            const dayCell = cell.parentElement.parentElement.firstChild.cells[cell.cellIndex]
            const timeCell = cell.parentElement.firstChild
            rightCol.innerHTML = `
                <h3>Add a meal at ${timeCell.innerHTML} on ${dayCell.innerHTML}</h3>
                <form action="${mealURL}" method="POST">
                    <label>Name:<input name="mealName" id="mealName"></label>
                    <input type="hidden" name="">
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
        headerHTML += `<th scope="col">${d.toDateString()}</th>`
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