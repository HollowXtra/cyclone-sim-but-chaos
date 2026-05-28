const TITLE = "Cyclone Simulator";
const VERSION_NUMBER = "0.4.30";

const SAVE_FORMAT = 10;  // Format #10 in use starting in v0.4.30
const EARLIEST_COMPATIBLE_FORMAT = 0;
const ENVDATA_COMPATIBLE_FORMAT = 0;

const WIDTH = 960; // 16:9 aspect ratio
const HEIGHT = 540;
const DIAMETER = 20;    // Storm icon diameter
const PERLIN_ZOOM = 100;    // Resolution for perlin noise
const TICK_DURATION = 3600000;  // How long in sim time does a tick last in milliseconds (1 hour)
const ADVISORY_TICKS = 6;    // Number of ticks per advisory
const YEAR_LENGTH = 365.2425*24;        // The length of a year in ticks; used for seasonal activity
const STEP = 30;            // Number of milliseconds in real time a simulation step lasts at default speed
const NHEM_DEFAULT_YEAR = moment.utc().year();
const SHEM_DEFAULT_YEAR = moment.utc().month() < 6 ? NHEM_DEFAULT_YEAR : NHEM_DEFAULT_YEAR+1;
const DEPRESSION_LETTER = "H";
const WINDSPEED_ROUNDING = 5;
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const CUSTOM_MAP_LAYOUTS = ['Archipelago','Split Continents','Central Continent','Broken World'];
const CUSTOM_MAP_LAND_LEVELS = ['Sparse','Balanced','Land Heavy'];
const CUSTOM_MAP_CHAOS_LEVELS = ['Low','Medium','High','Extreme'];
const CUSTOM_MAP_MOUNTAIN_LEVELS = ['Low','Medium','High'];
const ENSO_AUTO = 0;
const ENSO_EL_NINO = 1;
const ENSO_NEUTRAL = 2;
const ENSO_LA_NINA = 3;
const ENSO_MODE_LABELS = ['Auto','El Nino','Neutral','La Nina'];
const ENSO_PHASE_LABELS = ['La Nina','Neutral','El Nino'];
const CUSTOM_MAP_DEFAULTS = {
    layout: 1,
    land: 1,
    chaos: 2,
    mountains: 1
};
// const MAP_DEFINITION = 2;   // normal scaler for the land map
const EARTH_SB_IDS = {
    world: 0,
    nhem: 1,
    atl: 2,
    atlland: 3,
    epac: 4,
    epacland: 5,
    cpac: 6,
    wpac: 7,
    pagasa: 8,
    bob: 9,
    arb: 10,
    nioland: 11,
    medi: 12,
    shem: 128,
    aus: 129,
    jakarta: 130,
    pm: 131,
    swio: 132,
    spac: 133,
    satl: 134,
    nio: 192
};
const MAP_TYPES = [     // Land generation controls and option presets for different map types
    {   
		label: "Two Continents",
        form: "linear",
        landBiasFactors: [
            5/8,        // Where the "center" should be for land/ocean bias (0-1 scale from west to east)
            0.15,       // Bias factor for the west edge (positive = land more likely, negative = sea more likely)
            -0.3,       // Bias factor for the "center" (as defined by .landBiasFactors[0])
            0.1         // Bias factor for the east edge
        ],
        optionPresets: {
            designations: 22
        }
    },
    {   
		label: "East Continent",
        form: "linear",
        landBiasFactors: [
            5/8,
            -0.3,
            -0.3,
            0.15
        ],
        optionPresets: {
            designations: 22
        }
    },
    {   
		label: "West Continent",
        form: "linear",
        landBiasFactors: [
            1/2,
            0.15,
            -0.3,
            -0.3
        ],
        optionPresets: {
            designations: 22
        }
    },
    {   
		label: "Island Ocean",
        form: "linear",
        landBiasFactors: [
            1/2,
            -0.28,
            -0.28,
            -0.28
        ],
        optionPresets: {
            designations: 22
        }
    },
    {   
		label: "Central Continent",
        form: "radial",
        landBiasFactors: [
            1/2,    // Where the east-west center should be (0-1 scale from west to east)
            1/2,    // Where the north-south center should be (0-1 scale from north to south)
            1/2,    // First control distance (in terms of the geometric mean of the canvas dimensions)
            1,      // Second control distance
            0.15,   // Bias factor for the center
            -0.27,   // Bias factor for the first control distance
            -0.3    // Bias factor for the second control distance and outward
        ],
        optionPresets: {
            designations: 22
        }
    },
    {   
		label: "Central Inland Sea",
        form: "radial",
        landBiasFactors: [
            1/2,
            1/2,
            3/8,
            1,
            -0.3,
            0.2,
            0.3
        ],
        optionPresets: {
            designations: 22
        }
    },
    {   
		label: "Atlantic",
        form: 'earth',
        west: -102.67,
        east: 3,
        north: 59.45,
        south: 0,
        mainSubBasin: EARTH_SB_IDS.atl,
        optionPresets: {
            hem: 1,
            scale: 0,
            designations: 0
        }
    },
    {   
		label: "Eastern Pacific",
        form: 'earth',
        west: -180,
        east: -74.33,
        north: 59.45,
        south: 0,
        mainSubBasin: EARTH_SB_IDS.epac,
        optionPresets: {
            hem: 1,
            scale: 0,
            designations: 1
        }
    },
    {   
		label: "Western Pacific",
        form: 'earth',
        west: 94.42,
        east: -159.91,
        north: 59.45,
        south: 0,
        mainSubBasin: EARTH_SB_IDS.wpac,
        optionPresets: {
            hem: 1,
            scale: 3,
            designations: 3
        }
    },
    {   
		label: "Northern Indian Ocean",
        form: 'earth',
        west: 25.95,
        east: 131.62,
        north: 59.45,
        south: 0,
        mainSubBasin: EARTH_SB_IDS.nio,
        optionPresets: {
            hem: 1,
            scale: 4,
            designations: 5
        }
    },
    {   
		label: "Australian Region",
        form: 'earth',
        west: 82.03,
        east: -172.29,
        north: 0,
        south: -59.45,
        mainSubBasin: EARTH_SB_IDS.aus,
        optionPresets: {
            hem: 2,
            scale: 2,
            designations: 6
        }
    },
    {   
		label: "South Pacific",
        form: 'earth',
        west: 147.2,
        east: -107.13,
        north: 0,
        south: -59.45,
        mainSubBasin: EARTH_SB_IDS.spac,
        optionPresets: {
            hem: 2,
            scale: 2,
            designations: 7
        }
    },
    {   
		label: "South-West Indian Ocean",
        form: 'earth',
        west: 17.25,
        east: 122.93,
        north: 0,
        south: -59.45,
        mainSubBasin: EARTH_SB_IDS.swio,
        optionPresets: {
            hem: 2,
            scale: 5,
            designations: 8
        }
    },
    {   
		label: "South Atlantic",
        form: 'earth',
        west: -81.48,
        east: 24.19,
        north: 0,
        south: -59.45,
        mainSubBasin: EARTH_SB_IDS.satl,
        optionPresets: {
            hem: 2,
            scale: 0,
            designations: 9
        }
    },
    {   
		label: "Mediterranean",
        form: 'earth',
        west: -10.32,
        east: 42.52,
        north: 55.38,
        south: 25.65,
        mainSubBasin: EARTH_SB_IDS.medi,
        optionPresets: {
            hem: 1,
            scale: 0,
            designations: 10
        }
    },
    {
        label: "Custom Map",
        form: "custom",
        optionPresets: {
            designations: 22,
            customMap: CUSTOM_MAP_DEFAULTS
        }
    }
];
const EARTH_MAP_PATH = 'resources/earth.png';
const EXTROP = 0;
const SUBTROP = 1;
const TROP = 2;
const TROPWAVE = 3;
const STORM_TYPES = 4;
const KEY_LEFT_BRACKET = 219;
const KEY_RIGHT_BRACKET = 221;
const KEY_F11 = 122;
const KEY_REPEAT_COOLDOWN = 15;
const KEY_REPEATER = 5;
const MAX_SNOW_LAYERS = 50;
const SNOW_SEASON_OFFSET = 5/6;
const ENV_LAYER_TILE_SIZE = 20;
const NC_OFFSET_RANDOM_FACTOR = 4096;
const ACE_WIND_THRESHOLD = 34;
const ACE_DIVISOR = 10000;
const DAMAGE_DIVISOR = 1000;
const ENVDATA_NOT_FOUND_ERROR = "envdata-not-found";
const LOADED_SEASON_REQUIRED_ERROR = "loaded-season-required";
const LOAD_MENU_BUTTONS_PER_PAGE = 6;
const DEFAULT_MAIN_SUBBASIN = 0;
const DEFAULT_OUTBASIN_SUBBASIN = 255;
const DESIG_CROSSMODE_ALWAYS = 0;
const DESIG_CROSSMODE_STRICT_ALWAYS = 1;
const DESIG_CROSSMODE_REGEN = 2;
const DESIG_CROSSMODE_STRICT_REGEN = 3;
const DESIG_CROSSMODE_KEEP = 4;
const SCALE_MEASURE_ONE_MIN_KNOTS = 0;
const SCALE_MEASURE_TEN_MIN_KNOTS = 1;
const SCALE_MEASURE_MILLIBARS = 2;
const SCALE_MEASURE_INHG = 3;
const SCALE_MEASURE_ONE_MIN_MPH = 4;
const SCALE_MEASURE_TEN_MIN_MPH = 5;
const SCALE_MEASURE_ONE_MIN_KMH = 6;
const SCALE_MEASURE_TEN_MIN_KMH = 7;
const MIN_SPEED = -5;
const MAX_SPEED = 5;

// Saving/loading-related constants

const AUTOSAVE_SAVE_NAME = "Autosave";
const DB_KEY_SETTINGS = "settings";
const LOADED_SEASON_EXPIRATION = 150000;    // minimum duration in miliseconds after a season was last accessed before it unloads (2.5 minutes)
const FORMAT_WITH_SAVED_SEASONS = 1;
const FORMAT_WITH_INDEXEDDB = 2;
const FORMAT_WITH_IMPROVED_ENV = 3;
const FORMAT_WITH_SUBBASIN_SEASON_STATS = 4;
const FORMAT_WITH_STORM_SUBBASIN_DATA = 5;
const FORMAT_WITH_SCALES = 6;
const FORMAT_WITH_EARTH_SUBBASINS = 7;
const FORMAT_WITH_LONG_LAT = 7;
const FORMAT_WITH_CUSTOM_MAPS = 8;
const FORMAT_WITH_LANDFALL_MARKERS = 9;
const FORMAT_WITH_ENSO = 10;

const GLOBAL_CHAT_TOPIC = "cyclone-sim-but-chaos-global-v1";
const GLOBAL_CHAT_MAX_MESSAGES = 45;
const GLOBAL_CHAT_NAME_KEY = "cyclone-sim-global-chat-name";

const EARTH_CITY_LABELS = [
    {name: "Miami", longitude: -80.19, latitude: 25.76},
    {name: "Tampa", longitude: -82.46, latitude: 27.95},
    {name: "New Orleans", longitude: -90.07, latitude: 29.95},
    {name: "Houston", longitude: -95.37, latitude: 29.76},
    {name: "Corpus Christi", longitude: -97.40, latitude: 27.80},
    {name: "Veracruz", longitude: -96.14, latitude: 19.17},
    {name: "Cancun", longitude: -86.85, latitude: 21.16},
    {name: "Havana", longitude: -82.37, latitude: 23.11},
    {name: "Kingston", longitude: -76.79, latitude: 17.97},
    {name: "San Juan", longitude: -66.11, latitude: 18.47},
    {name: "Bermuda", longitude: -64.75, latitude: 32.30},
    {name: "Charleston", longitude: -79.93, latitude: 32.78},
    {name: "Cape Hatteras", longitude: -75.53, latitude: 35.25},
    {name: "New York", longitude: -74.01, latitude: 40.71},
    {name: "Boston", longitude: -71.06, latitude: 42.36},
    {name: "Halifax", longitude: -63.58, latitude: 44.65},
    {name: "Los Angeles", longitude: -118.24, latitude: 34.05},
    {name: "San Diego", longitude: -117.16, latitude: 32.72},
    {name: "Cabo San Lucas", longitude: -109.91, latitude: 22.89},
    {name: "Acapulco", longitude: -99.89, latitude: 16.86},
    {name: "Puerto Vallarta", longitude: -105.23, latitude: 20.65},
    {name: "Honolulu", longitude: -157.86, latitude: 21.31},
    {name: "Hilo", longitude: -155.09, latitude: 19.71},
    {name: "Tokyo", longitude: 139.69, latitude: 35.68},
    {name: "Osaka", longitude: 135.50, latitude: 34.69},
    {name: "Taipei", longitude: 121.57, latitude: 25.03},
    {name: "Manila", longitude: 120.98, latitude: 14.60},
    {name: "Hong Kong", longitude: 114.17, latitude: 22.32},
    {name: "Shanghai", longitude: 121.47, latitude: 31.23},
    {name: "Guam", longitude: 144.79, latitude: 13.44},
    {name: "Saipan", longitude: 145.75, latitude: 15.18},
    {name: "Da Nang", longitude: 108.22, latitude: 16.05},
    {name: "Mumbai", longitude: 72.88, latitude: 19.08},
    {name: "Karachi", longitude: 67.01, latitude: 24.86},
    {name: "Muscat", longitude: 58.41, latitude: 23.59},
    {name: "Chennai", longitude: 80.27, latitude: 13.08},
    {name: "Kolkata", longitude: 88.36, latitude: 22.57},
    {name: "Dhaka", longitude: 90.41, latitude: 23.81},
    {name: "Yangon", longitude: 96.16, latitude: 16.87},
    {name: "Perth", longitude: 115.86, latitude: -31.95},
    {name: "Darwin", longitude: 130.84, latitude: -12.46},
    {name: "Brisbane", longitude: 153.03, latitude: -27.47},
    {name: "Cairns", longitude: 145.77, latitude: -16.92},
    {name: "Sydney", longitude: 151.21, latitude: -33.87},
    {name: "Port Moresby", longitude: 147.18, latitude: -9.44},
    {name: "Noumea", longitude: 166.45, latitude: -22.27},
    {name: "Suva", longitude: 178.44, latitude: -18.12},
    {name: "Apia", longitude: -171.75, latitude: -13.83},
    {name: "Papeete", longitude: -149.57, latitude: -17.54},
    {name: "Auckland", longitude: 174.76, latitude: -36.85},
    {name: "Cape Town", longitude: 18.42, latitude: -33.92},
    {name: "Maputo", longitude: 32.59, latitude: -25.97},
    {name: "Antananarivo", longitude: 47.51, latitude: -18.88},
    {name: "Port Louis", longitude: 57.50, latitude: -20.16},
    {name: "Saint-Denis", longitude: 55.45, latitude: -20.88},
    {name: "Moroni", longitude: 43.26, latitude: -11.70},
    {name: "Rio de Janeiro", longitude: -43.17, latitude: -22.91},
    {name: "Santos", longitude: -46.33, latitude: -23.96},
    {name: "Salvador", longitude: -38.50, latitude: -12.97},
    {name: "Fortaleza", longitude: -38.54, latitude: -3.73},
    {name: "Lisbon", longitude: -9.14, latitude: 38.72},
    {name: "Barcelona", longitude: 2.17, latitude: 41.38},
    {name: "Marseille", longitude: 5.37, latitude: 43.30},
    {name: "Rome", longitude: 12.50, latitude: 41.90},
    {name: "Athens", longitude: 23.73, latitude: 37.98},
    {name: "Istanbul", longitude: 28.98, latitude: 41.01},
    {name: "Tunis", longitude: 10.18, latitude: 36.81},
    {name: "Algiers", longitude: 3.06, latitude: 36.75}
];

const GENERATED_CITY_NAMES = [
    "Port Azure", "Bayhaven", "Stormreach", "Cape Vela", "Mariner's Rest",
    "Harbor Nine", "Isla Verde", "New Calder", "Tidewatch", "Windward",
    "Laguna Alta", "Ridgeport", "Seabright", "Coral Gate", "Meridian",
    "Holloway", "Eastbreak", "Sable Point", "Driftwood", "Northstar",
    "Southmark", "Crescent Bay", "Iron Coast", "Pelican Point", "Aurora"
];

// Legacy saving/loading-related constants (backwards-compatibility)

const LEGACY_SAVE_NAME_PREFIX = "Slot ";
const LOCALSTORAGE_KEY_PREFIX = "cyclone-sim-";
const LOCALSTORAGE_KEY_SAVEDBASIN = "savedbasin-";
const LOCALSTORAGE_KEY_BASIN = "basin";
const LOCALSTORAGE_KEY_FORMAT = "format";
const LOCALSTORAGE_KEY_NAMES = "names";
const LOCALSTORAGE_KEY_SEASON = "season-";
const LOCALSTORAGE_KEY_SETTINGS = "settings";
const SAVING_RADIX = 36;
// const ENVDATA_SAVE_FLOAT = -2;
const ENVDATA_SAVE_MULT = 10000;
// const ACTIVESYSTEM_SAVE_FLOAT = -2;

const HELP_TEXT = "Keyboard Controls:\n" +
    "\t\tSPACE - Pause/resume simulation\n" +
    "\t\tA - Step simulation one hour while paused\n" +
    "\t\tE - Cycle through map layers\n" +
    "\t\tT - Cycle through track display modes\n" +
    "\t\tW - Toggle intensity indicators below storm icons (kts / hPa)\n" +
    "\t\tM - Toggle magnifying glass for map layers\n" +
    "\t\t[ - Decrease simulation speed (half)\n" +
    "\t\t] - Increase simulation speed (double)\n" +
    "\t\tLEFT ARROW - Step backwards through analysis\n" +
    "\t\tRIGHT ARROW - Step forewards through analysis\n" +
    "\t\tCLICK + [special key] - Spawn [corresponding storm system]\n" +
    "\t\t\t\tX - Extratropical cyclone\n" +
    "\t\t\t\tL - Tropical Low/Wave\n" +
    "\t\t\t\tD - Tropical Depression\n" +
    "\t\t\t\tS - Tropical Storm\n" +
    "\t\t\t\t[number key 1-9] - Category [1-9]* Tropical Cyclone\n" +
    '\t\t\t\t0 - Category 10* Tropical Cyclone\n' +
    '\t\t\t\tY - Hyperclone*\n' +
    '\t\t\t\t\t*must use Extended Saffir-Simpson scale to see C6+ storms';

const COLORS = {};      // For storing all colors used in the graphics

function defineColors(){    // Since p5 color() function doesn't work until setup(), this is called in setup()
    COLORS.bg = color(10,55,155);
    COLORS.storm = {};
    COLORS.storm[EXTROP] = color(220,220,220);
    COLORS.storm[TROPWAVE] = color(130,130,240);
    COLORS.storm.extL = "red";
    COLORS.land = [];
    COLORS.land.push([0.85, color(190,190,190)]);
    COLORS.land.push([0.8, color(160,160,160)]);
    COLORS.land.push([0.75, color(145,115,90)]);
    COLORS.land.push([0.7, color(160,125,100)]);
    COLORS.land.push([0.65, color(35,145,35)]);
    COLORS.land.push([0.6, color(35,160,35)]);
    COLORS.land.push([0.55, color(30,175,30)]);
    COLORS.land.push([0.53, color(205,205,105)]);
    COLORS.land.push([0.5, color(230,230,105)]);
    COLORS.snow = color(240);
    COLORS.outBasin = color(45,70,120);
    COLORS.subBasinOutline = color(255,255,0);
    COLORS.UI = {};
    COLORS.UI.bar = color(200,100);
    COLORS.UI.box = color(200,170);
    COLORS.UI.buttonBox = color(200,170);
    COLORS.UI.buttonHover = color(200);
    COLORS.UI.text = color(0);
    COLORS.UI.greyText = color(130);
    COLORS.UI.redText = color(240,0,0);
    COLORS.UI.nonSelectedInput = color(70);
    COLORS.UI.input = color(255);
    COLORS.UI.loadingSymbol = color(0,40,85);
    COLORS.UI.buttonStroke = color(45,70,90,120);
    COLORS.UI.menuPanel = color(6,18,32,205);
    COLORS.UI.menuPanel2 = color(240,248,250,225);
    COLORS.UI.menuText = color(240,248,255);
    COLORS.UI.menuMuted = color(180,205,220);
    COLORS.UI.accent = color(255,176,42);
    COLORS.UI.greenAccent = color(95,220,165);
    COLORS.UI.chatMine = color(215,240,255,230);
    COLORS.UI.chatOther = color(246,248,240,230);
    COLORS.cityLabel = color(255,248,205);
    COLORS.cityDot = color(30,35,45);
    COLORS.landfallMarker = color(255,126,28);
}
