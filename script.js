const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal-list');
const mealDetails = document.querySelector('meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

searchBtn.addEventListener('click', getMealList);

function getMealList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {
        let html = '';
        if (data.meals) {
            data.meals.forEach(meal => {
                html += `
                    <div class="meal" data-id="${meal.idMeal}">
                        <div class="meal-img">
                            <img src="${meal.strMealThumb}" alt="meal">
                        </div>
                        <div class="meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href="#" class="recipe-btn">Get recipe</a>
                        </div>
                    </div>
                `;
            });
            mealList.classList.remove('not-found');
        } else {
            html = 'No meal was found...';
            mealList.classList.add('not-found');
        }
        mealList.innerHTML = html;
    })
}