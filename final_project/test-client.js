const axios = require('axios');

const API_URL = 'http://localhost:5000';

async function testAPI() {
  let token = null;

  try {
    // Register (skip if user exists)
    try {
      const register = await axios.post(`${API_URL}/register`, {
        username: 'testuser',
        password: 'password123',
      });
      console.log('Register:', register.data);
    } catch (registerError) {
      if (registerError.response?.data.message === 'Username already exists') {
        console.log('User already exists, proceeding to login');
      } else {
        throw registerError;
      }
    }

    // Task 7: Login
    const login = await axios.post(`${API_URL}/customer/login`, {
      username: 'testuser',
      password: 'password123',
    });
    token = login.data.token;
    console.log('Login:', login.data);

    // Get all books
    const books = await axios.get(`${API_URL}/`);
    console.log('Books:', books.data);

    // Get book by ISBN
    const bookByISBN = await axios.get(`${API_URL}/isbn/1`);
    console.log('Book by ISBN:', bookByISBN.data);

    // Get books by author
    const booksByAuthor = await axios.get(`${API_URL}/author/Jane Austen`);
    console.log('Books by Author:', booksByAuthor.data);

    // Get books by title
    const booksByTitle = await axios.get(`${API_URL}/title/Pride and Prejudice`);
    console.log('Books by Title:', booksByTitle.data);

    // Task 8: Add review
    const review = await axios.put(
      `${API_URL}/customer/auth/review/1?review=Great book!`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('Add Review:', review.data);

    // Get reviews
    const reviews = await axios.get(`${API_URL}/review/1`);
    console.log('Reviews:', reviews.data);

    // Task 8: Modify review
    const modifyReview = await axios.put(
      `${API_URL}/customer/auth/review/1?review=Updated review: Amazing book!`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('Modify Review:', modifyReview.data);

    // Get reviews after modification
    const reviewsAfterModify = await axios.get(`${API_URL}/review/1`);
    console.log('Reviews After Modify:', reviewsAfterModify.data);

    // Task 9: Delete review
    const deleteReview = await axios.delete(
      `${API_URL}/customer/auth/review/1`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('Delete Review:', deleteReview.data);

    // Verify deletion
    const reviewsAfterDelete = await axios.get(`${API_URL}/review/1`);
    console.log('Reviews After Delete:', reviewsAfterDelete.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testAPI();