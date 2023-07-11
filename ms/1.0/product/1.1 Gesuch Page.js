var myUrl = new URL(document.location.href);
var myParam = myUrl.searchParams.get("id") ;
let xanoUrl = new URL('https://api.mygesuch.de/api:3_z_7Zl_/11/suche_page/v7/' + myParam);

function getItem() {
    fetch(xanoUrl, {
        method: 'GET',    
        mode: 'cors',
    })
    .then(response => response.json())
    .then(response => {
        
        document.getElementById("open-no-pros-id").textContent = response.bucket_counts.open;
        document.getElementById("wb-no-pros-id").textContent = response.bucket_counts.wb;
        document.getElementById("decision-no-pros-id").textContent = response.bucket_counts.decision;
        document.getElementById("all-no-pros-id").textContent = response.bucket_counts.all;
        document.getElementById("inactive-no-pros-id").textContent = response.bucket_counts.inactive;
        
        const targetDiv = document.getElementById("open-pros-tab");
        
        response.anfragen_unbearbeitet.forEach(record => {
            
            const cardpros = document.createElement('div');
            cardpros.className = 'card_pros_ms10';
            targetDiv.appendChild(cardpros);

            const topcard = document.createElement('div');
            topcard.className = 'top_card_pros_ms10';
            cardpros.appendChild(topcard);

            const lside = document.createElement('div');
            lside.className = 'l_side_card_pros_ms10';
            topcard.appendChild(lside);

            const thumbmail = document.createElement('div');
            thumbmail.className = 'thumbnail_pros_card_ms10';
            lside.appendChild(thumbmail);

            const distance = document.createElement('div');
            distance.className = 'margin-right _2rem';
            lside.appendChild(distance);

            const name = document.createElement('h2');
            name.className = 'h4';
            name.textContent = record.vorname;
            lside.appendChild(name);

            const rside = document.createElement('div');
            rside.className = 'r_side_card_pros_ms10';
            topcard.appendChild(rside);

            const ctaofferwb = document.createElement('a');
            ctaofferwb.className = 'cta_offer_wb_open_popop_ms10 w-button';
            ctaofferwb.textContent = 'Termin anbieten';
            ctaofferwb.addEventListener("click", function() {
                document.getElementById("wbofferpopup").style.display = "flex";
                generateHtmlSlots(record.param_id, myParam);
            });
            rside.appendChild(ctaofferwb);

            const buttondist = document.createElement('div');
            buttondist.className = 'margin-right _2rem';
            rside.appendChild(buttondist);
        }); 
    });
}


(function() {
    setTimeout(() => {
        getItem();
    }, 250)
})();


// Get references to the buttons and tabs
const buttons = ["cta-open-tab", "cta-wb-tab", "cta-decision-tab", "cta-all-tab", "cta-inactive-tab"].map(id => document.getElementById(id));
const tabs = ["open-pros-tab", "wb-pros-tab", "decision-pros-tab", "all-pros-tab", "inactive-pros-tab"].map(id => document.getElementById(id));

// URLs for the API requests corresponding to each button
const apiUrls = [
  'https://api.mygesuch.de/api:3_z_7Zl_/11/open/v1/',
  'https://api.mygesuch.de/api:3_z_7Zl_/11/wbs/v3/',
  'https://api.mygesuch.de/api:3_z_7Zl_/11/decision/v3/',
  'https://api.mygesuch.de/api:3_z_7Zl_/11/all/v3/',
  'https://api.mygesuch.de/api:3_z_7Zl_/11/inactive/v3/'
];

// Function to handle click event on each button
buttons.forEach((button, index) => {
  button.addEventListener("click", function() {
    // Hide all tabs and add "inactive" class to all buttons
    buttons.forEach((btn, idx) => {
      btn.classList.add("inactive");
      tabs[idx].style.display = "none";
    });

    // Show the tab corresponding to clicked button and remove "inactive" class
    button.classList.remove("inactive");
    tabs[index].style.display = "block";

    // Fetch data from the backend and populate the tab
    const public_id = new URL(window.location.href).searchParams.get("id");
    const url = new URL(apiUrls[index] + public_id);

    fetch(url)
    .then(response => response.json())
    .then(data => {
        populateTab(data, tabs[index]);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
  });
});

// Function to populate a tab with data
function populateTab(data, tab) {
  // Clear the tab content
  tab.innerHTML = "";

  if (tab.id === "wb-pros-tab") {
    // The specific HTML generation for WB tab
    Object.keys(data.manipulate_days).forEach(function(dayKey) {
      let dayDiv = document.createElement('div');
      dayDiv.classList.add('day-cont-cal-ms-10');

      let dayHeading = document.createElement('h3');
      dayHeading.classList.add('h4');
      dayHeading.textContent = dayKey;
      dayDiv.appendChild(dayHeading);

      data.manipulate_days[dayKey].forEach(function(halfHourObj) {
        let halfHourDiv = document.createElement('div');
        halfHourDiv.classList.add('halfhour-cont-cal-ms-10');

        let timeSpreadDiv = document.createElement('div');
        timeSpreadDiv.classList.add('time-spread-cal-ms-10');

        let timeTextDiv = document.createElement('div');
        timeTextDiv.classList.add('text');
        let timeText = document.createTextNode(halfHourObj.time);
        timeTextDiv.appendChild(timeText);
        timeSpreadDiv.appendChild(timeTextDiv);

        let lineTimeDiv = document.createElement('div');
        lineTimeDiv.classList.add('line-time-cal-ms-10');
        timeSpreadDiv.appendChild(lineTimeDiv);

        halfHourDiv.appendChild(timeSpreadDiv);

        if (Object.keys(halfHourObj.wbs).length === 0) {
          let emptyCardDiv = document.createElement('div');
          emptyCardDiv.classList.add('empty-card-cal-ms-10');
          halfHourDiv.appendChild(emptyCardDiv);
        } else {
          let wbDiv = document.createElement('div');
          wbDiv.classList.add('wb-card-cal-ms-10');
          wbDiv.textContent = JSON.stringify(halfHourObj.wbs, null, 2);
          halfHourDiv.appendChild(wbDiv);
        }

        dayDiv.appendChild(halfHourDiv);
      });

      tab.appendChild(dayDiv);
    });
  } else {
    // Populate the tab with new content for other tabs
    // You can put else if conditions here for each tab with different HTML generation code
    // ...
  }
}


async function generateHtmlSlots(pros_id, search_id) {
    let getrecurl = new URL('https://api.mygesuch.de/api:3_z_7Zl_/11/rec_wb_offers/v3');
    let response = await fetch(getrecurl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pros_id: pros_id,
            search_id: search_id
        })
    });

    let data = await response.json();
    let slots = data.slots;
    let targetDiv = document.getElementById('target-wb-reccs');

    let prosdata = data.pros
    document.getElementById("headpopup").textContent = prosdata.head;

    for (let date in slots) {
        let dayDiv = document.createElement('div');
        dayDiv.className = 'day-wboffer-popup-11-ms10';
        
        let padding = document.createElement('div');
        padding.className = 'margin-bottom margin-small';
        dayDiv.appendChild(padding);
        
        let dayTitle = document.createElement('h5');
        dayTitle.className = 'h5 gray';
        dayTitle.textContent = date;
        padding.appendChild(dayTitle);

        slots[date].forEach(slot => {
            let slotHtml;
            if (slot.state === 'verfügbar') {
                slotHtml = document.createElement('label');
                slotHtml.className = 'slot-wboffer-popup-11-ms10 w-radio';
                slotHtml.innerHTML = `
                <div class="inner-spreader-select-wboffer-popup-11-ms10">
                  <div class="taken-cont-popup-11-ms10">
                    <div class="margin-right _1rem">
                      <div class="circle-pick-popup-11-ms10"></div>
                    </div>
                    <div class="margin-right _0-5rem">
                      <div class="h5">${slot.time}</div>
                    </div>
                  </div>
                  <div class="text gray">${slot.state}</div>
                </div>
                <div class="w-form-formradioinput w-form-formradioinput--inputType-custom selector-wboffer-popup-11-ms10 w-radio-input"></div>
                <input type="radio" id="${slot.timestamp}" name="freeslots" value="${slot.timestamp}" data-name="freeslots" style="opacity:0;position:absolute;z-index:-1">
                <span class="radio-hidden-text w-form-label" for="${slot.timestamp}">Radio</span>
                `;
            } else {
                slotHtml = document.createElement('div');
                slotHtml.className = 'slot-wboffer-popup-11-ms10 taken';
                slotHtml.innerHTML = `
                <div class="taken-cont-popup-11-ms10">
                  <div class="margin-right _1rem">
                    <img src="https://uploads-ssl.webflow.com/61918430ea8005fe5b5d3b6c/64a847b78f9ee2acfd78d8c3_cancel-icon-gray.svg" loading="lazy" alt="" class="icon-taken-cont-popup-11-ms10">
                  </div>
                  <div class="h5 gray">${slot.time}</div>
                </div>
                <div class="text gray">${slot.state}</div>
                `;
            }
            dayDiv.appendChild(slotHtml);
        });

        targetDiv.appendChild(dayDiv);
    }
}


