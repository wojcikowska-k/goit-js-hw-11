import axios from 'axios';
import Notiflix from 'notiflix';

const inputEl = document.querySelector('input[name="searchQuery"]');
const btnEl = document.querySelector('button[type="submit"]');
const galleryEl = document.querySelector('.gallery');
const bottomBarEl = document.querySelector('.bottom-bar');
const LoadBtnEl = document.querySelector('.load-more');

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
      page: page,
      per_page: 40,
    },
  });
};

const createGallery = () => {
  page = 1;
  fetchPhotosData()
    .then(response => {
      if (response.data.hits.length > 0 && inputEl.value !== '') {
        clear();
        createMarkup(response);

        Notiflix.Notify.success(
          'Hooray! We found ' + response.data.totalHits + ' images.'
        );
        bottomBarEl.classList.remove('hidden');
      } else {
        Notiflix.Notify.failure(
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
        <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
        <div class="info">
          <p class="info-item"><b>Likes</b>
            ${hit.likes}
          </p>
          <p class="info-item"><b>Views</b>
            ${hit.views}
          </p>
          <p class="info-item"><b>Comments</b>
            ${hit.comments}
          </p>
          <p class="info-item"><b>Downloads</b>
            ${hit.downloads}
          </p>
        </div>
      </div>`;
    })
    .join('');

  galleryEl.innerHTML = markup;
};

const loadMore = () => {
  page++;
  fetchPhotosData().then(response => {
    galleryEl.insertAdjacentHTML('beforeend', createMarkup(response));
  });
};

LoadBtnEl.addEventListener('click', event => {
  event.preventDefault();
  loadMore();
});
