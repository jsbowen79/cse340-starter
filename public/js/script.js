
const carsDict = {
    1 :["Adventador", "adventador-tn.jpg", "adventador.jpg"], 2: ["Aerocar", "aerocar-tn.jpg",
    "aerocar.jpg"], 3: ["Batmobile","batmobile-tn.jpg", "batmobile.jpg"], 4: ["Camaro", "camaro-tn.jpg",
    "camaro.jpg"], 5:["Crown Victoria", "crwn-vic-tn.jpg", "crwn-vic.jpg"], 6:[ "Delorean","delorean-tn.jpg",
    "delorean.jpg"], 7: ["Dog Car", "dog-car-tn.jpg", "dog-car.jpg"], 8: ["Escalade", "escalade-tn.jpg",
    "escalade.jpg"], 9:["Fire Truck","fire-truck-tn.jpg", "fire-truck.jpg"], 10: ["Hummer", "hummer-tn.jpg",
    "hummer.jpg"], 11:["Mechanic", "mechanic-tn.jpg", "mechanic.jpg"], 12:["Model T", "model-t-tn.jpg",
    "model-t.jpg"], 15: ["Monster Truck", "monster-truck-tn.jpg", "monster-truck.jpg"], 13: ["Mystery Van",
    "mystery-van-tn.jpg", "mystery-van.jpg"], 14: ["Panel Van", "survan-tn.jpg", "survan.jpg"], 0: [
    "Wrangler", "wrangler-tn.jpg", "wrangler.jpg"]
}; 

function chooseVehicle() {
    const keys = Object.keys(carsDict);
    const randomKey = keys[Math.floor(Math.random() * keys.length)]; 
    return carsDict[randomKey]; 
}

const vehicleObject = chooseVehicle();
const vehicleName = vehicleObject[0];  
const vehicleNameEL = document.querySelector("h2"); 
const vehicleName2EL = document.querySelectorAll(".carName");
vehicleNameEL.textContent = vehicleName; 
vehicleName2EL.forEach(vehicle => {
    vehicle.textContent = vehicleName;
});

const heroPictureEL = document.querySelector('.hero img'); 
const heroDivEL = document.querySelector(".hero"); 

function setHeroImage() {
    const newHeroEL = new Image(); 
    const featuresEL = document.querySelector('.features'); 
    const screenWidth = window.innerWidth; 
    newHeroEL.alt = `A picture of a ${vehicleName}`; 


    if (screenWidth < 400) {
        newHeroEL.src = `/images/vehicles/${vehicleObject[1]}`
    } else {
        newHeroEL.src = `/images/vehicles/${vehicleObject[2]}`
    }

    newHeroEL.onload = () => {
        heroPictureEL.remove();
        heroDivEL.appendChild(newHeroEL); 
        featuresEL.classList.add('show'); 
    }
}

setHeroImage(); 