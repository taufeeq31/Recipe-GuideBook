const cardContainer = document.getElementById('card-container');

const createEle = (element) => document.createElement(element);

axios.get("https://www.themealdb.com/api/json/v1/1/random.php")
    .then(response => {
        const recipe = response.data.meals[0];
        console.log(recipe);
    })
    .catch(error => {
        console.error("Error fetching random recipe:", error);
    });

const createRecipeCard = (recipe) => {
    const card = createEle('div');
    card.classList.add('card');

    // image area
    const image = createEle('img');
    image.classList.add('image');
    image.src = recipe.strMealThumb;
    image.alt = recipe.strMeal;
    card.appendChild(image);

    // info area
    const info = createEle('div');
    info.classList.add('info');
    card.appendChild(info);

    const name = createEle('div');
    name.classList.add('name');
    name.innerText = recipe.strMeal;
    info.appendChild(name);

    const region = createEle('div');
    region.classList.add('region');
    region.innerText = `Cuisine: ${recipe.strArea}`;
    info.appendChild(region);

    // Make card clickable
    card.addEventListener('click', () => {
        window.location.href = `recipe.html?id=${recipe.idMeal}`;
    });

    return card;
}

// Function to display multiple random recipes on the page
async function displayRandomRecipes(count) {
    cardContainer.innerHTML = ""; // Clear previous content
    const ids = new Set();
    let tries = 0;
    while (ids.size < count && tries < count * 3) { // Avoid infinite loop
        try {
            const response = await axios.get("https://www.themealdb.com/api/json/v1/1/random.php");
            const recipe = response.data.meals[0];
            if (!ids.has(recipe.idMeal)) {
                ids.add(recipe.idMeal);
                const card = createRecipeCard(recipe);
                cardContainer.appendChild(card);
            }
        } catch (error) {
            console.error("Error fetching random recipe:", error);
        }
        tries++;
    }
}

displayRandomRecipes(40);

//Search functionality
const searchInput = document.getElementById('search');
searchInput.addEventListener('keyup', async (event) => {
    const searchTerm = event.target.value.toLowerCase().trim();

    console.log("User is typing:", searchTerm); // This will print what the user types
    if (searchTerm === "") {
        displayRandomRecipes(40); // Reset to default if search term is empty
        return;
    } else {
        searchByName(searchTerm);
    }
})

// Search by Name
const searchByName = async (name) => {
    try {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
        if (response.data.meals) {
            cardContainer.innerHTML = ""; // Clear previous content
            response.data.meals.forEach(recipe => {
                const card = createRecipeCard(recipe);
                cardContainer.appendChild(card);
            });
        } else {
            cardContainer.innerHTML = "<p>No recipes found.</p>";
        }
    }
    catch (error) {
        console.error("Error searching for recipes:", error);
        cardContainer.innerHTML = "<p>Error fetching recipes. Please try again later.</p>";
    }
}
// on recipe page

