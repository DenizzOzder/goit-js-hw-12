import { fetchImages } from './js/pixabay-api.js';
import {
  renderGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreBtn,
  hideLoadMoreBtn,
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('#search-form');
const input = document.querySelector('#search');
const loadMoreBtn = document.getElementById('loadMoreBtn');

let searchQuery = '';
let page = 1;
let perPage = 40;
let totalHits = 0;

form.addEventListener('submit', async event => {
  event.preventDefault();

  searchQuery = input.value.trim();
  if (!searchQuery) return;

  page = 1;
  clearGallery();
  hideLoadMoreBtn();
  showLoader();

  try {
    const data = await fetchImages(searchQuery, page, perPage);
    const images = data.hits;
    totalHits = data.totalHits;

    if (images.length === 0) {
      iziToast.info({
        title: 'No Results',
        message: 'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      hideLoader();
      return;
    }

    renderGallery(images);
    hideLoader();

    const totalPages = Math.ceil(totalHits / perPage);
    if (page >= totalPages) {
      hideLoadMoreBtn();
    } else {
      showLoadMoreBtn();
    }

    perPage = 20;
  } catch (error) {
    console.error('Error fetching images:', error);
    iziToast.error({
      title: 'Error',
      message: 'An error occurred while fetching images. Please try again later.',
      position: 'topRight',
    });
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page++;
  showLoader();
  hideLoadMoreBtn();

  try {
    const data = await fetchImages(searchQuery, page, perPage);
    const images = data.hits;

    if (images.length === 0) {
      iziToast.info({
        title: 'No More Results',
        message: 'No more images found.',
        position: 'topRight',
      });
      hideLoader();
      hideLoadMoreBtn();
      return;
    }

    renderGallery(images);
    hideLoader();

    const totalPages = Math.ceil(totalHits / perPage);
    if (page >= totalPages) {
      hideLoadMoreBtn();
      iziToast.info({
        title: 'End of Results',
        message: 'You have reached the end of the search results.',
        position: 'topRight',
      });
    } else {
      showLoadMoreBtn();
    }

    const firstCard = document.querySelector('.gallery a');
    if (firstCard) {
      const cardHeight = firstCard.getBoundingClientRect().height;
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    iziToast.error({
      title: 'Error',
      message: 'An error occurred while fetching images. Please try again later.',
      position: 'topRight',
    });
    hideLoader();
  }
});