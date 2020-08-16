class Meal{
    constructor(id, attributes){
        this.id = id
        this.name = attributes.name
        this.mealtime = attributes.mealtime
        this.ingredients = attributes.ingredients
        this.mealIngredients = attributes.meals_ingredients
        Meal.all.push(this)
    }
    
    render(){
        let mealCell = this.getCellFromMealTime()
        if (!!mealCell){
            mealCell.setAttribute("class", "bg-primary")
            mealCell.innerHTML = this.name
            mealCell.id = this.id
            let footer = document.getElementById("calorie-footer")
            footer.cells[mealCell.cellIndex].innerHTML = parseInt(footer.cells[mealCell.cellIndex].innerHTML) + this.calories()
        }
    }

    getCellFromMealTime(){
        let time = this.mealtime.split("T")[1]
        let hour = (parseInt(time.substring(0, 2)) + 1)
        let day = this.mealtime.substr(8,2)
        let dayHeaders = Array.from(document.querySelectorAll(".day-header"))
        let dayHead = dayHeaders.find(th => th.innerHTML.substr(8,2) === day)
        let table = document.querySelector("table")
        if (!!dayHead) {
            return table.rows[hour].cells[dayHead.cellIndex]           
        }
    }

    calories(){
        return this.ingredients.reduce(((total,ingr) => total + ingr.calories), 0)
    }
    
    detailsHTML(){
        let date = new Date(this.mealtime)
        const ingredientLIs = (string, ingr) => `${string}<li>${this.ingredientQuantity(ingr.id)} ${ingr.name}</li>`
        return `
            <h3>${this.name}</h3>
            <p>Made on ${date.toDateString()}</p>
            <p>Calories: ${this.calories()}</p>
            <h5>Ingredients:</h5>
            <ul>
                ${this.ingredients.reduce(ingredientLIs, "")}
            </ul>
            <button id="edit-button" data-id="${this.id}">Edit Meal</button>
        `
    }

    ingredientQuantity(id){
        let index = this.ingredients.findIndex(ingr => ingr.id === id)
        return this.mealIngredients[index].quantity
    }

    update(data){
        this.name = data.attributes.name
        this.mealtime = data.attributes.mealtime
        this.ingredients = data.attributes.ingredients
        this.mealIngredients = data.attributes.meals_ingredients
        let currentIndex = Meal.all.findIndex(meal => meal.id === this.id)
        Meal.all[currentIndex] = this
    }
}
Meal.all = [];
    