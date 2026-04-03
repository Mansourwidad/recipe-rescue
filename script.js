// RECIPE DATABASE
const recipes = [
    {
        name: "🍅 Tomato Pasta",
        ingredients: ["pasta", "tomatoes", "garlic", "onion"],
        instructions: "Boil pasta. Sauté garlic and onion, add tomatoes, simmer. Mix with pasta."
    },
    {
        name: "🥚 Cheesy Omelette",
        ingredients: ["eggs", "cheese", "butter", "salt"],
        instructions: "Whisk eggs. Melt butter in pan. Pour eggs, add cheese. Fold and serve."
    },
    {
        name: "🥗 Simple Salad",
        ingredients: ["lettuce", "tomatoes", "cucumber", "olive oil"],
        instructions: "Chop vegetables. Toss with olive oil and salt."
    },
    {
        name: "🍚 Fried Rice",
        ingredients: ["rice", "eggs", "soy sauce", "onion", "garlic"],
        instructions: "Scramble eggs. Sauté onion and garlic. Add rice and soy sauce. Mix in eggs."
    },
    {
        name: "🥪 Grilled Cheese",
        ingredients: ["bread", "cheese", "butter"],
        instructions: "Butter bread. Put cheese between slices. Grill until golden brown."
    },
    {
        name: "🍌 Banana Toast",
        ingredients: ["bread", "banana", "butter"],
        instructions: "Toast bread. Mash banana on top. Add butter if desired."
    },
    {
        name: "🥣 Veggie Soup",
        ingredients: ["carrots", "onion", "garlic", "tomatoes", "vegetable broth"],
        instructions: "Sauté vegetables. Add broth. Simmer for 20 minutes."
    },
    {
        name: "🍝 Garlic Butter Noodles",
        ingredients: ["pasta", "garlic", "butter", "parmesan"],
        instructions: "Cook pasta. Sauté garlic in butter. Toss with pasta and parmesan."
    }
];

function getAllIngredients() {
    const ingredientsSet = new Set();
    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ing => {
            ingredientsSet.add(ing);
        });
    });
    return Array.from(ingredientsSet).sort();
}

function displayIngredients() {
    const ingredientsList = document.getElementById('ingredientsList');
    const allIngredients = getAllIngredients();
    
    ingredientsList.innerHTML = '';
    allIngredients.forEach(ingredient => {
        const div = document.createElement('div');
        div.className = 'ingredient-item';
        div.innerHTML = `
            <input type="checkbox" id="ing_${ingredient}" value="${ingredient}">
            <label for="ing_${ingredient}">${ingredient}</label>
        `;
        ingredientsList.appendChild(div);
    });
}

function getSelectedIngredients() {
    const checkboxes = document.querySelectorAll('#ingredientsList input:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

function findRecipes(selectedIngredients) {
    const results = [];
    
    recipes.forEach(recipe => {
        const missing = [];
        const matched = [];
        
        recipe.ingredients.forEach(ing => {
            if (selectedIngredients.includes(ing)) {
                matched.push(ing);
            } else {
                missing.push(ing);
            }
        });
        
        if (matched.length > 0) {
            results.push({
                ...recipe,
                matchedCount: matched.length,
                totalCount: recipe.ingredients.length,
                missingIngredients: missing
            });
        }
    });
    
    results.sort((a, b) => b.matchedCount - a.matchedCount);
    return results;
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    
    if (results.length === 0) {
        resultsDiv.innerHTML = '<div class="no-results">😕 No recipes found. Try selecting different ingredients!</div>';
        return;
    }
    
    resultsDiv.innerHTML = `<h2>📋 You can make these (${results.length} recipes):</h2>`;
    
    results.forEach(recipe => {
        const percent = Math.round((recipe.matchedCount / recipe.totalCount) * 100);
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.innerHTML = `
            <h3>${recipe.name} <span style="font-size:0.8rem; color:#667eea;">(${percent}% match)</span></h3>
            <p><strong>You have:</strong> ${recipe.matchedCount}/${recipe.totalCount} ingredients</p>
            ${recipe.missingIngredients.length > 0 ? 
                `<p class="missing"><strong>Missing:</strong> ${recipe.missingIngredients.join(', ')}</p>` : 
                '<p style="color:#28a745;">✅ You have everything! Make this now!</p>'}
            <p><strong>Instructions:</strong> ${recipe.instructions}</p>
        `;
        resultsDiv.appendChild(card);
    });
}

function searchRecipes() {
    const selected = getSelectedIngredients();
    if (selected.length === 0) {
        document.getElementById('results').innerHTML = '<div class="no-results">✨ Select some ingredients first!</div>';
        return;
    }
    const results = findRecipes(selected);
    displayResults(results);
}

document.addEventListener('DOMContentLoaded', () => {
    displayIngredients();
    document.getElementById('findRecipesBtn').addEventListener('click', searchRecipes);
});
