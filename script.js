const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const mealList = document.getElementById('meal-list');
const mealDetails = document.querySelector('meal-details-content');

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
            <div class="recipe-modal-header">
                <h2 class="recipe-title">${meal.strMeal}</h2>
                <button type="button" class="btn recipe-close-btn" id="recipe-close-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="recipe-content">
                <span class="recipe-category">${meal.strCategory}</span>
                <div class="recipe-instructions">
                    <div class="recipe-instructions-header">
                        <span>Instructions:</span>
                        <a class="recipe-video" href="${meal.strYoutube}" target="_blank">Video</a>
                    </div>
                    <p>${meal.strInstructions}</p>
                </div>
                <div class="recipe-meal-img">
                    <img src="${meal.strMealThumb}" alt="">
                </div>
            </div>
        </div>
    `;
    document.getElementById('recipe-modal-container').innerHTML = html;
    document.addEventListener('click', handleRecipeModalOutsideClick);

    const recipeCloseBtn = document.getElementById('recipe-close-btn');
    recipeCloseBtn.addEventListener('click', closeModal);
}

function handleRecipeModalOutsideClick(e) {
    const recipeModal = document.getElementById('recipe-modal');
    const isClickOutsideModal = !recipeModal.contains(e.target);
    if (isClickOutsideModal) {
        closeModal();
    }
}

function closeModal() {
    const recipeModal = document.getElementById('recipe-modal');
    document.removeEventListener('click', handleRecipeModalOutsideClick);
    recipeModal.remove();
}