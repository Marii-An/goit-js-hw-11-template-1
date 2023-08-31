import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getImages } from './api';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  searchButton: document.querySelector('#submit'),
  searchBox: document.querySelector('.search-box'),
  gallery: document.querySelector('.gallery'),
  loadButton: document.querySelector('.load-more'),
};

let currentPage = 1;
let query = '';

refs.loadButton.classList.add('is-hidden');

refs.form.addEventListener('submit', searchImages);

async function searchImages(event) {
  event.preventDefault();
  refs.gallery.innerHTML = '';
  currentPage = 1;
  query = refs.searchBox.value.trim();

  try {
    const getData = await getImages(query);
    const { hits, totalHits } = getData;

    if (hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      refs.loadButton.classList.add('is-hidden');
      return;
    }
    Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);

    refs.gallery.insertAdjacentHTML('beforeend', createGallery(hits));
    refs.loadButton.classList.remove('is-hidden');

    new SimpleLightbox('.link-lightbox', {
      captionsData: 'alt',
      captionDelay: 250,
      captions: true,
    }).refresh();
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure('Error fetching images');
  }
}

function createGallery(hits) {
  return hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a href="${largeImageURL}" class="link-lightbox">
        <div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info overlay">
          <p class="info-item">
            <b>Likes ${likes}</b>
          </p>
          <p class="info-item">
            <b>Views ${views}</b>
          </p>
          <p class="info-item">
            <b>Comments ${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads ${downloads}</b>
          </p>
        </div> 
      </div>
      </a>`;
      }
    )
    .join(' ');
}

refs.loadButton.addEventListener('click', clickOnLoad);

async function clickOnLoad() {
  currentPage += 1;

  try {
    const { hits } = await getImages(query, currentPage);

    if (hits.length === 0) {
      refs.loadButton.classList.add('is-hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      return;
    }

    refs.gallery.insertAdjacentHTML('beforeend', createGallery(hits));

    if (hits.length < perPage) {
      refs.loadButton.classList.add('is-hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      new SimpleLightbox('.link-lightbox', {
        captionsData: 'alt',
        captionDelay: 250,
        captions: true,
      }).refresh();
    }
  } catch (error) {
    console.error(error);
    Notiflix.Notify.failure('Error fetching images');
  }
}
