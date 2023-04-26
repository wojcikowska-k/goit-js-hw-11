import axios from 'axios';

const inputEl = document.querySelector('input[name="searchQuery"]');
const btnEl = document.querySelector('button[type="submit"]');

const API_URL = 'https://pixabay.com/api/?';
const API_KEY = '35750210-01538b5c80567ccad47fd3a82';

const fetchPhotosData = async () => {
  return await axios.get(API_URL, {
    params: {
      key: API_KEY,
      q: 'cat',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    },
  });
};

const createGallery = () => {
  fetchPhotosData()
    .then(response => console.log(response.data.hits))
    .catch(error => console.log('No hits'));
};
btnEl.addEventListener('click', event => {
  event.preventDefault();
  createGallery();
});
