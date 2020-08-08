document.addEventListener('DOMContentLoaded', () => {
    makeWeek()
})

function makeWeek(){
    const week = document.createElement('div')
    let d = new Date()
    week.innerHTML = `
        <table>
            <tr>
                <th>${d.toDateString()}</th>
                <th>${d.toDateString()}</th>
            </tr>
            <tr>
            </tr>
        </table>
    `
    document.querySelector('body').appendChild(week)
}