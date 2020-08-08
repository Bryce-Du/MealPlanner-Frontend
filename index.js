document.addEventListener('DOMContentLoaded', () => {
    makeWeek()
})

document.addEventListener('click', (e) => {
    if (e.target.outerHTML === "<td></td>"){
        console.log("inside table cell")
        if (e.target.innerHTML === ""){
            console.log("cell is empty")
            
        }
    }
    console.log(e.target)
})

function makeWeek(){
    const week = document.createElement('div')
    week.innerHTML = `
        <div class="row">
            <div class="col-3"></div>
            <div class="col-6">
                <table class="table table-bordered">
                    ${weekdayHeaders()}
                    ${makeHours()}
                </table>
            </div>
            <div class="col-3"></div>
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
    for(i=0; i<2400; i+=100){
        if (i === 0){i = "0000"}
        else if (i < 1000){i = "0"+i}
        rowHTML += `<tr align="right"><th scope="row">${i}</th>${makeCells()}</tr>`
        i = parseInt(i, 10)
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