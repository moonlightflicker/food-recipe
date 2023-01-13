const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const mealList = document.getElementById('meal-list');
const mealDetails = document.querySelector('meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

searchBtn.addEventListener('click', getMealList);
searchInput.addEventListener('keyup', function() {
    if (event.key === 'Enter') {
        getMealList();
    }
});
mealList.addEventListener('click', getMealRecipe);

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
                            <a href="#" class="recipe-btn">See Recipe</a>
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

function getMealRecipe(e){
    console.log('asdas')
    e.preventDefault();
    if(e.target.classList.contains('recipe-btn')){
        let mealId = e.target.parentElement.parentElement.getAttribute('data-id');
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
            .then(response => response.json())
            .then(data => showRecipeModal(data.meals[0]));
    }
}

function showRecipeModal(meal) {
    const html = `
        <div class="recipe-modal" id="recipe-modal">
            <button type="button" class="btn recipe-close-btn" id="recipe-close-btn">
                <i class="fas fa-times"></i>
            </button>

            <div class="recipe-content">
                <h2 class="recipe-title">${meal.strMeal}</h2>
                <p class="recipe-category">${meal.strCategory}</p>
                <div class="recipe-instruct">
                    <h3>Instructions:</h3>
                    <p>${meal.strInstructions}</p>
                </div>
                <div class="recipe-meal-img">
                    <img src="${meal.strMealThumb}" alt="">
                </div>
                <div class="recipe-link">
                    <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
                </div>
            </div>
        </div>
    `;
    document.getElementById('recipe-modal-container').innerHTML = html;
    document.addEventListener('click', handleRecipeModalOutsideClick);
}

function handleRecipeModalOutsideClick(e) {
    const recipeModal = document.getElementById('recipe-modal');
    const isClickOutsideModal = !recipeModal.contains(e.target);
    if (isClickOutsideModal) {
        document.removeEventListener('click', handleRecipeModalOutsideClick);
        recipeModal.remove();
    }
}