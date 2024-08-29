const searchInput = document.getElementById('searchInput');
const itemList = document.getElementById('itemList');
const countryInfo = document.getElementById('countryInfo');
const countryDetails = document.getElementById('countryDetails');
const clearInput = document.getElementById('clearInput');
// const submitBtn=document.getElementById('submitBtn');
let allItems=[];
let currentIndex= -1;
let selectedCountry=null;

async function fetchData() {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();

    allItems=data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function populateList(items) {
  itemList.innerHTML = ''; // Clear the list first


  items.forEach((item, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = item.name.common; 
    listItem.className = 'p-3 bg-gray-100 cursor-pointer'; 
    listItem.tabIndex =0;
    listItem.dataset.index=index;
    listItem.addEventListener('click', () => {
        searchInput.value = listItem.textContent;
        itemList.classList.add('hidden');
        countryInfo.classList.remove('hidden');
        selectedCountry = item; 
        displayCountryInfo(item);
      });
      
      listItem.addEventListener('mouseover', () => {
        removeHighlight();
        currentIndex = index;
        listItem.classList.add('bg-blue-200');
    });
    itemList.appendChild(listItem);
  });
}

function displayCountryInfo(country) {
    if (country) {
      const capital = country.capital ? country.capital[0] : 'N/A';
      const region = country.region;
      const population = country.population.toLocaleString();
  
      countryDetails.innerHTML = `
        <strong>Country:</strong> ${country.name.common}<br>
        <strong>Capital:</strong> ${capital}<br>
        <strong>Region:</strong> ${region}<br>
        <strong>Population:</strong> ${population}
      `;
  
      countryInfo.classList.remove('hidden');
    } else {
      alert('Please select a country.');
    }
  }
  

function removeHighlight() {
    const items = itemList.querySelectorAll('li');
    items.forEach(item => {
        item.classList.remove('bg-blue-200');
    });
}

searchInput.addEventListener('input', function() {
  const query = this.value.toLowerCase();

  if (query) {
    itemList.classList.remove('hidden');
    searchList.classList.add('hidden');
    countryInfo.classList.add('hidden')
    clearInput.classList.remove('hidden');

const filteredItems=allItems.filter(item=> item.name.common.toLowerCase().startsWith(query)).slice(0,5);
populateList(filteredItems);
  } else {
    itemList.classList.add('hidden');
    searchList.classList.remove('hidden');
    clearInput.classList.add('hidden');
    countryInfo.classList.add('hidden');
  }
});

searchInput.addEventListener('keydown', function (e) {
    const items = itemList.querySelectorAll('li');
    if (e.key === 'ArrowDown') {
        currentIndex = (currentIndex + 1) % items.length;
        removeHighlight();
        items[currentIndex].classList.add('bg-blue-200');
        items[currentIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        removeHighlight();
        items[currentIndex].classList.add('bg-blue-200');
        items[currentIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && currentIndex > -1) {
        searchInput.value = items[currentIndex].textContent;
        selectedCountry =allItems.find(item=>item.name.common===items[currentIndex].textContent);
        displayCountryInfo(selectedCountry);
        itemList.classList.add('hidden');
        currentIndex = -1;
    }
});

document.getElementById('clearInput').addEventListener('click', function() {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = ''; // Clear the input field
    document.getElementById('itemList').classList.add('hidden'); // Hide the suggestion list
    clearInput.classList.add('hidden');
    searchList.classList.remove('hidden');
    countryInfo.classList.add('hidden');
});

// submitBtn.addEventListener('click', function() {
//     displayCountryInfo(selectedCountry); // Display the info of the selected country on button click
//   });

// Fetch data when the page loads
fetchData();
