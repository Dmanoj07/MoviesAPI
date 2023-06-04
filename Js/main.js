console.log("js lodded");
let page = 1;
const perPage = 10;

// Function to load data based on the title parameter
function loadData(title = null) {
    let apiUrl = `https://harlequin-chinchilla-cap.cyclic.app/api/movies?page=${page}&perPage=${perPage}`;
  
    if (title !== null) {
      apiUrl += `&title=${title}`;
      document.querySelector('.pagination').classList.add('d-none');
      page = 1;
    } else {
      document.querySelector('.pagination').classList.remove('d-none');
    }
  
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const moviesTable = document.querySelector('.moviesTable tbody');
        moviesTable.innerHTML = '';
  
        moviesTable.innerHTML = data.map(movie => {
          return `
            <tr data-id="${movie._id}">
              <td>${movie.year}</td>
              <td>${movie.title}</td>
              <td>${movie.plot || 'N/A'}</td>
              <td>${movie.rated || 'N/A'}</td>
              <td>${Math.floor(movie.runtime / 60)}:${(movie.runtime % 60).toString().padStart(2, '0')}</td>
            </tr>
          `;
        }).join('');
  
        document.querySelector('#current-page').innerHTML = page;
  
        const movieRows = document.querySelectorAll('.moviesTable tbody tr');
        movieRows.forEach(row => {
          row.addEventListener('click', () => {
            const movieId = row.dataset.id;
            fetch(`https://harlequin-chinchilla-cap.cyclic.app/api/movies/${movieId}`)
              .then(response => response.json())
              .then(movieData => {
                console.log(movieData);
                document.querySelector('.modal-title').innerHTML = movieData.title;
                let movieSelected = 
                  `
                  <img class="img-fluid w-100" src="${movieData.poster}"><br><br>
                  <strong>Directed By:</strong> ${movieData.directors.join(', ')}<br><br>
                  <p>${movieData.fullplot}</p>
                  <strong>Cast:</strong> ${movieData.cast.join(', ') || 'N/A'}<br><br>
                  <strong>Awards:</strong> ${movieData.awards.text}<br>
                  <strong>IMDB Rating:</strong> ${movieData.imdb.rating} (${movieData.imdb.votes} votes)
                `;
                
                document.querySelector("#detailsModal .modal-body").innerHTML = movieSelected;
                let modal = new bootstrap.Modal(document.getElementById('detailsModal'),{
                  backdrop: 'static',
                  keyboard: false,
                });
                modal.show();
              })
          });
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  

document.addEventListener('DOMContentLoaded', () => {
  // Click event for the "previous page" pagination button'
  loadData();
  document.querySelector('#previous-page').addEventListener('click', () => {
    if (page > 1) {
      page--;
      loadData();
    }
  });

  // Click event for the "next page" pagination button
  document.querySelector('#next-page').addEventListener('click', () => {
    page++;
    loadData();
  });

  // Submit event for the "searchForm" form
  document.querySelector('#searchForm').addEventListener('submit', event => {
    event.preventDefault();
    const title = document.querySelector('#title').value;
    loadData(title);
  });

  // Click event for the "clearForm" button
  document.querySelector('#clearForm').addEventListener('click', () => {
    document.querySelector('#title').value = '';
    loadData();
  });
});
