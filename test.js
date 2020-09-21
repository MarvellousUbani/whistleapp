const resultsCol = document.querySelector(".two-times__col");
const buttonSearch1 = document.getElementById("search-auto");
const buttonSearch2 = document.getElementById("search-autoz");

// To go to home Section
jQuery(".s-back-button").on("click", () => {
    jQuery("#homesec").show();
    jQuery("#searchsec").hide();
    jQuery("#main-header").removeClass("secondary-header-bg");
});

buttonSearch1.addEventListener("click", () => {
    const categoryData = document.getElementById("cars-category").value;
    const locationData = document.querySelector(".location-auto").value;
    const queryData = `${categoryData}+in+${locationData}`;
    const searchError = document.querySelector(".search-error");
    const searchTitle = document.querySelector(".search-result__title");

    if (
        categoryData.trim() !== "" &&
        locationData.trim() !== ""
    ) {
        // To go to search Section
        jQuery("#searchsec").show();
        jQuery("#homesec").hide();
        jQuery("#main-header").addClass("secondary-header-bg");

        searchTitle.innerHTML = `${categoryData} In ${locationData}`;
        searchError.classList.add("d-none");
        resultsCol.innerHTML = `<div class="loader"></div>`;
        getSearchResults(queryData, locationData, categoryData);
    } else {
        searchError.classList.remove("d-none");
        searchError.innerHTML = `Enter in missing location or category`;
    }
});

buttonSearch2.addEventListener("click", () => {
    const categoryData = document.getElementById("carz-category").value;
    const locationData = document.querySelector(".location-autoz").value;
    const queryData = `${categoryData}+in+${locationData}`;
    const searchTitle = document.querySelector(".search-result__title");

    searchTitle.innerHTML = `${categoryData.replace(
        "-",
        " "
    )} In ${locationData}`;

    if (categoryData.trim() !== "" && locationData.trim() !== "") {
        resultsCol.innerHTML = `<div class="loader"></div>`;
        getSearchResults(queryData, locationData, categoryData);
    } else {
        console.log("error");
    }
});

let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || {};

let returnedSearchResults = {};

async function getSearchResults(queryData, location, term) {
    try {
        returnedSearchResults = {};
        if (
            searchHistory[queryData] &&
            Object.keys(searchHistory[queryData]).length > 0
        ) {
            returnedSearchResults = searchHistory[queryData];
        } else {
            //get yelp data
            const res = await getYelpData(location, term);
            //distribute the data only if results exists
            if (Object.keys(res).length < 1) {
                displayNoResults();
                return;
            }
            distrubuteYelpData(res);
            //   Save search history for testing /memoization
            searchHistory[queryData] = returnedSearchResults;
            // Save to local storage
            localStorage.setItem(`searchHistory`, JSON.stringify(searchHistory));
        }
        // Show Results on UI
        displayResults();
    } catch (err) {
        console.log(err);
    }
}

const displayNoResults = () => {
    resultsCol.innerHTML = `<p class="no-search-results">No Results for this query. Try Another Search</p>`;
};

const displayResults = () => {
    resultsCol.innerHTML = "";
    Object.values(returnedSearchResults).forEach((business) => {
        const {
            id,
            name,
            image_url,
            url,
            review_count,
            rating,
            price,
            display_phone,
            categories,
            display_address,
        } = business;
        resultsCol.insertAdjacentHTML(
            "beforeend",
            `<div class="search-result__box">
         <div class="intro-details d-flex">
           <div class="place-img">
             <img
             src="${
            image_url ||
            "https://www.carhuddle.com/images/default/car-default.jpg"
            }"
             alt="car image" />
           </div>
           <div class="place-name-details">
             <p class="place-result-name">${name}</p>
             <p class="place-result-rating">
               ${generateReviewStars(rating)}
               <strong>${rating}</strong> (${review_count})
             </p>
             <p class="place-result-address">
               ${display_address}
             </p>
             <button class="place-operation-hours" onclick="getBusinessHours('${id}')">
             <i class="fa fa-clock-o" aria-hidden="true"></i>
             Hours of Operation
             </button>
            <p class="place-cost">Cost - ${displayPriceValue(price)}</p>
           </div>
         </div>
         <div class="other-details">
           <p class="isOpen">Business Status: Operational</p>
           <p class="featured-in">
             Types: ${categories[0].title}
           </p>
         </div>
         <div class="cta-details d-flex">
           <button class="callBtn" onclick="displayPhoneNumber('${display_phone}')">
             <i class="fa fa-phone" aria-hidden="true"></i> <a>Call</a>
           </button>
           <button class="directionBtn">
             <i class="fa fa-location-arrow" aria-hidden="true"></i> <a href="https://www.google.com/maps/dir/${name}${display_address}/Current Location" target="_blank">Find
             Directions</a>
           </button>
           <button class="reviewsBtn" onclick="getBusinessReviews('${id}')">
             <i class="fa fa-star-o" aria-hidden="true"></i> <a>See Reviews</a>
           </button>
           <button class="yelpBusinessBtn">
            <i class="fa fa-yelp" aria-hidden="true"></i> <a target="_blank" href="${url}">Visit Yelp Page</a>
           </button>
         </div>
       </div>`
        );
    });
};

function displayPhoneNumber(number) {
    const modalContent = document.querySelector(".modal-detail-content");
    modalContent.innerHTML = `<div class="place-phone-number">Phone Number<br><span>${number}</span></div>`;
    openModal();
}

async function getBusinessReviews(id) {
    showLoader("modal-detail-content");
    openModal();
    const res = await fetchBusinessReviews(id);
    displayBusinessReviews(res);
}

function showLoader(className) {
    document.querySelector(
        `.${className}`
    ).innerHTML = `<div class="loader"></div>`;
}

function displayBusinessReviews(reviews) {
    const modalContent = document.querySelector(".modal-detail-content");
    if (reviews && reviews.length > 0) {
        let allReviews = reviews
            .map((review) => {
                return `<div class="testimonial-box">
          <div class="testi-img-box">
           <img src="${
                    review.user.image_url ||
                    "https://qph.fs.quoracdn.net/main-qimg-6d72b77c81c9841bd98fc806d702e859"
                    }" class="testi-img" alt="testifier image"/>
          </div>
          <div>
          <p class="testi-name">${review.user.name}</p>
            <p class="testi-rating"><strong>${
                    review.rating
                    }</strong> <i class="fa fa-star" aria-hidden="true"></i> Rating</p>
         <p class="testi-review">${review.text}</p>
        </div>
        </div>`;
            })
            .join("");
        modalContent.innerHTML = allReviews;
    } else {
        modalContent.innerHTML = `No Reviews`;
    }
}


async function fetchOperationHours(id) {
    try {
        const res = await fetch(
            `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/${id}/`,
            {
                method: "GET",
                headers: {
                    Authorization:
                        "Bearer 7y646sS-o3rJfoCzeGJwm1W_U3kro-xdbEHcivHHeh1hbX_Kc-BOXHCqMv0-yayz5oJ_fxpFWCP--Y_7tU5U3reFYRXDC688bCG4b386rc1OQj_vNAK5bKQ7vvMzX3Yx",
                    "Content-Type": "application/json",
                },
            }
        );
        const data = await res.json();
        const results = data.hours[0].open;
        return results;
    } catch (err) {
        console.log(err);
    }
}


async function fetchBusinessReviews(id) {
    try {
        const res = await fetch(
            `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/${id}/reviews`,
            {
                method: "GET",
                headers: {
                    Authorization:
                        "Bearer 7y646sS-o3rJfoCzeGJwm1W_U3kro-xdbEHcivHHeh1hbX_Kc-BOXHCqMv0-yayz5oJ_fxpFWCP--Y_7tU5U3reFYRXDC688bCG4b386rc1OQj_vNAK5bKQ7vvMzX3Yx",
                    "Content-Type": "application/json",
                },
            }
        );
        const data = await res.json();
        const results = data.reviews;
        return results;
    } catch (err) {
        console.log(err);
    }
}

async function getYelpData(location, name) {
    try {
        const res = await fetch(
            `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=${location}&term=${name}&sort_by=distance&categories=auto`,
            {
                method: "GET",
                headers: {
                    Authorization:
                        "Bearer 7y646sS-o3rJfoCzeGJwm1W_U3kro-xdbEHcivHHeh1hbX_Kc-BOXHCqMv0-yayz5oJ_fxpFWCP--Y_7tU5U3reFYRXDC688bCG4b386rc1OQj_vNAK5bKQ7vvMzX3Yx",
                    "Content-Type": "application/json",
                },
            }
        );
        const data = await res.json();
        const results = data.businesses;
        return results;
    } catch (err) {
        console.log(err);
    }
}

function distrubuteYelpData(results) {
    results.forEach((result) => {
        const {
            id,
            name,
            image_url,
            url,
            review_count,
            rating,
            price,
            display_phone,
            categories,
            location: { display_address },
        } = result;

        returnedSearchResults[name] = {
            id,
            name,
            price,
            image_url,
            url,
            review_count,
            rating,
            display_phone,
            categories,
            display_address,
        };
    });
}


// Car Category autosuggest

const carCategories = [
    "Auto Repair",
    "Car Dealership",
    "Car Wash",
    "Car Tire Change",
    "Car Window Tint",
    "Car Window Repair",
    "Car Bodyshop",
    "Auto Supplies",
    "Car Detail",
    "Gas Station",
    "Car Oil Change",
    "Car Wheel Repair",
    "Car Parts",
    "Automotive Parts",
    "Dent Repair",
    "Car Wrapping",
    "Car Rentals",
];

const categoryData = document.getElementById("cars-category");
const carList = document.querySelector(".cars-list");
categoryData.addEventListener("keyup", () => {
    carList.classList.add("hidden");
    carList.innerHTML = ``;
    // check locations and suggest locations that match the value
    carCategories.forEach((cat) => {
        if (cat.toLowerCase().includes(categoryData.value.toLowerCase())) {
            // display location box and feed to the locations box
            carList.insertAdjacentHTML(
                "beforeend",
                `<li class="car-item">${cat}</li>`
            );
        }
    });
    carList.classList.remove("hidden");
});

carList.addEventListener("click", (e) => {
    if (e.target.className === "car-item") {
        categoryData.value = e.target.textContent;
        carList.classList.add("hidden");
    }
});

// Get the modal
let modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
function openModal() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};


const generateReviewStars = (num) => {
    const halfStar = `<i class="fa fa-star-half-o" aria-hidden="true"></i>`;
    const fullStar = `<i class="fa fa-star" aria-hidden="true"></i>`;
    const emptyStar = `<i class="fa fa-star-o" aria-hidden="true"></i>`;
    const wholeNumber = Number(`${num}`[0]);
    const decimalNumber = Number(`${num}`[2]);
    const emptyStarsNumber = 5 - Math.round(num);

    let output = ``;

    // Find number of iterations and iterate
    if (wholeNumber === 0) {
        // return empty star
        return emptyStar;
    }

    // Generate stars
    for (let i = 0; i < wholeNumber; i++) {
        output += fullStar;
    }

    if (decimalNumber > 4) {
        output += halfStar;
    }
    // add empty stars
    if (emptyStarsNumber > 0) {
        for (let i = 0; i < emptyStarsNumber; i++) {
            output += emptyStar;
        }
    }

    return output;

}


const displayPriceValue = (param) => {
    if (param) {
        return `<span class="some-dollars">${param}</span>` + `<span class="no-dollars">${"$".repeat(5 - param.length)}</span>`;
    }
    return `<span class="no-dollars">$$$$$</span>`
}

// Autolocation
let autocomplete;


function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById("autocomplete"),
        {
            types: ["geocode"]
        }
    );
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.

function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            const circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
        });
    }
}
