const searchInput = document.getElementById("my-search");
const mealContainer = document.querySelector(".meal-container");
const favMealContainer = document.querySelector(".fav-meal-list");

const popup_container = document.querySelector('.pop-up-container');
const close_popup_btn = document.querySelector('.pop-up > i');
const popup = document.querySelector('.pop-up-inner');

fetchFavMeals();
async function getMeal(searchValue) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`
  );
  const resp = await response.json();
  const meals = resp.meals;
  return meals;
}
async function getMealById(id) {
  const resp = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const respData = await resp.json();
  const meal = respData.meals[0];
  return meal;
}
//onclick="showMealPopup(${meal.strMeal})"
function showMeal(meal) {
  const meal_card = document.createElement("div");
  meal_card.classList.add("meal-card");
  meal_card.innerHTML = `
<div class="card m-4" style="width: 16rem;">
                                <img src="${meal.strMealThumb}" class="card-img-top" alt="...">
                                <div class="card-body">
                                    <h5 class="card-title">${meal.strMeal}</h5>
                                <button class="btn btn-primary more-info" >More information</button>
                                    <i class="btn fa-regular fa-heart  m-1"></i>
                                </div>
                            </div>
`;
  const btn = meal_card.querySelector(".fa-heart");
  btn.addEventListener("click", () => {
    if (btn.classList.contains("fa-regular")) {
      btn.setAttribute("class", "fa-solid btn  fa-heart  m-1");
      addMealId(meal.idMeal);
    } else {
      btn.setAttribute("class", "btn fa-regular fa-heart  m-1");
      removeMealId(meal.idMeal);
    }
    fetchFavMeals();
  });
  mealContainer.appendChild(meal_card);
  moreInfo = meal_card.querySelector(".more-info");
  meal_card.querySelector(".more-info").addEventListener("click",()=>{
    showMealPopup(meal);
  })
}
function addMealId(mealID) {
  const mealIds = getMealId();
  localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealID]));
}

function removeMealId(mealID) {
  const mealIds = getMealId();
  localStorage.setItem(
    "mealIds",
    JSON.stringify(mealIds.filter((id) => id !== mealID))
  );
}

function getMealId() {
  const mealIds = JSON.parse(localStorage.getItem("mealIds"));

  return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals() {
  favMealContainer.innerHTML = "";

  const mealsIds = getMealId();
  const meals = [];
  for (let i = 0; i < mealsIds.length; i++) {
    const mealID = mealsIds[i];
    meal = await getMealById(mealID);
    showFavMeal(meal);
    meals.push(meal);
  }
}

function showFavMeal(meal) {
  const fav_meals = document.createElement("div");
  fav_meals.innerHTML = `
    <div class="card m-3" style="width: 16rem;">
                            <img src="${meal.strMealThumb}" class="card-img-top" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${meal.strMeal}</h5>

                                <i class="btn fa-solid fa-x "></i>
                            </div>
                        </div>
    `;
  const x = fav_meals.querySelector(".fa-x");
  x.addEventListener("click", () => {
    removeMealId(meal.idMeal);

    const heart_btns = document.querySelectorAll(".fa-heart");
    heart_btns.forEach((heart_btn) => {
      heart_btn.setAttribute("class", "fa-regular fa-heart");
    });

    fetchFavMeals();
  });
  favMealContainer.appendChild(fav_meals);
}

searchInput.addEventListener("keyup", async (e) => {
  if (e.target.value !== "") {
    mealContainer.innerHTML = "";
    const searchVal = searchInput.value;
    const meals = await getMeal(searchVal);

    if (meals) {
      meals.forEach((meal) => {
        showMeal(meal);
      });
      document.querySelector(".heading").innerText = "Search Results...";
    }
  } else {
    document.querySelector(".heading").innerText = "No Meals Found";
    mealContainer.innerHTML = "";
  }
});
close_popup_btn.addEventListener("click", () => {
  popup_container.style.display = "none";
});
function showMealPopup(meal) {
  popup.innerHTML = "";

  const newPopup = document.createElement("div");
  newPopup.classList.add("pop-up-inner");

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  newPopup.innerHTML = `
        <div class="left">
            <div class="card m-3" style="width: 16rem;">
                            <img src="${
                              meal.strMealThumb
                            }" class="card-img-top" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${meal.strMeal}</h5>
                                <i class="btn fa-solid fa-x  m-2 "></i>
                            </div>
                        </div>
        </div>
        <div class="right">
            <div>
                <h2>Instructions</h2>
                <p class="meal-info">${meal.strInstructions}</p>
            </div>
            <div>
                <h2>Ingredients / Measures</h2>
                <ul>
                    ${ingredients.map((e) => `<li>${e}</li>`).join("")}
                </ul>
            </div>
        </div>
    `;
  popup.appendChild(newPopup);
  popup_container.style.display = "flex";
}



