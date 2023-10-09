let mainContainer;
let ascendingOrder = true;
let favsContainer;
let mainCards = [];
let cards = [];

//Define sort
const sort = [
    { label: 'Ascending', value: 'asc' },
    { label: 'Descending', value: 'desc' },
    // Add more sorting options as needed
];

const sampleData1 = { id: 1, name: 'Dog 1' };

// Push the sample data to the cards array
cards.push(sampleData1);

// Define the button element
const button = document.getElementById('Toggle-Sort');
let cardContainer;
let currentCardData = null;

function sortCards(cards, direction) {
    // console.log(cards);
    // if (!cards.length) {
    //   console.error('Invalid or empty cards array:', cards);
    //   return;
    // }

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

function createDogCard(cardData) {
    console.log(cardData[`_id`]);
    if (cardData.age) {
        dogAge += cardData.age;
    }
    cardContainer = document.createElement('div'); // Assign value to cardContainer
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
    name.classList.add('dog-name'); // Add a class for sorting

    // Create a div for the dog's breed
    const breed = document.createElement('div');
    breed.innerText = `Breed: ${cardData.breed}`;
    breed.style.marginBottom = '10px';

    // Create two button elements for "Favorite" and "Unfavorite"
    const favoriteButton = document.createElement('button');
    favoriteButton.innerText = 'Favorite';

    const unfavoriteButton = document.createElement('button');
    unfavoriteButton.innerText = 'Unfavorite';

    // Append elements to dogInfoContainer
    dogInfoContainer.appendChild(image);
    dogInfoContainer.appendChild(name);
    dogInfoContainer.appendChild(breed);

    // Append elements to cardContainer
    cardContainer.appendChild(dogInfoContainer);
    cardContainer.appendChild(favoriteButton);
    cardContainer.appendChild(unfavoriteButton);

    // Append the card to the dog container
    const dogContainer = document.querySelector('.dogContainer');
    dogContainer.appendChild(cardContainer);

    // Event listener for the "Favorite" button inside createDogCard
    favoriteButton.addEventListener('click', () => {
        currentCardData = cardData; // Update currentCardData
        toggleFavorite(cardContainer, favoriteButton, cardData);
        addToFavorites(cardData.id.toString());
        alert(`You favorited ${cardData.name}`);
    });

    // Event listener for the "Unfavorite" button inside createDogCard
    unfavoriteButton.addEventListener('click', () => {
        currentCardData = cardData; // Update currentCardData
        toggleFavorite(cardContainer, unfavoriteButton, cardData);
        alert(`You unfavorited ${cardData.name}`);
    });

    return cardContainer;
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
                console.log('Total Dog Age:', totalDogAge); // Log the total dog age once

                // Log or display the total dog age
                console.log('Total Dog Age:', totalDogAge);
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