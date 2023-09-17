'use server';

import axios from 'axios';

export const fetchImages = async (search: string) => {
  try {
    const res = await axios.get(
      `https://api.unsplash.com/search/photos?client_id=${process.env.UNSPLASH_ACCESS_KEY}&per_page=12&query=${search}`
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
