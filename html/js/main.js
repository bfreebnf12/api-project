 let mainContainer;
 let ascendingOrder = true;
 let favsContainer;
 let mainCards = [];


 //Define sort
 const sort = [
     { label: 'Ascending', value: 'asc' },
     { label: 'Descending', value: 'desc' },
     // Add more sorting options as needed
 ];

 // Define the button element
 const button = document.getElementById('Toggle-Sort');
 let cardContainer;
 let currentCardData;

 function sortCards(cards, direction) {
     return cards.sort((a, b) => {
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

     // Event listener for the "Favorite" button
     favoriteButton.addEventListener('click', () => {
         toggleFavorite(cardContainer, favoriteButton, cardData);
         addToFavorites(cardData.id.toString());
         alert(`You favorited ${cardData.name}`);
     });

     // Event listener for the "Unfavorite" button
     unfavoriteButton.addEventListener('click', () => {
         toggleFavorite(cardContainer, unfavoriteButton, cardData);
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
             if (Array.isArray(dogData) && dogData.length > 0) {
                 dogData.forEach((dog) => {
                     card = createDogCard(dog);
                     // Append the card to the dog container
                     const dogContainer = document.querySelector('.dogContainer');
                     dogContainer.appendChild(card);
                 });

                 // Calculate the total dog age here
                 const totalDogAge = dogData.reduce((total, dog) => total + (dog.age || 0), 0);
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


 // Attach click event listener to the toggle button
 const toggleSortButton = document.getElementById('Toggle-Sort');
 toggleSortButton.addEventListener('click', () => {
     // Toggle the sorting direction
     ascendingOrder = !ascendingOrder;

     // Get all cards from the main container
     let mainContainer = document.querySelector('.dogContainer');
     favsContainer = document.getElementById('favsContainer');
     let mainCards = Array.from(mainContainer.querySelectorAll('.card'));
     const sortBtns = document.querySelectorAll('.sort');

     console.log(mainContainer.children)
         // Inside the event listener, you can now call sortCards
     mainCards = Array.from(mainContainer.children).filter(
         (item) => item.tagName.toLowerCase() === 'div'
     );
     let favCards = Array.from(favsContainer.children).filter(
         (item) => item.tagName.toLowerCase() === 'div'
     );

     sortBtns.forEach((button) => {
         const parent =
             button.addEventListener('click', (e) => {
                 const arrToSort = e.target.dataset.arr === 'main' ? mainCards : favCards;
                 const parent =
                     e.target.dataset.arr === 'main' ? mainContainer : favsContainer;
                 const direction = e.target.dataset.sort;
                 const sortedItems = sortCards(arrToSort, direction);

                 // Clear the parent container
                 while (parent.firstChild) {
                     parent.removeChild(parent.firstChild);
                 }

                 // Append the sorted cards to the parent container
                 sortedItems.forEach((item) => parent.appendChild(item));
             });
     });


     // sortedItems.forEach((item) => parent.append(item));
 });


 /*mainCards = Array.from(mainContainer.children).filter(
     (item) => item.tagName.toLowerCase() === 'div'
 );
 favCards = Array.from(favsContainer.children).filter(
     (item) => item.tagName.toLowerCase() === 'div'
 ); */


 // Sort the cards and pass the sorting direction
 sortCards(mainCards, ascendingOrder ? 'asc' : 'desc');



 // Toggle the sorting direction
 ascendingOrder = !ascendingOrder;

 // Get all cards from the main container
 mainContainer = document.querySelector('.dogContainer');
 mainCards = Array.from(mainContainer.querySelectorAll('.card'));

 // Sort the cards and pass the sorting direction
 sortCards(mainCards, ascendingOrder ? 'asc' : 'desc');

 // Clear both containers
 let favCards = [];


 // Separate the sorted cards into their respective containers
 sort.forEach(card => {
     const parent =
         //console.log(button);
         button.addEventListener('click', (e) => {
             const arrToSort = e.target.dataset.arr === 'main' ? mainCards : favCards;
             const parent =
                 e.target.dataset.arr === 'main' ? mainContainer : favsContainer;
             const direction = e.target.dataset.sort;
             const sortedItems = sortCards(arrToSort, direction);
             console.log(sortedItems);
             sortedItems.forEach((item) => parent.append(item));
         });
 });


 // Attach click event listener to the toggle button

 toggleSortButton.addEventListener('click', () => {
     sortCards();
 });

 // Function to toggle favorite/unfavorite
 function toggleFavorite(card, button, cardData) {
     const favoritesContainer = document.getElementById('favs');
     const mainContainer = document.querySelector('.dogContainer');

     if (button.innerText === 'Favorite') {
         if (mainContainer.contains(card)) {
             mainContainer.removeChild(card);
         } else if (favoritesContainer.contains(card)) {
             favoritesContainer.removeChild(card);
         }

         favoritesContainer.appendChild(card);
         button.innerText = 'Unfavorite';
         cardData.inFavorites = true;
     } else if (button.innerText === 'Unfavorite') {
         if (favoritesContainer.contains(card)) {
             favoritesContainer.removeChild(card);
         } else if (mainContainer.contains(card)) {
             mainContainer.removeChild(card);
         }

         mainContainer.appendChild(card);
         button.innerText = 'Favorite';
         cardData.inFavorites = false;
     }
 }

 // Function to add to favorites
 function addToFavorites(dogId) {
     localStorage.setItem(`${dogId}`, "true");
 }

 // Function to remove from favorites
 function removeFromFavorites(dogId) {
     localStorage.removeItem(`${dogId}`);
 }

 // When the user clicks the "Favorite" button
 button.addEventListener('click', () => {
     // Toggle between "Favorite" and "Unfavorite" states
     if (button.innerText === 'Favorite') {
         // Handle the "Favorite" action
         toggleFavorite(cardContainer, button, currentCardData); // Pass `currentCardData`
         addToFavorites(currentCardData.id.toString());
         alert(`You favorited ${currentCardData.name}`);
     } else {
         // Handle the "Unfavorite" action
         toggleFavorite(cardContainer, button, currentCardData); // Pass `currentCardData`
         removeFromFavorites(currentCardData.id.toString());
     }
 });


 const targetClass = 'card';