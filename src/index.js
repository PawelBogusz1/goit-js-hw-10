
import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const countryList = document.querySelector('.country-list');
const form = document.querySelector('#search-box');
const countryInfo = document.querySelector('.country-info');

const BASE_URL = 'https://restcountries.com/v3.1/name/';
const fields = 'fields=name,capital,population,flags,languages';

form.addEventListener('input', debounce(onFormInput, DEBOUNCE_DELAY));

function onFormInput() {
  const name = form.value.trim();
  if (name === '') {
    return (countryList.innerHTML = ''), (countryInfo.innerHTML = '');
  }
  fetchCountries(name)
    .then(countries => {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      if (countries.length === 1) {
        countryList.insertAdjacentHTML(
          'beforeend',
          createCountryList(countries)
        );
        countryInfo.insertAdjacentHTML(
          'beforeend',
          createCountryInfo(countries)
        );
      } else if (countries.length >= 10) {
              return Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else {
        countryList.insertAdjacentHTML(
          'beforeend',
          createCountryList(countries)
        );
      }
      })
      .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        clearInput();
      })

function createCountryList(countries) {
  const result = countries
    .map(({ name, flags }) => {
      return `
                <img src="${flags.svg}" alt="Flag of ${name.official}" width = 40px height = 40px>
                <h2>${name.official}</h2>
            `;
    })
    .join('');
  return result;
}

function createCountryInfo(countries) {
  const result = countries
    .map(({ capital, population, languages }) => {
      return `<p><b>Capital: </b>${capital}</p>
          <p><b>Population: </b>${population}</p>
          <p><b>Languages: </b>${Object.values(languages).join(', ')}</p>`;
    })
    .join('');

    return result;
  }}
