import axios from 'axios';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';

const URL = 'https://pixabay.com/api/';
const perPage = 40;

const getImages = async (value, page) => {
  try {
    const response = await axios.get(`${URL}`, {
      params: {
        key: '39127103-130545e6f30af3924ce3d7b3a',
        q: `${value}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: page,
        per_page: perPage,
      },
    });
    return response.data;
  } catch (error) {
    Notiflix.Notify.failure('An error occurred while fetching images.');
    throw error;
  }
};

export { getImages };
