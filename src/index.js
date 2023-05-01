import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

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
        galleryEl.innerHTML = createMarkup(response);

        Notiflix.Notify.success(
          'Hooray! We found ' + response.data.totalHits + ' images.'
        );
        bottomBarEl.classList.remove('hidden');
        let lightbox = new SimpleLightbox('.gallery a');
        galleryEl.addEventListener('click', event => event.preventDefault());
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
  return response.data.hits
    .map(hit => {
      return `<div class="photo-card">
      <a href="${hit.largeImageURL}">
        <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" /></a>
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
};

const loadMore = () => {
  page++;
  fetchPhotosData().then(response => {
    galleryEl.insertAdjacentHTML('beforeend', createMarkup(response));
    galleryEl.addEventListener('click', event => event.preventDefault());
    let lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh();

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    if (response.data.total / page < 40) {
      bottomBarEl.classList.add('hidden');
      Notiflix.Notify.failure(
        `We're sorry, but you've reached the end of search results.`
      );
    } else {
      bottomBarEl.classList.remove('hidden');
    }
  });
};

LoadBtnEl.addEventListener('click', event => {
  loadMore();
});

window.addEventListener('scroll', () => {
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight
  ) {
    loadMore();
  }
});
