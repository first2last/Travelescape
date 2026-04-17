import { cityDetailsMap } from './cityData';

const imageMap = {
  "paris": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg/960px-La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg",
  "rome": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Trevi_Fountain%2C_Rome%2C_Italy_2_-_May_2007.jpg/960px-Trevi_Fountain%2C_Rome%2C_Italy_2_-_May_2007.jpg",
  "zurich": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Altstadt_Z%C3%BCrich_2015.jpg/960px-Altstadt_Z%C3%BCrich_2015.jpg",
  "amsterdam": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Imagen_de_los_canales_conc%C3%A9ntricos_en_%C3%81msterdam.png/960px-Imagen_de_los_canales_conc%C3%A9ntricos_en_%C3%81msterdam.png",
  "barcelona": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Aerial_view_of_Barcelona%2C_Spain_%2851227309370%29_edited.jpg/960px-Aerial_view_of_Barcelona%2C_Spain_%2851227309370%29_edited.jpg",
  "reykjavik": "https://images.unsplash.com/photo-1473951574080-01fe45ec8643?w=800&q=80",
  "london": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/London_Skyline_%28125508655%29.jpeg/960px-London_Skyline_%28125508655%29.jpeg",
  "prague": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Prague_%286365119737%29.jpg/960px-Prague_%286365119737%29.jpg",
  "tokyo": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg/960px-Skyscrapers_of_Shinjuku_2009_January.jpg",
  "bali": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Bali_in_Indonesia_%28special_marker%29.svg/960px-Bali_in_Indonesia_%28special_marker%29.svg.png",
  "bangkok": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Bangkok_Montage_2024_2.jpg/960px-Bangkok_Montage_2024_2.jpg",
  "singapore": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Flag_of_Singapore.svg/960px-Flag_of_Singapore.svg.png",
  "dubai": "https://upload.wikimedia.org/wikipedia/en/thumb/c/c7/Burj_Khalifa_2021.jpg/960px-Burj_Khalifa_2021.jpg",
  "seoul": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/%EC%A4%91%ED%99%94%EC%A0%84%EC%9D%98_%EB%82%AE.jpg/960px-%EC%A4%91%ED%99%94%EC%A0%84%EC%9D%98_%EB%82%AE.jpg",
  "hongkong": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Flag_of_Hong_Kong.svg/960px-Flag_of_Hong_Kong.svg.png",
  "capetown": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Camps_bay_%2853460319478%29_%28cropped%29.jpg/960px-Camps_bay_%2853460319478%29_%28cropped%29.jpg",
  "nairobi": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Nairobi_skyline_from_Gem_Hotel.jpg/960px-Nairobi_skyline_from_Gem_Hotel.jpg",
  "marrakech": "https://images.unsplash.com/photo-1473951574080-01fe45ec8643?w=800&q=80",
  "cairo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Cairo_From_Tower_%28cropped%29.jpg/960px-Cairo_From_Tower_%28cropped%29.jpg",
  "newyork": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/960px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg",
  "losangeles": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Hollywood_Sign_%28Zuschnitt%29.jpg/960px-Hollywood_Sign_%28Zuschnitt%29.jpg",
  "sanfrancisco": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/San_Francisco_Downtown_Aerial%2C_August_2025.jpg/960px-San_Francisco_Downtown_Aerial%2C_August_2025.jpg",
  "banff": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Town_of_Banff_viewed_from_Sulphur_Mountain.jpg/960px-Town_of_Banff_viewed_from_Sulphur_Mountain.jpg",
  "vancouver": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Concord_Pacific_Master_Plan_Area.jpg/960px-Concord_Pacific_Master_Plan_Area.jpg",
  "riodejaneiro": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Cidade_Maravilhosa.jpg/960px-Cidade_Maravilhosa.jpg",
  "machupicchu": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Machu_Picchu%2C_2023_%28012%29.jpg/960px-Machu_Picchu%2C_2023_%28012%29.jpg",
  "buenosaires": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Puerto_Madero%2C_Buenos_Aires_%2840689219792%29_%28cropped%29.jpg/960px-Puerto_Madero%2C_Buenos_Aires_%2840689219792%29_%28cropped%29.jpg",
  "santiago": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Palacio_de_La_Moneda_-_miguelreflex.jpg/960px-Palacio_de_La_Moneda_-_miguelreflex.jpg",
  "sydney": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg/960px-Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg",
  "melbourne": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Melburnian_Skyline.jpg/960px-Melburnian_Skyline.jpg",
  "queenstown": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Queenstown_1_%288168013172%29.jpg/960px-Queenstown_1_%288168013172%29.jpg",
  "auckland": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Auckland_skyline_-_May_2024_%282%29.jpg/960px-Auckland_skyline_-_May_2024_%282%29.jpg",
  "newdelhi": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Forecourt%2C_Rashtrapati_Bhavan_-_1.jpg/960px-Forecourt%2C_Rashtrapati_Bhavan_-_1.jpg",
  "mumbai": "https://upload.wikimedia.org/wikipedia/commons/e/e9/Mumbai_India_Bridge.jpg",
  "jaipur": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg/960px-East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg",
  "leh": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Leh_City_seen_from_Shanti_Stupa.JPG/960px-Leh_City_seen_from_Shanti_Stupa.JPG",
  "goa": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/BeachFun.jpg/960px-BeachFun.jpg"
};

// Removed duplicate map export; imports handles this.


let customUserCities = [];

// Called by AuthContext on login/logout to swap in the user's saved cities
export const setUserCities = (cities) => {
  customUserCities = cities.map(c => ({ ...c, isCustom: true }));
};

export const addCustomCity = (incomingCity) => {
  const newCity = {
    ...incomingCity,
    id: incomingCity.id || `custom_${Date.now()}`,
    isCustom: true
  };
  // Only add if not already present
  if (!customUserCities.find(c => c.id === newCity.id)) {
    customUserCities.push(newCity);
  }
  window.dispatchEvent(new Event('cities_updated'));
  return newCity;
};

export const fetchCities = async () => {
  const defaultList = [
    { id: "paris", name: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
    { id: "rome", name: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964 },
    { id: "zurich", name: "Zurich", country: "Switzerland", lat: 47.3769, lng: 8.5417 },
    { id: "amsterdam", name: "Amsterdam", country: "Netherlands", lat: 52.3676, lng: 4.9041 },
    { id: "barcelona", name: "Barcelona", country: "Spain", lat: 41.3851, lng: 2.1734 },
    { id: "reykjavik", name: "Reykjavik", country: "Iceland", lat: 64.1466, lng: -21.9426 },
    { id: "london", name: "London", country: "UK", lat: 51.5074, lng: -0.1278 },
    { id: "prague", name: "Prague", country: "Czech Republic", lat: 50.0755, lng: 14.4378 },
    { id: "tokyo", name: "Tokyo", country: "Japan", lat: 35.6895, lng: 139.6917 },
    { id: "bali", name: "Bali", country: "Indonesia", lat: -8.3405, lng: 115.0920 },
    { id: "bangkok", name: "Bangkok", country: "Thailand", lat: 13.7563, lng: 100.5018 },
    { id: "singapore", name: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198 },
    { id: "dubai", name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708 },
    { id: "seoul", name: "Seoul", country: "South Korea", lat: 37.5665, lng: 126.9780 },
    { id: "hongkong", name: "Hong Kong", country: "Hong Kong", lat: 22.3193, lng: 114.1694 },
    { id: "capetown", name: "Cape Town", country: "South Africa", lat: -33.9249, lng: 18.4241 },
    { id: "nairobi", name: "Nairobi", country: "Kenya", lat: -1.2921, lng: 36.8219 },
    { id: "marrakech", name: "Marrakech", country: "Morocco", lat: 31.6295, lng: -7.9811 },
    { id: "cairo", name: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357 },
    { id: "newyork", name: "New York", country: "USA", lat: 40.7128, lng: -74.0060 },
    { id: "losangeles", name: "Los Angeles", country: "USA", lat: 34.0522, lng: -118.2437 },
    { id: "sanfrancisco", name: "San Francisco", country: "USA", lat: 37.7749, lng: -122.4194 },
    { id: "banff", name: "Banff", country: "Canada", lat: 51.1784, lng: -115.5708 },
    { id: "vancouver", name: "Vancouver", country: "Canada", lat: 49.2827, lng: -123.1207 },
    { id: "riodejaneiro", name: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lng: -43.1729 },
    { id: "machupicchu", name: "Machu Picchu", country: "Peru", lat: -13.1631, lng: -72.5450 },
    { id: "buenosaires", name: "Buenos Aires", country: "Argentina", lat: -34.6037, lng: -58.3816 },
    { id: "santiago", name: "Santiago", country: "Chile", lat: -33.4489, lng: -70.6693 },
    { id: "sydney", name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093 },
    { id: "melbourne", name: "Melbourne", country: "Australia", lat: -37.8136, lng: 144.9631 },
    { id: "queenstown", name: "Queenstown", country: "New Zealand", lat: -45.0312, lng: 168.6626 },
    { id: "auckland", name: "Auckland", country: "New Zealand", lat: -36.8485, lng: 174.7633 },
    { id: "newdelhi", name: "New Delhi", country: "India", lat: 28.6139, lng: 77.2090 },
    { id: "mumbai", name: "Mumbai", country: "India", lat: 19.0760, lng: 72.8777 },
    { id: "jaipur", name: "Jaipur", country: "India", lat: 26.9124, lng: 75.7873 },
    { id: "leh", name: "Leh", country: "India", lat: 34.1526, lng: 77.5771 },
    { id: "goa", name: "Goa", country: "India", lat: 15.2993, lng: 74.1240 }
  ].map(city => ({
    ...city,
    thumbnail: imageMap[city.id] || "https://images.unsplash.com/photo-1473951574080-01fe45ec8643?w=800&q=80",
    details: cityDetailsMap[city.id] || {}
  }));

  // Resolve formatting of custom injection array dynamically aligning structural integrity
  const customListFormatted = customUserCities.map(city => ({
    id: city.id,
    name: city.name,
    country: "Custom Origin",
    lat: city.lat,
    lng: city.lng,
    thumbnail: city.thumbnail || "https://images.unsplash.com/photo-1473951574080-01fe45ec8643?w=800&q=80",
    isCustom: true,
    details: {
      founded: city.founded || "Modern Era",
      history: city.history || "No historical cache data found for this sector.",
      places: city.places ? city.places.split(',').map(s => s.trim()) : ["User Coordinates"],
      bestTime: "Anytime",
      traits: ["Custom Built"]
    }
  }));

  return [...defaultList, ...customListFormatted];
};

export const fetchCityDetails = async (id) => {
  const all = await fetchCities();
  return all.find(c => c.id === id) || null;
};
