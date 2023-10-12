let mainContainer;
let ascendingOrder = true;
let favsContainer;
let mainCards = [];
let cards = [];
let favoriteCardIds = [];

// Define the button element
const button = document.getElementById('Toggle-Sort');
let cardContainer;
let currentCardData = null;

function sortCards(cards, direction) {


    return Array.from(cards).sort((a, b) => {
        const nameA = a.querySelector('.dog-name').innerText.toLowerCase();
        const nameB = b.querySelector('.dog-name').innerText.toLowerCase();

        if (direction === 'asc') {
            return nameA.localeCompare(nameB);
        } else {
            return nameB.localeCompare(nameA);
        }
    });
}

function moveCardToFavorites(cardContainer) {
    const favsContainer = document.getElementById('favsContainer');
    favsContainer.appendChild(cardContainer);
}

function moveCardToMain(cardContainer) {
    const mainContainer = document.getElementById('mainContainer');
    if (mainContainer) {
        mainContainer.appendChild(cardContainer);
    }
}


function createDogCard(cardData) {
    const cardContainer = document.createElement('div');
    cardContainer.setAttribute('class', 'card');

    const dogInfoContainer = document.createElement('div');
    dogInfoContainer.setAttribute('class', 'dog-info');

    // Create an image element for the dog's picture
    const image = document.createElement('img');

    // Check if photoUrl exists before using toLowerCase
    if (cardData.photoUrl) {
        image.src = cardData.photoUrl.toLowerCase();
    }

    image.alt = cardData.name;

    // Create a div for the dog's name
    const name = document.createElement('div');
    name.innerText = `Name: ${cardData.name}`;
    name.classList.add('dog-name');

    // Create a div for the dog's breed
    const breed = document.createElement('div');
    breed.innerText = `Breed: ${cardData.breed}`;
    breed.style.marginBottom = '10px';

    // Create a button for "Favorite" (only in the main collection)
    const favoriteButton = document.createElement('button');
    favoriteButton.innerText = 'Favorite';

    // Create a button for "Unfavorite" (only in the favorite collection)
    const unfavoriteButton = document.createElement('button');
    unfavoriteButton.innerText = 'Unfavorite';

    // Append elements to dogInfoContainer
    dogInfoContainer.appendChild(image);
    dogInfoContainer.appendChild(name);
    dogInfoContainer.appendChild(breed);

    // Append elements to cardContainer
    cardContainer.appendChild(dogInfoContainer);

    // Append "Favorite" or "Unfavorite" button based on the collection
    if (cardData.favorite) {
        cardContainer.appendChild(unfavoriteButton); // In the favorite collection
    } else {
        cardContainer.appendChild(favoriteButton); // In the main collection
    }


    // Event listener for the "Favorite" button
    favoriteButton.addEventListener('click', () => {
        toggleFavorite(cardContainer, favoriteButton, cardData);
        addToFavorites(cardData['_id']);
        moveCardToFavorites(cardContainer);
    });

    // Event listener for the "Unfavorite" button
    unfavoriteButton.addEventListener('click', () => {
        toggleFavorite(cardContainer, unfavoriteButton, cardData);
        removeFromFavorites(cardData['_id']);
        moveCardToMain(cardContainer); // Move the card to the main collection
    });


    // Append the card to the dog container
    const dogContainer = document.querySelector('.dogContainer');
    dogContainer.appendChild(cardContainer);

    // Event listener for the "Favorite" button
    favoriteButton.addEventListener('click', () => {
        toggleFavorite(cardContainer, favoriteButton, cardData);
        addToFavorites(cardData['_id']);
        moveCardToFavorites(cardContainer);
    });
    unfavoriteButton.addEventListener('click', () => {
        toggleFavorite(cardContainer, unfavoriteButton, cardData);
        removeFromFavorites(cardData['_id']);
        moveCardToMain(cardContainer); // Move the card to the main collection
    });


    function addToFavorites(cardId) {
        favoriteCardIds.push(cardId);
    }

    // Event listener for the "Favorite" button inside createDogCard
    favoriteButton.addEventListener('click', (e) => {
        const favsContainer = document.getElementById('favsContainer');
        const cardToMove = e.target.parentElement;
        favsContainer.append(cardToMove);

        // Move the card to the favorites container
        if (cardData.favorite) {
            console.log(favsContainer);
            favsContainer.appendChild(cardContainer);
        }
    });



    return cardContainer;
}

function updateFavoriteButtonState() {
    // Update buttons in the favorites collection to "Unfavorite"
    const favCardsContainer = document.getElementById('favsContainer');
    const favoriteButtonsInFavs = favCardsContainer.querySelectorAll('.card button');
    favoriteButtonsInFavs.forEach((button) => {
        button.innerText = 'Unfavorite';
    });

    // Update buttons in the main collection to "Favorite"
    const mainCardsContainer = document.querySelector('.dogContainer');
    const favoriteButtonsInMain = mainCardsContainer.querySelectorAll('.card button');
    favoriteButtonsInMain.forEach((button) => {
        button.innerText = 'Favorite';
    });
}

// Call the function when initially loading the page
updateFavoriteButtonState();

function toggleFavorite(cardContainer, button, cardData) {
    if (cardData.favorite) {
        cardData.favorite = false;
        button.innerText = 'Favorite';
        cardContainer.classList.remove('favorited');
    } else {
        cardData.favorite = true;
        button.innerText = 'Unfavorite';
        cardContainer.classList.add('favorited');
    }

    // After toggling the favorite status, update the favorite button states
    updateFavoriteButtonState();
}

let dogAge = 0;

// Fetch dog data from the API
function getDogs() {
    console.log('Fetching dog data...');

    fetch('https://freerandomapi.cyclic.app/api/v1/dogs')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            const dogData = data.data;

            // Call the function to create dog cards for each dog in the data
            if (dogData) {
                dogData.forEach((dog) => {
                    card = createDogCard(dog);
                    // Append the card to the dog container
                    const dogContainer = document.querySelector('.dogContainer');
                    dogContainer.appendChild(card);

                    // Push the created card into the mainCards array
                    mainCards.push(card);
                });

                // Add card data to the 'cards' array

                // Sort the cards in ascending order
                sortCards(mainCards, 'asc');
                setSortBtnListeners();

                // Calculate the total dog age here
                const totalDogAge = dogData.reduce(
                    (total, dog) => total + (dog.age || 0),
                    0
                );
                //Displaythe total dog age on the page
                const totalDogAgeElement = document.getElementById('totalDogAge');
                totalDogAgeElement.textContent = `Total Dog Age: ${totalDogAge}`;
            } else {
                console.error('No valid dog data found.');
            }
        })
        .catch((err) => {
            console.error('Error fetching dog data:', err);
        });
}

// Call getDogs to fetch and create dog cards
getDogs();




// Add event listeners to each sorting button
const setSortBtnListeners = () => {
    const sortButtons = document.querySelectorAll('.sort');
    sortButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            // Extract the necessary information from the button's data attributes
            const mainCardsContainer = document.querySelector('.dogContainer');
            const mainCardsArr = mainCardsContainer.querySelectorAll('.card');
            console.log(mainCardsArr);
            const favCardsContainer = document.getElementById('favsContainer');
            const favCardsArr = favCardsContainer.querySelectorAll('.card');
            console.log(favCardsArr);
            const arrToSort = e.target.dataset.arr; // 'main' or 'favs'
            const sortingDirection = e.target.dataset.sort; // 'asc' or 'desc'

            // Call the sortCards function with the selected array and sorting direction
            const params =
                arrToSort === 'main' ? [mainCardsArr, mainCardsContainer] : [favCardsArr, favCardsContainer];

            const sortedItems = sortCards(params[0], sortingDirection);
            // Append the sorted cards to the parent container
            sortedItems.forEach((item) => params[1].append(item));
        });
    });

    // sortedItems.forEach((item) => parent.append(item));
};