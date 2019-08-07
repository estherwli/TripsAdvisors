// Foursquare API Info
const clientId = '5PVZFB44R1BWVCLV0C14LVLES3GC4TNSMUR3APLSAQMKEP23';
const clientSecret = 'GF4KT3VFICW1TEXOTHLQ1X4XXGLAMDGE0EBUHYHEZCAKU1CO';
const url = 'https://api.foursquare.com/v2/venues/explore?near=';

// APIXU Info
const apiKey = '0c4f6a85691a463ca7c90533190608';
const forecastUrl = 'https://api.apixu.com/v1/forecast.json?key=';

// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4"), $("#venue5"), $("#venue6")];
const $weatherDivs = [$("#weather1"), $("#weather2"), $("#weather3"), $("#weather4"), $("#weather5"), $("#weather6"), $("#weather7")];
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Add AJAX functions here:
async function getVenues() {
  const city = $input.val();
	const urlToFetch = `${url}${city}&limit=10&client_id=${clientId}&client_secret=${clientSecret}&v=20190806`;
  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      const venues = jsonResponse.response.groups[0].items.map(item => item.venue);
      console.log(response);
      return venues;
    }
    else {
      console.log('Request failed!');
    }    
  }
  catch(error) {
    console.log(error.message);
  }
}

async function getForecast() {
  const urlToFetch = `${forecastUrl}${apiKey}&q=${$input.val()}&days=7&hour=11`;
  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      console.log(jsonResponse);
      const days = jsonResponse.forecast.forecastday;
      return days;
    }
  }
  catch(error) {
    console.log(error);
  }
}


// Render functions
const renderVenues = (venues) => {
  $venueDivs.forEach(($venue, index) => {
    const venue = venues[index];
    const venueIcon = venue.categories[0].icon;

    let venueImgSrc = `${venueIcon.prefix}bg_64${venueIcon.suffix}`;
    let venueContent = createVenueHTML(venue.name, venue.location, venueImgSrc);
    $venue.append(venueContent);
  });
  $destination.append(`<h2>${venues[0].location.city}</h2>`);
}

const renderForecast = (days) => {
  $weatherDivs.forEach(($day, index) => {
  const currentDay = days[index];
  let weatherContent = createWeatherHTML(currentDay);
    $day.append(weatherContent);
  });
}

const executeSearch = () => {
  $venueDivs.forEach(venue => venue.empty());
  $weatherDivs.forEach(day => {
    day.empty()
  });
  $destination.empty();
  $container.css("visibility", "visible");
  getVenues().then(
  venues => {
    return renderVenues(venues);
  })
  getForecast().then(forecast => {
    renderForecast(forecast);
  })
  return false;
}

$submit.click(executeSearch)
