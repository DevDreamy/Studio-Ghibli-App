const app = document.getElementById('root');

// Create containers
const container = document.createElement('div');
container.setAttribute('class', 'container');

const containerHeader = document.createElement('div');
containerHeader.setAttribute('class', 'container-header');

const containerContent = document.createElement('div');
containerContent.setAttribute('class', 'container-content');

// Create and insert logo img
const logoImg = document.createElement('img');
logoImg.setAttribute('class', 'logo-img');
logoImg.src = '../assets/img/logo.png';

// Create filter label, select and default option
const filterLabel = document.createElement('label');
filterLabel.setAttribute('for', 'directors');
filterLabel.setAttribute('class', 'filter-title');
filterLabel.innerText = 'Filter movies by director:';

const filterSelect = document.createElement('select');
filterSelect.setAttribute('id', 'directors');
filterSelect.setAttribute('class', 'filter-select');
filterSelect.setAttribute('name', 'directors');

const firstOption = document.createElement('option');
firstOption.innerText = 'Show All';
firstOption.value = '';

// Append everything
filterSelect.appendChild(firstOption);

containerHeader.append(filterLabel, filterSelect);

app.appendChild(container);
container.appendChild(logoImg);
container.appendChild(containerHeader);
container.appendChild(containerContent);

let request = new XMLHttpRequest();

// Get the Ghibli API
request.open('GET', 'https://ghibliapi.herokuapp.com/films', true);

request.onload = function () {
  let data = JSON.parse(this.response);

  // Get all directors names and filter repeated ones
  const allDirectorsArray = data.map((data) => data.director);

  const newDirectorsArray = allDirectorsArray.filter(function (value, index) {
    return allDirectorsArray.indexOf(value) == index;
  });

  newDirectorsArray.forEach((director) => {
    const filterOptions = document.createElement('option');
    filterOptions.innerText = director;
    filterOptions.value = director;

    // Append directors names to options
    filterSelect.appendChild(filterOptions);
  });

  data.forEach((movie) => {
    // Create movie cards
    const card = document.createElement('div');
    card.setAttribute('class', 'card');
    const cardHeader = document.createElement('div');
    cardHeader.setAttribute('class', 'card-header');
    const cardContent = document.createElement('div');
    cardContent.setAttribute('class', 'card-content');
    const cardFooter = document.createElement('div');
    cardFooter.setAttribute('class', 'card-footer');

    // Get movie banner, tittle and etc
    const movieBanner = document.createElement('img');
    movieBanner.src = movie.movie_banner;

    const movieTitle = document.createElement('h1');
    movieTitle.setAttribute('class', 'movie-title');
    movieTitle.innerText = movie.title;

    const movieOriginaltitle = document.createElement('h2');
    movieOriginaltitle.setAttribute('class', 'movie-org-title');
    movieOriginaltitle.innerText = `(${movie.original_title})`;

    const movieDescription = document.createElement('p');
    movieDescription.setAttribute('class', 'movie-desc');
    const oldMovieDescription = movie.description;

    movie.description = movie.description.substr(0, 100);
    movieDescription.innerText = `${movie.description}...`;

    // Read more button
    const readMore = document.createElement('button');
    readMore.setAttribute('class', 'readMore-btn');
    readMore.innerText = 'Read more';
    readMore.addEventListener('click', () => {
      if (movieDescription.innerText.length <= 103) {
        movieDescription.innerText = oldMovieDescription;
        readMore.innerText = 'Read less';
        return;
      }
      movieDescription.innerText = `${movie.description}...`;
      readMore.innerText = 'Read more';
      return;
    });

    const movieDirector = document.createElement('p');
    movieDirector.setAttribute('class', 'movie-director');
    movieDirector.innerText = `Director: ${movie.director}`;

    const movieRuntime = document.createElement('p');
    movieRuntime.innerText = `Run time: ${movie.running_time} minutes`;

    // Append everything to the cards
    cardHeader.append(movieTitle, movieOriginaltitle);

    cardContent.append(movieBanner, movieDescription, readMore);

    cardFooter.append(movieDirector, movieRuntime);

    card.append(cardHeader, cardContent, cardFooter);

    containerContent.appendChild(card);
  });
};

request.send();

// Get all finished cards
const cards = document.getElementsByClassName('card');

// Create the filter
filterSelect.addEventListener('change', function () {
  for (let i = 0; i < cards.length; i++) {
    let director = cards[i].querySelector('.movie-director');

    if (director.innerText.indexOf(filterSelect.value) > -1) {
      cards[i].style.display = '';
      cards[i].animate(
        [
          { transform: 'translateY(20px)', opacity: '0' },
          { transform: 'translateY(0px)', opacity: '1' },
        ],
        {
          duration: 400,
          fill: 'both',
        }
      );
    } else {
      cards[i].style.display = 'none';
    }
  }
});
