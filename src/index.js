import axios from 'axios';

const inputEl = document.querySelector('input[name="searchQuery"]');
const btnEl = document.querySelector('button[type="submit"]');
const galleryEl = document.querySelector('.gallery');

const API_URL = 'https://pixabay.com/api/?';
const API_KEY = '35750210-01538b5c80567ccad47fd3a82';

const fetchPhotosData = async () => {
  return await axios.get(API_URL, {
    params: {
      key: API_KEY,
      q: inputEl.value,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    },
  });
};

const createGallery = () => {
  fetchPhotosData()
    .then(response => {
      if (response && inputEl.value !== '') {
        clear();
        createMarkup(response);
      } else {
        console.log(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
    })
    .catch(error => console.log(error));
};
btnEl.addEventListener('click', event => {
  event.preventDefault();
  createGallery();
});

const clear = () => {
  galleryEl.innerHTML = ``;
};

const createMarkup = response => {
  const markup = response.data.hits
    .map(hit => {
      return `<div class="photo-card">
        <img src="${hit.previewURL}" alt="${hit.tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>${hit.likes}</b>
          </p>
          <p class="info-item">
            <b>${hit.views}</b>
          </p>
          <p class="info-item">
            <b>${hit.comments}</b>
          </p>
          <p class="info-item">
            <b>${hit.downloads}</b>
          </p>
        </div>
      </div>`;
    })
    .join('');

  galleryEl.innerHTML = markup;
};
