const parentContainer = document.getElementById('main');
const createEle = (element) => document.createElement(element);

axios.get("https://www.themealdb.com/api/json/v1/1/random.php")
    .then(response => {
        const recipe = response.data.meals[0];
        console.log(recipe);
    })
    .catch(error => {
        console.error("Error fetching random recipe:", error);
    });

document.querySelector(".header img").addEventListener("click",()=>{
    window.location.href='index.html';
})

const recipePage = (recipe) => {
    document.getElementById('recipe-name').innerText = recipe.strMeal;
    const recipeContainer = createEle('div');
    recipeContainer.classList.add('recipe-container');
    parentContainer.appendChild(recipeContainer);


    const imageContainer = createEle('div');
    imageContainer.classList.add('image-container');
    recipeContainer.appendChild(imageContainer);

    const image = createEle('img');
    image.classList.add('image');
    image.src = recipe.strMealThumb;
    image.alt = recipe.strMeal;
    imageContainer.appendChild(image);

    const video = createEle('iframe');
    video.classList.add('youtube');
    let embedUrl = "";
    if (recipe.strYoutube) {
        const videoId = recipe.strYoutube.split("v=")[1];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
        video.src = embedUrl;
    }
    imageContainer.appendChild(video);

    const details = createEle('div');
    details.classList.add('details');
    recipeContainer.appendChild(details);

    const ingredients = createEle('h2');
    ingredients.innerText = "Ingredients";
    details.appendChild(ingredients);

    const ingredientsList = createEle('ul');
    for(let i = 1; i <= 20; i++){
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        if(ingredient && ingredient.trim() !== "") {
            const li = createEle('li');
            li.innerText = `${measure} ${ingredient}`;
            ingredientsList.appendChild(li);
        }
    }
    details.appendChild(ingredientsList);

    const instructions = createEle('div');
    instructions.classList.add('instructions');

    const instructionsTitle = createEle('h2');
    instructionsTitle.innerText = "Instructions";
    instructions.appendChild(instructionsTitle);

    const instructionsText = createEle('p');
    instructionsText.innerText = recipe.strInstructions;
    instructions.appendChild(instructionsText);

    recipeContainer.appendChild(instructions);
    
    return recipeContainer;
}

const getRecipeId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

const displayRecipe = async () => {
    const recipeId = getRecipeId();
    if (recipeId) {
        try {
            const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
            if (response.data.meals) {
                const recipe = response.data.meals[0];
                parentContainer.innerHTML = '';
                recipePage(recipe);
            } else {
                parentContainer.innerHTML = "<p>Recipe not found.</p>";
            }
        } catch (error) {
            console.error("Error fetching recipe:", error);
            parentContainer.innerHTML = "<p>Error fetching recipe. Please try again later.</p>";
        }
    }
}

displayRecipe();