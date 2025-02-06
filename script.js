const API = "b183dab02f3aeaa27a8ecc4c1d6df465"; // Move this to a backend server
const dateEl = document.querySelector(".date");
const dayEl = document.querySelector(".day-d");
const searchBtn = document.querySelector(".search-btn");
const searchBar = document.querySelector(".search-bar");
const iconCont = document.querySelector(".details");
const ExtraInfo = document.querySelector(".extra-info");
const listContentEl = document.querySelector(".right")
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Display current date and day
const day = new Date();
const dayName = days[day.getDay()];
dayEl.textContent = dayName;

let month = day.toLocaleDateString("default", { month: "long" });
let date = day.getDate();
let year = day.getFullYear();
dateEl.textContent = `${date} ${month} ${year}`;

// Search functionality
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (searchBar.value.trim() !== "") {
    const search = searchBar.value.trim();
    searchBar.value = "";
    findLocation(search);
  } else {
    swal("Attention!", "Search bar can't be empty.");
  }
});

// Fetch weather data
async function findLocation(name) {
  iconCont.innerHTML = "";
  ExtraInfo.innerHTML = "";
  try {
    const APIURL = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API}`;
    const response = await fetch(APIURL);
    if (!response.ok) throw new Error("City not found");
    const result = await response.json();
    console.log(result);
    // Use ORIGINAL class names (temprature/discription)
    const html = `
      <h3 class="place scroll-top">
        <span class="material-symbols-outlined">location_on</span> 
        ${result.name}
      </h3>
      <div class="scroll-scale">
        <span class="date">${date} ${month} ${year}</span> 
        <span class="day-d">${dayName}</span>
      </div>
      <img src="https://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png" 
           alt="Weather-icon" 
           class="main-img scroll-scale">
      <h1 class="temprature scroll-scale">
        ${Math.round(result.main.temp - 273.15)}°C
      </h1>
      <p class="discription scroll-scale">
        ${result.weather[0].description}
      </p>
    `;
    const newHTML = `
      <div class="Pressure">
        <div class="icon"><i class='bx bx-water'></i></div>
        <div class="title-value">${result.main.pressure} M/B</div>
        <div class="title-name">Pressure</div>
      </div>
      <div class="humidity">
        <div class="icon"><i class='bx bxs-droplet-half' ></i></div>
        <div class="title-value">${result.main.humidity}%</div>
        <div class="title-name">humidity</div>
      </div>
      <div class="wind">
        <div class="icon"><i class='bx bx-wind'></i></i></div>
        <div class="title-value">${result.wind.speed} M/s</div>
        <div class="title-name">wind speed</div>
      </div>
    `
    getForCast(result.coord.lat, result.coord.lon);
    iconCont.insertAdjacentHTML("afterbegin", html);
    ExtraInfo.insertAdjacentHTML("afterbegin", newHTML);

    // Observe new elements
    const newScrollElements = iconCont.querySelectorAll('.scroll-scale, .scroll-top');
    newScrollElements.forEach((el) => observer.observe(el));

  } catch (error) {
    swal("Error!", "Place Not Found");
  }
}

async function getForCast(lat, lon) {
  try {
    const foreCastAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API}`;
    const response = await fetch(foreCastAPI);
    const result = await response.json();

    // const forecastContainer = document.querySelector(".forecast-container");
    listContentEl.innerHTML = ""; // Clear previous forecasts

    const uniqueForcastDay = [];
    const dayForcast = result.list.filter((forecast) => {
      const forecastDate = new Date(forecast.dt_txt).getDate();
      if (!uniqueForcastDay.includes(forecastDate)) {
        uniqueForcastDay.push(forecastDate);
        return true;
      }
      return false;
    });

    dayForcast.slice(0, 5).forEach((content) => {
      listContentEl.insertAdjacentHTML("beforeend", forecast(content));
      const newScrollElements = iconCont.querySelectorAll('.scroll-scale, .scroll-top');
    newScrollElements.forEach((el) => observer.observe(el));
    });

  } catch (error) {
    console.error("Forecast error:", error);
  }
}


function forecast(frContent){

  const day = new Date(frContent.dt_txt);
  const dayName = days[day.getDay()];
  const spiltDay = dayName.split("", 3);
  const jionDay = spiltDay.join("");
  return `<div class="next-box">
  <div class="in-date">${jionDay}</div>
      <img src=" https://openweathermap.org/img/wn/${frContent.weather[0].icon}@2x.png" alt="img" class="next-img">
      <div class="next-temp">${Math.round(frContent.main.temp - 273.15)}°C</div>
      </div>`

      
}

// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show-items");
    } else {
      entry.target.classList.remove("show-items");
    }
  });
});

const scrollElements = document.querySelectorAll(".scroll-scale, .scroll-top, .scroll-bottom, .scroll-left");
scrollElements.forEach((el) => observer.observe(el));