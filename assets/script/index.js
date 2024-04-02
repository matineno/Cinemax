'use strict';

/* Importing modules */
import moviesData from './movies.js';
import { select, listen, create } from './utils.js';

/* Constant elements */
const searchInput = select('.search-input');
const resultList = select('.result-list');
const searchButton = select('.search-button');
const movieDisplay = select('.movie-display');

/* Validating search term */
function isSearchTermValid(term) {
    return term.length >= 3;
}

/* Handling search input */
function handleSearchInput() {
    const searchTerm = searchInput.value.toLowerCase();
    if (isSearchTermValid(searchTerm)) {
        findAndListMovies(searchTerm);
    } else {
        clearResultList();
    }
}

/* Finding matching movies */
function findMatchingMovies(searchTerm) {
    return moviesData.filter(movie => {
        const title = movie.title.toLowerCase();
        return title.includes(searchTerm);
    });
}

/* Displaying movie results */
function displayMovieResults(matches) {
    resultList.innerHTML = '';
    if (matches.length > 0) {
        const limitedMatches = matches.slice(0, 5);
        const ul = create('ul');
        limitedMatches.forEach(movie => {
            const li = create('li');
            li.textContent = movie.title;
            listen('click', li, function() {
                searchInput.value = movie.title;
                findAndListMovies(movie.title);
                clearResultList();
            });
            ul.appendChild(li);
        });
        resultList.appendChild(ul);
        resultList.value = '';
    } else {
        resultList.innerHTML = '<li class="not-found">No movies found</li>';
    }
}

/* Displaying first matching movie */
function displayFirstMatchingMovie() {
    const searchTerm = searchInput.value.toLowerCase();
    const matches = findMatchingMovies(searchTerm);
    if (matches.length > 0) {
        const movie = matches[0];
        const movieHTML = createMovieHTML(movie);
        movieDisplay.innerHTML = movieHTML;
    } else {
        movieDisplay.innerHTML = '';
    }
}

/* Listing matching movies */
function findAndListMovies(searchTerm) {
    const matches = findMatchingMovies(searchTerm.toLowerCase());
    displayMovieResults(matches);
}

/* Creating movie HTML */
function createMovieHTML(movieData) {
    let genresHTML = '';
    movieData.genre.forEach(genre => {
        genresHTML += `<span class="genre" style="background-color: #24252D;">${genre}</span>`;
    });
    const yearDurationHTML = `
        <div class="year-duration">
            <div class="green-dot"></div>
            <p class="movie-year">${movieData.year}</p>
            <p class="movie-duration">${movieData.runningTime}</p>
        </div>
    `;
    return `
        <div class="movie">
            <img src="${movieData.poster}" alt="${movieData.title}" class="movie-poster">
            <div class="movie-details">
                <h2 class="movie-title">${movieData.title}</h2>
                ${yearDurationHTML}
                <p class="movie-description">${movieData.description}</p>
                <div class="movie-genre">${genresHTML}</div>
            </div>
        </div>
    `;
}

/* Clearing result list */
function clearResultList() {
    resultList.innerHTML = '';
}

/* Event listeners */
listen('input', searchInput, handleSearchInput);
listen('click', searchButton, displayFirstMatchingMovie);
listen('click', searchButton, () => {
    handleSearchInput();
    clearResultList();
});