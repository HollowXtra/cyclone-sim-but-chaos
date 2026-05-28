// ---- Simulation Modes ---- //

const SIMULATION_MODES = ['Normal','Hyper','Wild','Megablobs','Experimental','Spooky','Realistic Chaos']; // Labels for sim mode selector UI
const SIM_MODE_NORMAL = 0;
const SIM_MODE_HYPER = 1;
const SIM_MODE_WILD = 2;
const SIM_MODE_MEGABLOBS = 3;
const SIM_MODE_EXPERIMENTAL = 4;
const SIM_MODE_SPOOKY = 5;
const SIM_MODE_CHAOS = 6;

// ---- Active Attributes ---- //

// Active attributes are data of ActiveSystem not inherited from StormData; used for simulation of active storm systems
// Here defines the names of these attributes for a given simulation mode

const ACTIVE_ATTRIBS = {};

ACTIVE_ATTRIBS.defaults = [
    'organization',
    'lowerWarmCore',
    'upperWarmCore',
    'depth'
];

ACTIVE_ATTRIBS[SIM_MODE_EXPERIMENTAL] = [
    'organization',
    'lowerWarmCore',
    'upperWarmCore',
    'depth',
    'kaboom'
];

ACTIVE_ATTRIBS[SIM_MODE_CHAOS] = [
    'organization',
    'lowerWarmCore',
    'upperWarmCore',
    'depth',
    'coreHeat',
    'coldWake',
    'eyewallCycle',
    'satelliteCooldown'
];

// ---- Season Curve ---- //

const SEASON_CURVE = {};

SEASON_CURVE.default = 'seasonalSine';
SEASON_CURVE[SIM_MODE_SPOOKY] = 'spookySeasonCurve';


// ---- Spawn Rules ---- //

const SPAWN_RULES = {};

SPAWN_RULES.defaults = {};
SPAWN_RULES[SIM_MODE_NORMAL] = {};
SPAWN_RULES[SIM_MODE_HYPER] = {};
SPAWN_RULES[SIM_MODE_WILD] = {};
SPAWN_RULES[SIM_MODE_MEGABLOBS] = {};
SPAWN_RULES[SIM_MODE_EXPERIMENTAL] = {};
SPAWN_RULES[SIM_MODE_SPOOKY] = {};
SPAWN_RULES[SIM_MODE_CHAOS] = {};

// -- Defaults -- //

SPAWN_RULES.defaults.archetypes = {
    'tw': {
        x: ()=>random(0,WIDTH-1),
        y: (b)=>b.hemY(random(HEIGHT*0.7,HEIGHT*0.9)),
        pressure: [1000, 1020],
        windSpeed: [15, 35],
        type: TROPWAVE,
        organization: [0,0.3],
        lowerWarmCore: 1,
        upperWarmCore: 1,
        depth: 0
    },
    'ex': {
        x: ()=>random(0,WIDTH-1),
        y: (b,x)=>b.hemY(b.env.get("jetstream",x,0,b.tick)+random(-75,75)),
        pressure: [1000, 1020],
        windSpeed: [15, 35],
        type: EXTROP,
        organization: 0,
        lowerWarmCore: 0,
        upperWarmCore: 0,
        depth: 1
    },
    'l': {
        inherit: 'tw',
        pressure: 1015,
        windSpeed: 15,
        organization: 0.2
    },
    'x': {
        inherit: 'ex',
        pressure: 1005,
        windSpeed: 15
    },
    'tc': {
        pressure: 1005,
        windSpeed: 25,
        type: TROP,
        organization: 1,
        lowerWarmCore: 1,
        upperWarmCore: 1,
        depth: 0
    },
    'stc': {
        inherit: 'tc',
        type: SUBTROP,
        lowerWarmCore: 0.6,
        upperWarmCore: 0.5
    },
    'd': {
        inherit: 'tc'
    },
    'D': {
        inherit: 'stc'
    },
    's': {
        inherit: 'tc',
        pressure: 995,
        windSpeed: 45
    },
    'S': {
        inherit: 'stc',
        pressure: 995,
        windSpeed: 45
    },
    '1': {
        inherit: 'tc',
        pressure: 985,
        windSpeed: 70
    },
    '2': {
        inherit: 'tc',
        pressure: 975,
        windSpeed: 90
    },
    '3': {
        inherit: 'tc',
        pressure: 960,
        windSpeed: 105
    },
    '4': {
        inherit: 'tc',
        pressure: 945,
        windSpeed: 125
    },
    '5': {
        inherit: 'tc',
        pressure: 925,
        windSpeed: 145
    },
    '6': {
        inherit: 'tc',
        pressure: 890,
        windSpeed: 170
    },
    '7': {
        inherit: 'tc',
        pressure: 840,
        windSpeed: 210
    },
    '8': {
        inherit: 'tc',
        pressure: 800,
        windSpeed: 270
    },
    '9': {
        inherit: 'tc',
        pressure: 765,
        windSpeed: 330
    },
    '0': {
        inherit: 'tc',
        pressure: 730,
        windSpeed: 400
    },
    'y': {
        inherit: 'tc',
        pressure: 690,
        windSpeed: 440
    }
};

SPAWN_RULES.defaults.doSpawn = function(b){
    // tropical waves
    if(random()<0.015*sq((seasonCurve(b.tick)+1)/2)*b.ensoSpawnModifier(b.tick)) b.spawnArchetype('tw');

    // extratropical cyclones
    if(random()<0.01-0.002*seasonCurve(b.tick)) b.spawnArchetype('ex');
};

// -- Normal Mode -- //

SPAWN_RULES[SIM_MODE_NORMAL].doSpawn = SPAWN_RULES.defaults.doSpawn;

// -- Hyper Mode -- //

SPAWN_RULES[SIM_MODE_HYPER].doSpawn = function(b){
    if(random()<(0.013*sq((seasonCurve(b.tick)+1)/2)+0.002)*b.ensoSpawnModifier(b.tick)) b.spawnArchetype('tw');

    if(random()<0.01-0.002*seasonCurve(b.tick)) b.spawnArchetype('ex');
};

// -- Wild Mode -- //

SPAWN_RULES[SIM_MODE_WILD].archetypes = {
    'tw': {
        x: ()=>random(0,WIDTH-1),
        y: (b)=>b.hemY(random(HEIGHT*0.2,HEIGHT*0.9)),
        pressure: [1000, 1020],
        windSpeed: [15, 35],
        type: TROPWAVE,
        organization: [0,0.3],
        lowerWarmCore: 1,
        upperWarmCore: 1,
        depth: 0
    }
};

SPAWN_RULES[SIM_MODE_WILD].doSpawn = function(b){
    if(random()<0.015*b.ensoSpawnModifier(b.tick)) b.spawnArchetype('tw');
    if(random()<0.01-0.002*seasonCurve(b.tick)) b.spawnArchetype('ex');
};

// -- Megablobs Mode -- //

SPAWN_RULES[SIM_MODE_MEGABLOBS].doSpawn = function(b){
    if(random()<(0.013*sq((seasonCurve(b.tick)+1)/2)+0.002)*b.ensoSpawnModifier(b.tick)) b.spawnArchetype('tw');

    if(random()<0.01-0.002*seasonCurve(b.tick)) b.spawnArchetype('ex');
};

// -- Experimental Mode -- //

SPAWN_RULES[SIM_MODE_EXPERIMENTAL].archetypes = {
    'tw': {
        x: ()=>random(0,WIDTH-1),
        y: (b)=>b.hemY(random(HEIGHT*0.7,HEIGHT*0.9)),
        pressure: [1000, 1020],
        windSpeed: [15, 35],
        type: TROPWAVE,
        organization: [0,0.3],
        lowerWarmCore: 1,
        upperWarmCore: 1,
        depth: 0,
        kaboom: 0
    },
    'ex': {
        x: ()=>random(0,WIDTH-1),
        y: (b,x)=>b.hemY(b.env.get("jetstream",x,0,b.tick)+random(-75,75)),
        pressure: [1000, 1020],
        windSpeed: [15, 35],
        type: EXTROP,
        organization: 0,
        lowerWarmCore: 0,
        upperWarmCore: 0,
        depth: 1,
        kaboom: 0
    },
    'tc': {
        pressure: 1005,
        windSpeed: 25,
        type: TROP,
        organization: 1,
        lowerWarmCore: 1,
        upperWarmCore: 1,
        depth: 0,
        kaboom: 0.2
    },
    'l': {
        inherit: 'tw',
        pressure: 1015,
        windSpeed: 15,
        organization: 0.2,
        kaboom: 0.2
    },
    'x': {
        inherit: 'ex',
        pressure: 1005,
        windSpeed: 15,
        kaboom: 0.2
    }
};

SPAWN_RULES[SIM_MODE_EXPERIMENTAL].doSpawn = SPAWN_RULES[SIM_MODE_HYPER].doSpawn;

// -- Spooky Mode -- //

SPAWN_RULES[SIM_MODE_SPOOKY].doSpawn = SPAWN_RULES.defaults.doSpawn;

// -- Realistic Chaos Mode -- //

SPAWN_RULES[SIM_MODE_CHAOS].archetypes = {
    'tw': {
        x: ()=>random(0,WIDTH-1),
        y: (b)=>b.hemY(random(HEIGHT*0.62,HEIGHT*0.92)),
        pressure: [1002, 1018],
        windSpeed: [15, 35],
        type: TROPWAVE,
        organization: [0,0.28],
        lowerWarmCore: 1,
        upperWarmCore: 1,
        depth: 0,
        coreHeat: [0,0.2],
        coldWake: 0,
        eyewallCycle: 0,
        satelliteCooldown: 0
    }
};

function chaosSpawnCandidate(b){
    let best;
    let bestScore = -Infinity;
    for(let i=0;i<8;i++){
        let x = random(0,WIDTH-1);
        let y = b.hemY(random(HEIGHT*0.58,HEIGHT*0.94));
        let lnd = land && land.get(Coordinate.convertFromXY(b.mapType,x,y));
        if(lnd) continue;
        let heat = b.env.get("oceanHeat",x,y,b.tick);
        let instability = b.env.get("instability",x,y,b.tick);
        let shear = b.env.get("shear",x,y,b.tick).mag();
        let pulse = b.env.get("monsoonPulse",x,y,b.tick);
        let score = heat*0.45 + instability*0.65 + pulse*0.35 + b.ensoActivityIndex(b.tick,x,y)*0.22 - map(shear,1,7,0,0.55,true) + random(-0.15,0.15);
        if(score > bestScore){
            bestScore = score;
            best = {x,y};
        }
    }
    return best;
}

SPAWN_RULES[SIM_MODE_CHAOS].doSpawn = function(b){
    let seasonal = sq((seasonCurve(b.tick)+1)/2);
    let pulse = b.env.get("instability",WIDTH/2,b.hemY(HEIGHT*0.78),b.tick);
    let spawnChance = (0.006 + 0.017*seasonal*map(pulse,0,1,0.45,1.65))*b.ensoSpawnModifier(b.tick);
    if(random()<spawnChance){
        let spot = chaosSpawnCandidate(b);
        if(spot) b.spawnArchetype('tw',spot.x,spot.y);
        else b.spawnArchetype('tw');
    }
    if(random()<0.0035*seasonal*map(pulse,0,1,0.2,1.4)*b.ensoSpawnModifier(b.tick)){
        let spot = chaosSpawnCandidate(b);
        if(spot) b.spawnArchetype('l',spot.x,spot.y);
    }
    if(random()<0.008-0.0015*seasonCurve(b.tick)) b.spawnArchetype('ex');
    for(let sys of b.activeSystems){
        if(sys.satelliteCooldown>0 || sys.windSpeed<90 || sys.organization<0.68) continue;
        let spin = b.env.get("monsoonPulse",sys.pos.x,sys.pos.y,b.tick);
        let chance = map(sys.windSpeed,90,160,0.001,0.011,true)*map(spin,0,1,0.4,1.8,true);
        if(random()<chance){
            let angle = random(TAU);
            let radius = random(45,95);
            let x = sys.pos.x + cos(angle)*radius;
            let y = sys.pos.y + sin(angle)*radius;
            if(coordinateInCanvas(x,y) && !land.get(Coordinate.convertFromXY(b.mapType,x,y))){
                b.spawnArchetype(random()<0.7 ? 'tw' : 'l',x,y);
                sys.satelliteCooldown = random(96,180);
            }
        }
    }
};


// ---- Definitions of Environmental Fields ---- //

const ENV_DEFS = {};

ENV_DEFS.defaults = {}; // Env field attributes that are the same across multiple simulation modes
ENV_DEFS[SIM_MODE_NORMAL] = {}; // Register env fields as part of "Normal" simulation mode and define unique attributes
ENV_DEFS[SIM_MODE_HYPER] = {}; // Same for "Hyper" simulation mode
ENV_DEFS[SIM_MODE_WILD] = {};  // "Wild" simulation mode
ENV_DEFS[SIM_MODE_MEGABLOBS] = {}; // "Megablobs" simulation mode
ENV_DEFS[SIM_MODE_EXPERIMENTAL] = {}; // "Experimental" simulation mode
ENV_DEFS[SIM_MODE_SPOOKY] = {}; // "Spooky" simulation mode
ENV_DEFS[SIM_MODE_CHAOS] = {}; // "Realistic Chaos" simulation mode

// -- Sample Env Field -- //

// ENV_DEFS.defaults.sample = {
//     version: 0,
//     mapFunc: (u,x,y,z)=>{
//         // Insert code here
//     },
//     hueMap: (v)=>{
//         // Insert code here
//     },
//     oceanic: true,
//     vector: false,
//     invisible: false,
//     magMap: undefined,
//     noWobble: false,
//     noiseChannels: [
//         [6,0.5,150,3000,0.05,1.5]
//     ]
// };
// ENV_DEFS[SIM_MODE_NORMAL].sample = {};
// ENV_DEFS[SIM_MODE_HYPER].sample = {
//     mapFunc: (u,x,y,z)=>{
//         // Insert code here
//     }
// };
// ENV_DEFS[SIM_MODE_WILD].sample = {};
// ENV_DEFS[SIM_MODE_MEGABLOBS].sample = {};
// ENV_DEFS[SIM_MODE_EXPERIMENTAL].sample = {};

// -- ENSO -- //

ENV_DEFS.defaults.ENSO = {
    displayName: 'ENSO phase',
    version: 0,
    mapFunc: (u,x,y,z)=>{
        let v = u.basin.ensoValue(z);
        let influence = u.basin.ensoActivityIndex(z,x,y);
        return constrain(v + influence*0.18,-1.2,1.2);
    },
    displayFormat: (v)=>{
        let label = abs(v) < 0.28 ? "Neutral" : v > 0 ? "El Nino" : "La Nina";
        return label + " (" + (v >= 0 ? "+" : "") + (round(v*100)/100) + ")";
    },
    hueMap: (v)=>{
        colorMode(HSB);
        let nina = color(220,95,75);
        let neutral = color(200,5,92);
        let nino = color(10,95,85);
        let c = v < 0 ? lerpColor(nina,neutral,map(v,-1,0,0,1)) :
            lerpColor(neutral,nino,map(v,0,1,0,1));
        colorMode(RGB);
        return c;
    },
    oceanic: true,
    noWobble: true
};
ENV_DEFS[SIM_MODE_NORMAL].ENSO = {};
ENV_DEFS[SIM_MODE_HYPER].ENSO = {};
ENV_DEFS[SIM_MODE_WILD].ENSO = {};
ENV_DEFS[SIM_MODE_MEGABLOBS].ENSO = {};
ENV_DEFS[SIM_MODE_EXPERIMENTAL].ENSO = {};
ENV_DEFS[SIM_MODE_SPOOKY].ENSO = {};
ENV_DEFS[SIM_MODE_CHAOS].ENSO = {};

// -- jetstream -- //

ENV_DEFS.defaults.jetstream = {
    version: 0,
    mapFunc: (u,x,y,z)=>{
        let v = u.noise(0,x-z*3,0,z);
        let peakLat = u.modifiers.peakLat;
        let antiPeakLat = u.modifiers.antiPeakLat;
        let peakRange = u.modifiers.peakRange;
        let antiPeakRange = u.modifiers.antiPeakRange;
        let s = seasonCurve(z);
        let l = map(sqrt(map(s,-1,1,0,1)),0,1,antiPeakLat,peakLat);
        let r = map(s,-1,1,antiPeakRange,peakRange);
        v = map(v,0,1,-r,r);
        return (l+v)*HEIGHT;
    },
    invisible: true,
    noiseChannels: [
        [4,0.5,160,300,1,2]
    ],
    modifiers: {
        peakLat: 0.35,
        antiPeakLat: 0.55,
        peakRange: 0.35,
        antiPeakRange: 0.5
    }
};
ENV_DEFS[SIM_MODE_NORMAL].jetstream = {};
ENV_DEFS[SIM_MODE_HYPER].jetstream = {
    modifiers: {
        peakLat: 0.25,
        antiPeakLat: 0.47,
        peakRange: 0.25,
        antiPeakRange: 0.45
    }
};
ENV_DEFS[SIM_MODE_WILD].jetstream = {
    mapFunc: (u,x,y,z)=>{
        let v = u.noise(0,x-z*3,0,z);
        let s = u.yearfrac(z);
        let l = u.piecewise(s,[[1,0.65],[2.5,-0.15],[10,-0.15],[11.5,0.65]]);
        let r = u.piecewise(s,[[0.5,0.3],[1.75,0.7],[3,0.2],[9.5,0.2],[10.75,0.7],[12,0.3]]);
        v = map(v,0,1,-r,r);
        return (l+v)*HEIGHT;
    }
};
ENV_DEFS[SIM_MODE_MEGABLOBS].jetstream = {
    modifiers: {
        peakLat: 0.25,
        antiPeakLat: 0.47,
        peakRange: 0.25,
        antiPeakRange: 0.45
    }
};
ENV_DEFS[SIM_MODE_EXPERIMENTAL].jetstream = {};
ENV_DEFS[SIM_MODE_SPOOKY].jetstream = {};
ENV_DEFS[SIM_MODE_CHAOS].jetstream = {
    modifiers: {
        peakLat: 0.28,
        antiPeakLat: 0.5,
        peakRange: 0.4,
        antiPeakRange: 0.55
    },
    noiseChannels: [
        [5,0.55,130,260,1.3,2.4]
    ]
};

// -- LLSteering -- //

ENV_DEFS.defaults.LLSteering = {
    displayName: 'Low-level steering',
    version: 0,
    mapFunc: (u,x,y,z)=>{
        u.vec.set(1);    // reset vector

        // Jetstream
        let j = u.field('jetstream');
        // Cosine curve from 0 at poleward side of map to 1 at equatorward side
        let h = map(cos(map(y,0,HEIGHT,0,PI)),-1,1,1,0);
        // westerlies
        let west = constrain(pow(1-h+map(u.noise(0), 0, 1, -u.modifiers.westerlyNoiseRange, u.modifiers.westerlyNoiseRange)+map(j, 0, HEIGHT, -u.modifiers.westerlyJetstreamEffectRange, u.modifiers.westerlyJetstreamEffectRange),2)*4,0, u.modifiers.westerlyMax);
        // ridging and trades
        let ridging = constrain(u.noise(1)+map(j, 0, HEIGHT, u.modifiers.ridgingJetstreamEffectRange, -u.modifiers.ridgingJetstreamEffectRange),0,1);
        let trades = constrain(pow(h+map(ridging, 0, 1, -u.modifiers.tradesRidgingEffectRange, u.modifiers.tradesRidgingEffectRange),2)*3,0, u.modifiers.tradesMax);
        let tAngle = map(h, 0.9, 1, u.modifiers.tradesAngle, u.modifiers.tradesAngleEquator); // trades angle
        // noise angle
        let a = map(u.noise(3),0,1,0,4*TAU);
        // noise magnitude
        let m = pow(u.modifiers.noiseBase, map(u.noise(2), 0, 1, u.modifiers.noiseExponentMin, u.modifiers.noiseExponentMax));

        // apply to vector
        u.vec.rotate(a);
        u.vec.mult(m);
        u.vec.add(west+trades*cos(tAngle),trades*sin(tAngle));
        return u.vec;
    },
    displayFormat: v=>{
        let speed = round(v.mag()*100)/100;
        let direction = v.heading();
        // speed is still in "u/hr" (coordinate units per hour) for now
        return speed + ' u/hr ' + compassHeading(direction);
    },
    vector: true,
    magMap: [0,3,0,16],
    noiseChannels: [
        [4,0.5,80,100,1,3],
        '',
        '',
        [4,0.5,170,300,1,3]
    ],
    modifiers: {
        westerlyNoiseRange: 0.3,
        westerlyJetstreamEffectRange: 0.4,
        westerlyMax: 4,
        ridgingJetstreamEffectRange: 0.3,
        tradesRidgingEffectRange: 0.3,
        tradesMax: 3,
        tradesAngleEquator: 17*Math.PI/16,
        tradesAngle: 511*Math.PI/512,
        noiseBase: 1.5,
        noiseExponentMin: -8,
        noiseExponentMax: 4
    }
};
ENV_DEFS[SIM_MODE_NORMAL].LLSteering = {};
ENV_DEFS[SIM_MODE_HYPER].LLSteering = {};
ENV_DEFS[SIM_MODE_WILD].LLSteering = {
    mapFunc: (u,x,y,z)=>{
        u.vec.set(1);    // reset vector

        let s = u.yearfrac(z);
        let wind = u.piecewise(s,[[1,3],[2.5,1],[4.5,0.5],[6,0.75],[7.5,0.65],[7.75,0.05],[8,1.1],[10,1.8],[11,3]]); // wind strength
        let windAngle = u.piecewise(s,[[1,13*PI/8],[2.5,9*PI/8],[4.5,PI],[6,17*PI/16],[7.5,17*PI/16],[8,31*PI/16],[10,15*PI/8],[11.5,13*PI/8]]); // wind angle
        // noise angle
        let a = map(u.noise(3),0,1,0,4*TAU);
        // noise magnitude
        let m = pow(u.modifiers.noiseBase, map(u.noise(2), 0, 1, u.modifiers.noiseExponentMin, u.modifiers.noiseExponentMax));

        // apply to vector
        u.vec.rotate(a);
        u.vec.mult(m);
        u.vec.add(wind*cos(windAngle),wind*sin(windAngle));
        return u.vec;
    },
    modifiers: {
        noiseExponentMin: -3,
        noiseExponentMax: 4
    }
};
ENV_DEFS[SIM_MODE_MEGABLOBS].LLSteering = {};
ENV_DEFS[SIM_MODE_EXPERIMENTAL].LLSteering = {};
ENV_DEFS[SIM_MODE_SPOOKY].LLSteering = {};
ENV_DEFS[SIM_MODE_CHAOS].LLSteering = {
    modifiers: {
        westerlyNoiseRange: 0.42,
        westerlyJetstreamEffectRange: 0.55,
        westerlyMax: 4.8,
        ridgingJetstreamEffectRange: 0.45,
        tradesRidgingEffectRange: 0.48,
        tradesMax: 3.5,
        noiseBase: 1.7,
        noiseExponentMin: -6,
        noiseExponentMax: 4.5
    },
    noiseChannels: [
        [5,0.52,70,85,1.25,3.2],
        '',
        '',
        [5,0.5,135,240,1.2,3.1]
    ]
};

// -- ULSteering -- //

ENV_DEFS.defaults.ULSteering = {
    displayName: 'Upper-level steering',
    version: 0,
    mapFunc: (u,x,y,z)=>{
        u.vec.set(1);                                                                           // reset vector

        const dx = u.modifiers.jetstreamDeltaX;                                                 // delta-x for jetstream differential (used for calculating wind direction in and near jetstream)

        let m = u.noise(1);

        let s = seasonCurve(z);
        let j0 = u.field('jetstream');                                                          // y-position of jetstream
        let j1 = u.field('jetstream',x+dx);                                                     // y-position of jetstream dx to the east for differential
        let j = abs(y-j0);                                                                      // distance of point north/south of jetstream
        let jet = pow(2, 3 - j / u.modifiers.jetstreamHalfDecay);                               // power of jetstream at point
        let jOP = pow(u.modifiers.jetstreamOverpowerBase, jet);                                 // factor for how strong other variables should be if 'overpowered' by jetstream
        let jAngle = atan((j1 - j0) / dx) + map(y-j0, -50, 50, u.modifiers.jetstreamInwardAngle, -u.modifiers.jetstreamInwardAngle, true); // angle of jetstream at point
        let trof = y>j0 ? pow(u.modifiers.troughBase, map(jAngle, -PI/2, PI/2, u.modifiers.troughExponentMax, u.modifiers.troughExponentMin)) * pow(0.7,j/20)*jOP : 0; // pole-eastward push from jetstream dips
        let tAngle = u.modifiers.troughAngle;                                                   // angle of push from jetstream dips
        let ridging = 0.45-j0/HEIGHT-map(sqrt(map(s,-1,1,0,1)),0,1,0.15,0);                     // how much 'ridge' or 'trough' there is from jetstream
        // power of winds equatorward of jetstream
        let hadley = (map(ridging, -0.3, 0.2, u.modifiers.hadleyUpperBound, u.modifiers.hadleyLowerBound, true) + map(m,0,1,-1.5,1.5))*jOP*(y>j0?1:0);
        // angle of winds equatorward of jetstream
        let hAngle = map(ridging,-0.3,0.2, u.modifiers.hadleyAngleMin, u.modifiers.hadleyAngleMax,true);
        let ferrel = 2*jOP*(y<j0?1:0);                                                          // power of winds poleward of jetstream
        let fAngle = 5*PI/8;                                                                    // angle of winds poleward of jetstream

        let a = map(u.noise(0),0,1,0,4*TAU);                                                    // noise angle
        m = pow(u.modifiers.noiseBase, map(m, 0, 1, u.modifiers.noiseExponentMin, u.modifiers.noiseExponentMax))*jOP; // noise magnitude

        // apply noise
        u.vec.rotate(a);
        u.vec.mult(m);

        // apply UL winds
        u.vec.add(jet*cos(jAngle),jet*sin(jAngle));                                             // apply jetstream
        u.vec.add(trof*cos(tAngle),trof*sin(tAngle));                                           // apply trough push
        u.vec.add(hadley*cos(hAngle),hadley*sin(hAngle));                                       // apply winds equatorward of jetstream
        u.vec.add(ferrel*cos(fAngle),ferrel*sin(fAngle));                                       // apply winds poleward of jetstream

        return u.vec;
    },
    displayFormat: v=>{
        let speed = round(v.mag()*100)/100;
        let direction = v.heading();
        // speed is still in "u/hr" (coordinate units per hour) for now
        return speed + ' u/hr ' + compassHeading(direction);
    },
    vector: true,
    magMap: [0,8,0,25],
    modifiers: {
        jetstreamDeltaX: 10,
        jetstreamHalfDecay: 40,
        jetstreamOverpowerBase: 0.7,
        jetstreamInwardAngle: Math.PI/4,
        troughBase: 1.7,
        troughExponentMin: -5,
        troughExponentMax: 3,
        troughAngle: -Math.PI/16,
        hadleyUpperBound: 5,
        hadleyLowerBound: 1.5,
        hadleyAngleMin: -Math.PI/16,
        hadleyAngleMax: -15*Math.PI/16,
        noiseBase: 1.5,
        noiseExponentMin: -8,
        noiseExponentMax: 4
    },
    noiseChannels: [
        [4,0.5,180,300,1,2],
        [4,0.5,90,100,1,3]
    ]
};
ENV_DEFS[SIM_MODE_NORMAL].ULSteering = {};
ENV_DEFS[SIM_MODE_HYPER].ULSteering = {
    modifiers: {
        hadleyUpperBound: 3
    }
};
ENV_DEFS[SIM_MODE_WILD].ULSteering = {
    mapFunc: (u,x,y,z)=>{
        u.vec.set(1);                                                                   // reset vector

        const dx = 10;                                                                  // delta-x for jetstream differential (used for calculating wind direction in and near jetstream)

        let m = u.noise(1);

        let s = u.yearfrac(z);
        let j0 = u.field('jetstream');                                                  // y-position of jetstream
        let j1 = u.field('jetstream',x+dx);                                             // y-position of jetstream dx to the east for differential
        let j = abs(y-j0);                                                              // distance of point north/south of jetstream
        let jet = pow(2,3-j/30);                                                        // power of jetstream at point
        let jOP = pow(0.7,jet);                                                         // factor for how strong other variables should be if 'overpowered' by jetstream
        let jAngle = atan((j1-j0)/dx)+map(y-j0,-50,50,PI/15,-PI/17,true);               // angle of jetstream at point
        // power of winds equatorward of jetstream
        let hadley = (u.piecewise(s,[[1,4.5],[2.5,1.2],[4,0.5],[4.5,1.7],[5,0.6],[6.5,0.65],[7.5,0.65],[7.75,0.05],[8,1.3],[9,1.7],[10,2.3],[11.5,4.5]]))*jOP*(y>j0?1:0);
        // angle of winds equatorward of jetstream
        let hAngle = u.piecewise(s,[[1,11*PI/8],[2.5,9*PI/8],[4,17*PI/16],[4.5,11*PI/8],[5,17*PI/16],[6.5,35*PI/32],[7.5,17*PI/16],[8,31*PI/16],[9,15*PI/8],[10,7*PI/4],[10.5,11*PI/8]]);
        let ferrel = 2*jOP*(y<j0?map(j0-y,0,400,1,0,true):0);                           // power of winds poleward of jetstream
        let fAngle = 5*PI/8;                                                            // angle of winds poleward of jetstream

        let a = map(u.noise(0),0,1,0,4*TAU);                                            // noise angle
        m = pow(u.modifiers.noiseBase, map(m, 0, 1, u.modifiers.noiseExponentMin, u.modifiers.noiseExponentMax))*jOP; // noise magnitude

        // apply noise
        u.vec.rotate(a);
        u.vec.mult(m);

        // apply UL winds
        u.vec.add(jet*cos(jAngle),jet*sin(jAngle));                                     // apply jetstream
        u.vec.add(hadley*cos(hAngle),hadley*sin(hAngle));                               // apply winds equatorward of jetstream
        u.vec.add(ferrel*cos(fAngle),ferrel*sin(fAngle));                               // apply winds poleward of jetstream

        return u.vec;
    },
    modifiers: {
        noiseExponentMin: -3,
        noiseExponentMax: 4
    }
};
ENV_DEFS[SIM_MODE_MEGABLOBS].ULSteering = {};
ENV_DEFS[SIM_MODE_EXPERIMENTAL].ULSteering = {};
ENV_DEFS[SIM_MODE_SPOOKY].ULSteering = {};
ENV_DEFS[SIM_MODE_CHAOS].ULSteering = {
    modifiers: {
        jetstreamHalfDecay: 34,
        jetstreamOverpowerBase: 0.68,
        jetstreamInwardAngle: Math.PI/3.5,
        troughBase: 1.95,
        troughExponentMin: -5.5,
        troughExponentMax: 3.5,
        hadleyUpperBound: 4.4,
        hadleyLowerBound: 1.2,
        noiseBase: 1.7,
        noiseExponentMin: -6,
        noiseExponentMax: 4.3
    },
    noiseChannels: [
        [5,0.52,145,260,1.1,2.3],
        [5,0.5,75,95,1.2,3.2]
    ]
};

// -- shear -- //

ENV_DEFS.defaults.shear = {
    displayName: 'Wind shear',
    version: 0,
    mapFunc: (u,x,y,z)=>{
        let ll = u.field('LLSteering');
        let ul = u.field('ULSteering');
        u.vec.set(ul);
        u.vec.sub(ll);
        u.vec.mult(u.basin.ensoShearFactor(z,x,y));
        return u.vec;
    },
    displayFormat: v=>{
        let speed = round(v.mag()*100)/100;
        let direction = v.heading();
        // speed is still in "u/hr" (coordinate units per hour) for now
        return speed + ' u/hr ' + compassHeading(direction);
    },
    vector: true,
    noVectorFlip: true,
    magMap: [0,8,0,25],
    hueMap: (v)=>{
        colorMode(HSB);
        let strong = color(0,100,80);
        let moderate = color(60,100,90);
        let weak = color(120,100,80);
        let c;
        if(v < 2)
            c = lerpColor(weak, moderate, map(v,0.5,2,0,1));
        else
            c = lerpColor(moderate, strong, map(v,2,3.5,0,1));
        colorMode(RGB);
        return c;
    }
};
ENV_DEFS[SIM_MODE_NORMAL].shear = {};
ENV_DEFS[SIM_MODE_HYPER].shear = {};
ENV_DEFS[SIM_MODE_WILD].shear = {};
ENV_DEFS[SIM_MODE_MEGABLOBS].shear = {};
ENV_DEFS[SIM_MODE_EXPERIMENTAL].shear = {};
ENV_DEFS[SIM_MODE_SPOOKY].shear = {};
ENV_DEFS[SIM_MODE_CHAOS].shear = {};

// -- SSTAnomaly -- //

ENV_DEFS.defaults.SSTAnomaly = {
    displayName: 'Sea surface temp. anomaly',
    version: 0,
    mapFunc: (u,x,y,z)=>{
        let v = u.noise(0);
        v = v*2;
        let i = v<1 ? -1 : 1;
        v = 1-abs(1-v);
        if(v===0) v = 0.000001;
        v = log(v);
        let r;
        if(u.modifiers.r!==undefined) r = u.modifiers.r;
        else r = map(y,0,HEIGHT,6,3);
        v = -r*v;
        v = v*i;
        if(u.modifiers.bigBlobBase!==undefined && v>u.modifiers.bigBlobExponentThreshold) v += pow(u.modifiers.bigBlobBase,v-u.modifiers.bigBlobExponentThreshold)-1;
        v += u.basin.ensoSSTAnomaly(x,y,z);
        return v;
    },
    displayFormat: v=>{
        let str = '';
        if(v >= 0)
            str += '+';
        str += round(v*10)/10;
        str += '\u2103'; // degrees celsius sign
        return str;
    },
    hueMap: (v)=>{
        colorMode(HSB);
        let cold = color(240,100,70);
        let hot = color(0,100,70);
        let cNeutral = color(240,1,90);
        let hNeutral = color(0,1,90);
        let c;
        if(v<0) c = lerpColor(cold,cNeutral,map(v,-5,0,0,1));
        else c = lerpColor(hNeutral,hot,map(v,0,5,0,1));
        colorMode(RGB);
        return c;
    },
    oceanic: true,
    noiseChannels: [
        [6,0.5,150,3000,0.05,1.5]
    ]
};
ENV_DEFS[SIM_MODE_NORMAL].SSTAnomaly = {};
ENV_DEFS[SIM_MODE_HYPER].SSTAnomaly = {};
ENV_DEFS[SIM_MODE_WILD].SSTAnomaly = {
    modifiers: {
        r: 5,
        bigBlobBase: 1.4,
        bigBlobExponentThreshold: 1.5
    }
};
ENV_DEFS[SIM_MODE_MEGABLOBS].SSTAnomaly = {
    modifiers: {
        r: 7,
        bigBlobBase: 1.8,
        bigBlobExponentThreshold: 1
    }
};
ENV_DEFS[SIM_MODE_EXPERIMENTAL].SSTAnomaly = {};
ENV_DEFS[SIM_MODE_SPOOKY].SSTAnomaly = {};
ENV_DEFS[SIM_MODE_CHAOS].SSTAnomaly = {
    modifiers: {
        r: 5.5,
        bigBlobBase: 1.25,
        bigBlobExponentThreshold: 1.8
    },
    noiseChannels: [
        [6,0.5,120,2400,0.08,1.6]
    ]
};

// -- SST -- //

ENV_DEFS.defaults.SST = {
    displayName: 'Sea surface temperature',
    version: 0,
    mapFunc: (u,x,y,z)=>{
        if(y<0) return 0;
        let anom = u.field('SSTAnomaly');
        let s = seasonCurve(z);
        let w = map(cos(map(x,0,WIDTH,0,PI)),-1,1,0,1);
        let h0 = y/HEIGHT;
        let h1 = (sqrt(h0)+h0)/2;
        let h2 = sqrt(sqrt(h0));
        let h = map(cos(lerp(PI,0,lerp(h1,h2,sq(w)))),-1,1,0,1);
        let ospt = u.modifiers.offSeasonPolarTemp;
        let pspt = u.modifiers.peakSeasonPolarTemp;
        let ostt = u.modifiers.offSeasonTropicsTemp;
        let pstt = u.modifiers.peakSeasonTropicsTemp;
        let t = lerp(map(s,-1,1,ospt,pspt),map(s,-1,1,ostt,pstt),h);
        return t+anom;
    },
    displayFormat: v=>{
        let str = '';
        str += round(v*10)/10;
        str += '\u2103'; // degrees celsius sign
        return str;
    },
    hueMap: (v)=>{
        colorMode(HSB);
        let c;
        if(v<10) c = lerpColor(color(240,1,100),color(240,100,70),map(v,0,10,0,1));
        else if(v<20) c = lerpColor(color(240,100,70),color(180,50,90),map(v,10,20,0,1));
        else if(v<26) c = lerpColor(color(180,50,90),color(120,100,65),map(v,20,26,0,1));
        else if(v<29) c = lerpColor(color(60,100,100),color(0,100,70),map(v,26,29,0,1));
        else if(v<34) c = lerpColor(color(359,100,70),color(300,5,100),map(v,29,34,0,1));
        else if(v<40) c = lerpColor(color(300,5,100),color(150,10,90),map(v,34,40,0,1));
        else if(v<50) c = lerpColor(color(150,10,90),color(150,60,75),map(v,40,50,0,1));
        else if(v<75) c = lerpColor(color(30,90,90),color(30,30,90),map(v,50,75,0,1));
        else if(v<150) c = lerpColor(color(0,0,35),color(0,0,95),map(v,75,150,0,1));
        else c = lerpColor(color(0,0,25),color(0,0,95),map(v%150,0,150,0,1));
        colorMode(RGB);
        return c;
    },
    oceanic: true,
    modifiers: {
        offSeasonPolarTemp: -3,
        peakSeasonPolarTemp: 10,
        offSeasonTropicsTemp: 26,
        peakSeasonTropicsTemp: 29
    }
};
ENV_DEFS[SIM_MODE_NORMAL].SST = {};
ENV_DEFS[SIM_MODE_HYPER].SST = {
    modifiers: {
        offSeasonPolarTemp: 5,
        peakSeasonPolarTemp: 20,
        offSeasonTropicsTemp: 31,
        peakSeasonTropicsTemp: 35
    }
};
ENV_DEFS[SIM_MODE_WILD].SST = {
    mapFunc: (u,x,y,z)=>{
        if(y<0) return 0;
        let anom = u.field('SSTAnomaly');
        let s = u.yearfrac(z);
        let t = u.piecewise(s,[[0,22],[2,25.5],[4,25],[5,26.5],[6,27],[6.25,30],[6.75,31],[7,28],[9,27],[10,26],[11,23]]);
        return t+anom;
    }
};
ENV_DEFS[SIM_MODE_MEGABLOBS].SST = {
    modifiers: {
        offSeasonPolarTemp: -5,
        peakSeasonPolarTemp: 20,
        offSeasonTropicsTemp: 23,
        peakSeasonTropicsTemp: 28.5
    }
};
ENV_DEFS[SIM_MODE_EXPERIMENTAL].SST = {
    version:1,
    modifiers: {
        offSeasonPolarTemp: 20,
        peakSeasonPolarTemp: 22,
        offSeasonTropicsTemp: 26,
        peakSeasonTropicsTemp: 28
    }
};
ENV_DEFS[SIM_MODE_SPOOKY].SST = {};
ENV_DEFS[SIM_MODE_CHAOS].SST = {
    modifiers: {
        offSeasonPolarTemp: -1,
        peakSeasonPolarTemp: 12,
        offSeasonTropicsTemp: 26.5,
        peakSeasonTropicsTemp: 30.2
    }
};

// -- moisture -- //

ENV_DEFS.defaults.moisture = {
    displayName: 'Relative humidity',
    version: 0,
    mapFunc: (u,x,y,z)=>{
        let v = u.noise(0);
        let s = seasonCurve(z);
        let l = land.get(Coordinate.convertFromXY(u.basin.mapType, x, u.basin.hemY(y)));
        let pm = u.modifiers.polarMoisture;
        let tm = u.modifiers.tropicalMoisture;
        let mm = u.modifiers.mountainMoisture;
        let m = map(l,0.5,0.7,map(y,0,HEIGHT,pm,tm),mm,true);
        m += map(s,-1,1,-0.08,0.08);
        m += u.basin.ensoMoistureAdjustment(z,x,y);
        m += map(v,0,1,-0.3,0.3);
        m = constrain(m,0,1);
        return m;
    },
    displayFormat: v=>{
        return round(v*1000)/10 + '%';
    },
    hueMap: v=>{
        colorMode(HSB);
        let c;
        if(v<0.5) c = lerpColor(color(45,100,30),color(45,1,90),map(v,0,0.5,0,1));
        else c = lerpColor(color(180,1,90),color(180,100,30),map(v,0.5,1,0,1));
        colorMode(RGB);
        return c;
    },
    modifiers: {
        polarMoisture: 0.43,
        tropicalMoisture: 0.57,
        mountainMoisture: 0.2
    },
    noiseChannels: [
        [4,0.5,120,120,0.3,2]
    ]
};
ENV_DEFS[SIM_MODE_NORMAL].moisture = {};
ENV_DEFS[SIM_MODE_HYPER].moisture = {
    modifiers: {
        polarMoisture: 0.52,
        tropicalMoisture: 0.62,
        mountainMoisture: 0.3
    }
};
ENV_DEFS[SIM_MODE_WILD].moisture = {
    mapFunc: (u,x,y,z)=>{
        let v = u.noise(0);
        let s = u.yearfrac(z);
        let l = land.get(Coordinate.convertFromXY(u.basin.mapType, x, u.basin.hemY(y)));
        let om = u.piecewise(s,[
            [0.5,0.35],[2,0.55],[4,0.6],[5.75,0.58],[6,0.1],[7,0.2],[7.25,0.6],[8.5,0.72],[10,0.55],[11.5,0.35]
        ]);
        let mm = u.modifiers.mountainMoisture;
        let m = map(l,0.5,0.7,om,mm,true);
        m += map(v,0,1,-0.3,0.3);
        m = constrain(m,0,1);
        return m;
    }
};
ENV_DEFS[SIM_MODE_MEGABLOBS].moisture = {};
ENV_DEFS[SIM_MODE_EXPERIMENTAL].moisture = {};
ENV_DEFS[SIM_MODE_SPOOKY].moisture = {};
ENV_DEFS[SIM_MODE_CHAOS].moisture = {
    modifiers: {
        polarMoisture: 0.44,
        tropicalMoisture: 0.66,
        mountainMoisture: 0.16
    },
    noiseChannels: [
        [5,0.5,90,100,0.45,2.4]
    ]
};

// -- monsoonPulse -- //

ENV_DEFS[SIM_MODE_CHAOS].monsoonPulse = {
    displayName: 'Monsoon burst potential',
    version: 0,
    mapFunc: (u,x,y,z)=>{
        let moisture = u.field('moisture');
        let shear = u.field('shear').mag();
        let ll = u.field('LLSteering');
        let lowLevelSpin = map(abs(ll.y),0.1,2.8,0,0.28,true);
        let broadPulse = map(u.noise(0,x-z*1.6,y+z*0.4,z),0,1,-0.28,0.38);
        let convectiveWave = map(u.noise(1,x+z*3.2,y,z),0,1,-0.22,0.35);
        let tropicalBand = map(y,HEIGHT*0.48,HEIGHT*0.94,0,0.22,true);
        let v = map(moisture,0.5,0.86,0,0.45,true) + lowLevelSpin + broadPulse + convectiveWave + tropicalBand;
        v -= map(shear,3.5,8,0,0.35,true);
        return constrain(v,0,1);
    },
    displayFormat: v=>{
        return round(v*100) + '%';
    },
    hueMap: v=>{
        colorMode(HSB);
        let quiet = color(210,65,78);
        let active = color(140,80,70);
        let burst = color(25,95,92);
        let c = v<0.5 ? lerpColor(quiet,active,map(v,0,0.5,0,1)) :
            lerpColor(active,burst,map(v,0.5,1,0,1));
        colorMode(RGB);
        return c;
    },
    oceanic: true,
    noiseChannels: [
        [5,0.55,190,420,0.65,2.3],
        [4,0.5,80,130,1.4,3.1]
    ]
};

// -- oceanHeat -- //

ENV_DEFS[SIM_MODE_CHAOS].oceanHeat = {
    displayName: 'Ocean heat content',
    version: 0,
    mapFunc: (u,x,y,z)=>{
        let SST = u.field('SST');
        let tropicalBand = map(y,HEIGHT*0.38,HEIGHT*0.95,0,1,true);
        let eddy = map(u.noise(0,x-z*1.2,y,z),0,1,-0.35,0.45);
        let deepWarmth = map(u.noise(1,x+z*0.35,y-z*0.2,z),0,1,-0.2,0.38);
        let seasonal = map(seasonCurve(z),-1,1,-0.08,0.12);
        let v = map(SST,24,31.5,0,0.85,true) + 0.18*tropicalBand + eddy + deepWarmth + seasonal;
        return constrain(v,0,1.25);
    },
    displayFormat: v=>{
        return round(v*100) + '%';
    },
    hueMap: v=>{
        colorMode(HSB);
        let low = color(220,90,75);
        let mid = color(55,85,95);
        let high = color(350,95,85);
        let extreme = color(305,35,100);
        let c = v<0.55 ? lerpColor(low,mid,map(v,0,0.55,0,1)) :
            v<0.95 ? lerpColor(mid,high,map(v,0.55,0.95,0,1)) :
            lerpColor(high,extreme,map(v,0.95,1.25,0,1));
        colorMode(RGB);
        return c;
    },
    oceanic: true,
    noiseChannels: [
        [5,0.55,130,500,0.16,1.6],
        [4,0.5,55,1500,0.05,0.8]
    ]
};

// -- instability -- //

ENV_DEFS[SIM_MODE_CHAOS].instability = {
    displayName: 'Convective instability',
    version: 0,
    mapFunc: (u,x,y,z)=>{
        let heat = u.field('oceanHeat');
        let moisture = u.field('moisture');
        let monsoon = u.field('monsoonPulse');
        let shear = u.field('shear').mag();
        let pulse = map(u.noise(0,x-z*2.2,y+z*0.35,z),0,1,-0.35,0.42);
        let v = map(heat,0.35,1.05,0,0.5,true) + map(moisture,0.45,0.85,0,0.38,true) + monsoon*0.24 + pulse;
        v -= map(shear,2.2,7.5,0,0.45,true);
        return constrain(v,0,1);
    },
    displayFormat: v=>{
        return round(v*100) + '%';
    },
    hueMap: v=>{
        colorMode(HSB);
        let stable = color(230,75,75);
        let marginal = color(90,70,80);
        let explosive = color(0,95,85);
        let c = v<0.45 ? lerpColor(stable,marginal,map(v,0,0.45,0,1)) :
            lerpColor(marginal,explosive,map(v,0.45,1,0,1));
        colorMode(RGB);
        return c;
    },
    oceanic: true,
    noiseChannels: [
        [5,0.55,180,260,0.9,2.7]
    ]
};

// ---- Active Storm System Algorithm ---- //

const STORM_ALGORITHM = {};

STORM_ALGORITHM.defaults = {};
STORM_ALGORITHM[SIM_MODE_NORMAL] = {};
STORM_ALGORITHM[SIM_MODE_HYPER] = {};
STORM_ALGORITHM[SIM_MODE_WILD] = {};
STORM_ALGORITHM[SIM_MODE_MEGABLOBS] = {};
STORM_ALGORITHM[SIM_MODE_EXPERIMENTAL] = {};
STORM_ALGORITHM[SIM_MODE_SPOOKY] = {};
STORM_ALGORITHM[SIM_MODE_CHAOS] = {};

// -- Interaction -- //

STORM_ALGORITHM.defaults.interactionInit = {
    fuji: true,
    shear: false,
    kill: false
};

STORM_ALGORITHM.defaults.interaction = function(sys0, sys1){
    let interactionData = {};

    let v = createVector();
    v.set(sys0.pos);
    v.sub(sys1.pos);
    let m = v.mag();
    let r = map(sys1.lowerWarmCore,0,1,150,50);
    if(m<r && m>0){
        v.rotate(sys0.basin.hem(-TAU/4+((3/m)*TAU/16)));
        v.setMag(map(m,r,0,0,map(constrain(sys1.pressure,990,1030),1030,990,0.2,2.2)));
        interactionData.fuji = v;
        interactionData.shear = map(m,r,0,0,map(sys1.pressure,1030,900,0,6));
        if((m < map(sys0.pressure,1030,1000,r/5,r/15) || m<5) && sys0.pressure > sys1.pressure)
            interactionData.kill = 1;
    }

    return interactionData;
};

STORM_ALGORITHM[SIM_MODE_CHAOS].interaction = function(sys0, sys1){
    let interactionData = STORM_ALGORITHM.defaults.interaction(sys0, sys1);
    let v = createVector();
    v.set(sys0.pos);
    v.sub(sys1.pos);
    let m = v.mag();
    let strongWarmCore = max(sys0.lowerWarmCore,sys1.lowerWarmCore);
    let r = map(strongWarmCore,0,1,190,75);
    r += map(max(sys0.windSpeed,sys1.windSpeed),35,150,0,55,true);
    if(m<r && m>0){
        if(!interactionData.fuji) interactionData.fuji = createVector();
        v.rotate(sys0.basin.hem(-TAU/4+((4/m)*TAU/16)));
        v.setMag(map(m,r,0,0,map(constrain(sys1.pressure,1005,880),1005,880,0.8,3.7)));
        interactionData.fuji.add(v);
        interactionData.shear = (interactionData.shear || 0) + map(m,r,0,0,map(sys1.windSpeed,35,160,0.2,8,true));
        if(m<r*0.18 && sys0.pressure>sys1.pressure+6)
            interactionData.kill = 1;
    }
    return interactionData;
};

// -- Steering -- //

STORM_ALGORITHM.defaults.steering = function(sys,vec,u){
    let ll = u.f("LLSteering");
    let ul = u.f("ULSteering");
    let d = sqrt(sys.depth);
    let x = lerp(ll.x,ul.x,d);       // Deeper systems follow upper-level steering more and lower-level steering less
    let y = lerp(ll.y,ul.y,d);
    vec.set(x,y);
    vec.add(sys.interaction.fuji);
};

STORM_ALGORITHM[SIM_MODE_CHAOS].steering = function(sys,vec,u){
    STORM_ALGORITHM.defaults.steering(sys,vec,u);
    let monsoon = u.f("monsoonPulse");
    let beta = map(sys.windSpeed,35,135,0,0.52,true)*map(sys.lowerWarmCore,0.45,1,0,1,true);
    vec.add(-0.22*beta,sys.basin.hem(-0.42*beta));
    let shear = u.f("shear");
    let shearDrag = map(shear.mag(),2,8,0,0.18,true)*map(sys.depth,0.25,0.85,1,0.25,true);
    vec.add(shear.x*shearDrag,shear.y*shearDrag);
    if(monsoon>0.55)
        vec.rotate(sys.basin.hem(map(monsoon,0.55,1,0,PI/30,true))*map(sys.depth,0,1,1,0.3,true));
};

// -- Core -- //

STORM_ALGORITHM.defaults.core = function(sys,u){
    let SST = u.f("SST");
    let jet = u.f("jetstream");
    jet = sys.basin.hemY(sys.pos.y)-jet;
    let lnd = u.land();
    let moisture = u.f("moisture");
    let shear = u.f("shear").mag()+sys.interaction.shear;
    
    let targetWarmCore = (lnd ?
        sys.lowerWarmCore :
        max(pow(map(SST,10,25,0,1,true),3),sys.lowerWarmCore)
    )*map(jet,0,75,sq(1-sys.depth),1,true);
    sys.lowerWarmCore = lerp(sys.lowerWarmCore,targetWarmCore,sys.lowerWarmCore>targetWarmCore ? map(jet,0,75,0.4,0.06,true) : 0.04);
    sys.upperWarmCore = lerp(sys.upperWarmCore,sys.lowerWarmCore,sys.lowerWarmCore>sys.upperWarmCore ? 0.05 : 0.4);
    sys.lowerWarmCore = constrain(sys.lowerWarmCore,0,1);
    sys.upperWarmCore = constrain(sys.upperWarmCore,0,1);
    let tropicalness = constrain(map(sys.lowerWarmCore,0.5,1,0,1),0,sys.upperWarmCore);
    let nontropicalness = constrain(map(sys.lowerWarmCore,0.75,0,0,1),0,1);

    sys.organization *= 100;
    if(!lnd) sys.organization += sq(map(SST,20,29,0,1,true))*3*tropicalness;
    if(!lnd && sys.organization<40) sys.organization += lerp(0,3,nontropicalness);
    // if(lnd) sys.organization -= pow(10,map(lnd,0.5,1,-3,1));
    // if(lnd && sys.organization<70 && moisture>0.3) sys.organization += pow(5,map(moisture,0.3,0.5,-1,1,true))*tropicalness;
    sys.organization -= pow(2,4-((HEIGHT-sys.basin.hemY(sys.pos.y))/(HEIGHT*0.01)));
    sys.organization -= (pow(map(sys.depth,0,1,1.17,1.31),shear)-1)*map(sys.depth,0,1,4.7,1.2);
    sys.organization -= map(moisture,0,0.65,3,0,true)*shear;
    sys.organization += sq(map(moisture,0.6,1,0,1,true))*4;
    sys.organization -= pow(1.3,20-SST)*tropicalness;
    sys.organization = constrain(sys.organization,0,100);
    sys.organization /= 100;

    let targetPressure = 1010-25*log((lnd||SST<25)?1:map(SST,25,30,1,2))/log(1.17);
    targetPressure = lerp(1010,targetPressure,pow(sys.organization,3));
    sys.pressure = lerp(sys.pressure,targetPressure,(sys.pressure>targetPressure?0.05:0.08)*tropicalness);
    sys.pressure -= random(-3,3.5)*nontropicalness;
    if(sys.organization<0.3) sys.pressure += random(-2,2.5)*tropicalness;
    sys.pressure += random(constrain(970-sys.pressure,0,40))*nontropicalness;
    sys.pressure += 0.5*sys.interaction.shear/(1+map(sys.lowerWarmCore,0,1,4,0));
    sys.pressure += map(jet,0,75,5*pow(1-sys.depth,4),0,true);

    let targetWind = map(sys.pressure,1030,900,1,160)*map(sys.lowerWarmCore,1,0,1,0.6);
    sys.windSpeed = lerp(sys.windSpeed,targetWind,0.15);

    let targetDepth = map(
        sys.upperWarmCore,
        0,1,
        1,map(
            sys.organization,
            0,1,
            sys.depth*pow(0.95,shear),max(map(sys.pressure,1010,950,0,0.7,true),sys.depth)
        )
    );
    sys.depth = lerp(sys.depth,targetDepth,0.05);

    if(sys.pressure > 1030 || sys.interaction.kill > 0)
        sys.kill = true;
};

STORM_ALGORITHM[SIM_MODE_CHAOS].core = function(sys,u){
    STORM_ALGORITHM.defaults.core(sys,u);

    let SST = u.f("SST");
    let heat = u.f("oceanHeat");
    let instability = u.f("instability");
    let monsoon = u.f("monsoonPulse");
    let moisture = u.f("moisture");
    let shear = u.f("shear").mag()+sys.interaction.shear;
    let lnd = u.land();
    let tropicalness = constrain(map(sys.lowerWarmCore,0.5,1,0,1),0,sys.upperWarmCore);
    let moveSpeed = sys.steering.mag();

    sys.coreHeat = constrain(sys.coreHeat || 0,0,1.4);
    sys.coldWake = constrain(sys.coldWake || 0,0,4);
    sys.eyewallCycle = constrain(sys.eyewallCycle || 0,0,1.2);
    sys.satelliteCooldown = max((sys.satelliteCooldown || 0)-1,0);

    if(lnd){
        let roughness = map(lnd,0.52,0.92,0,1,true);
        sys.organization = lerp(sys.organization,0,0.025+0.07*roughness);
        sys.lowerWarmCore = lerp(sys.lowerWarmCore,0.35,0.04+0.08*roughness);
        sys.upperWarmCore = lerp(sys.upperWarmCore,sys.lowerWarmCore,0.08+0.1*roughness);
        sys.pressure += 0.7+3.2*roughness;
        sys.windSpeed = lerp(sys.windSpeed,20,0.015+0.035*roughness);
        sys.coldWake = lerp(sys.coldWake,0,0.2);
    }else{
        let cooling = map(sys.windSpeed,45,150,0,0.06,true)*map(moveSpeed,0.15,2.4,1.35,0.15,true)*tropicalness;
        sys.coldWake = constrain(sys.coldWake + cooling - map(heat,0.3,1.05,0.035,0.006,true),0,4);
        if(sys.coldWake>0.45){
            sys.organization = lerp(sys.organization,0.2,map(sys.coldWake,0.45,3.6,0,0.04,true)*tropicalness);
            sys.pressure += map(sys.coldWake,0.45,3.6,0,2.4,true)*tropicalness;
        }
    }

    let effectiveSST = SST - sys.coldWake;
    let favorable = map(effectiveSST,26.2,30.5,0,1,true) *
        map(heat,0.42,1.05,0,1,true) *
        map(moisture,0.55,0.88,0,1,true) *
        map(shear,4.2,0.7,0,1,true) *
        map(sys.organization,0.38,0.86,0,1,true) *
        tropicalness *
        (lnd ? 0 : 1);
    favorable = constrain(lerp(favorable,instability,0.35)+monsoon*0.12,0,1);
    sys.coreHeat = constrain(lerp(sys.coreHeat,favorable,favorable>sys.coreHeat ? 0.065 : 0.025),0,1.35);

    if(!lnd && favorable>0.35 && random()<0.07*favorable){
        let burst = random(0.6,2.8)*favorable*(0.45+sys.coreHeat);
        sys.organization = constrain(sys.organization+random(0.01,0.04)*favorable,0,1);
        sys.pressure -= burst;
        sys.windSpeed += random(0.4,1.8)*favorable*(0.5+sys.coreHeat);
        sys.depth = lerp(sys.depth,max(sys.depth,0.72),0.025*favorable);
    }

    if(!lnd && sys.coreHeat>0.72 && sys.organization>0.72 && sys.pressure<995 && sys.pressure>875 && random()<0.016*sys.coreHeat){
        sys.pressure -= random(3,8)*sys.coreHeat;
        sys.windSpeed += random(1.5,4.5)*sys.coreHeat;
        sys.depth = lerp(sys.depth,0.82,0.05);
    }

    if(!lnd && sys.eyewallCycle===0 && sys.windSpeed>105 && sys.organization>0.75 && random()<map(sys.windSpeed,105,165,0.002,0.012,true)){
        sys.eyewallCycle = random(0.02,0.08);
    }
    if(sys.eyewallCycle>0){
        let phase = sys.eyewallCycle;
        if(phase<0.55){
            let weakening = map(phase,0,0.55,0.4,2.8);
            sys.pressure += weakening;
            sys.windSpeed -= map(phase,0,0.55,0.4,2.1);
            sys.organization = lerp(sys.organization,0.62,0.018);
        }else{
            let recovery = map(phase,0.55,1,0.3,1.6,true);
            sys.pressure -= recovery*map(heat,0.45,1.1,0.3,1,true);
            sys.windSpeed += recovery*0.45;
            sys.organization = lerp(sys.organization,0.9,0.012);
        }
        sys.eyewallCycle += random(0.018,0.04);
        if(sys.eyewallCycle>=1) sys.eyewallCycle = 0;
    }

    if(!lnd && shear>3.1){
        let asymVent = map(moisture,0.58,0.9,0.25,1,true)*map(effectiveSST,26,30,0,1,true);
        if(random()<0.035*asymVent && shear<5.2){
            sys.pressure -= random(0.3,1.6)*asymVent;
            sys.windSpeed += random(0.2,1.2)*asymVent;
        }
        sys.organization = lerp(sys.organization,0.28,map(shear,3.5,8,0,0.022,true)*(1-moisture));
    }

    if(!lnd && monsoon>0.68 && sys.organization<0.75 && random()<0.035*monsoon){
        sys.organization = constrain(sys.organization+random(0.015,0.055)*monsoon,0,1);
        sys.lowerWarmCore = lerp(sys.lowerWarmCore,1,0.015*monsoon);
        sys.pressure -= random(0.4,2.2)*monsoon;
    }

    sys.pressure = constrain(sys.pressure,850,1045);
    sys.windSpeed = max(0,sys.windSpeed);
    sys.organization = constrain(sys.organization,0,1);
    sys.lowerWarmCore = constrain(sys.lowerWarmCore,0,1);
    sys.upperWarmCore = constrain(sys.upperWarmCore,0,1);
    sys.depth = constrain(sys.depth,0,1);
    if(sys.pressure > 1035 || sys.interaction.kill > 0)
        sys.kill = true;
};

STORM_ALGORITHM[SIM_MODE_EXPERIMENTAL].core = function(sys,u){
    let SST = u.f("SST");
    let jet = u.f("jetstream");
    jet = sys.basin.hemY(sys.pos.y)-jet;
    let lnd = u.land();
    let moisture = u.f("moisture");
    let shear = u.f("shear").mag()+sys.interaction.shear;
    
    sys.lowerWarmCore = lerp(sys.lowerWarmCore,0,map(jet,0,75,0.07,0));
    sys.lowerWarmCore = lerp(sys.lowerWarmCore,1,map(jet,50,100,0,map(SST,16,26,0,0.13,true),true));
    if(sys.upperWarmCore > sys.lowerWarmCore)
        sys.upperWarmCore = sys.lowerWarmCore;
    else
        sys.upperWarmCore = lerp(sys.upperWarmCore,sys.lowerWarmCore,0.015);
    sys.lowerWarmCore = constrain(sys.lowerWarmCore,0,1);
    sys.upperWarmCore = constrain(sys.upperWarmCore,0,1);
    let tropicalness = (sys.lowerWarmCore+sys.upperWarmCore)/2;

    if(!lnd)
        sys.organization = lerp(sys.organization,1,sq(tropicalness)*map(SST,21,31,0,0.05,true));
    sys.organization = lerp(sys.organization,0,pow(3,shear*(1-moisture)*2.3)*0.0005);
    if(lnd>0.7)
        sys.organization = lerp(sys.organization,0,0.03);
    sys.organization = constrain(sys.organization,0,1);

    let hardCeiling = map(SST,21,31,1015,880);
    if(lnd)
        hardCeiling = 990;
    let softCeiling = map(sys.organization,0.93,0.98,lerp(1020,hardCeiling,0.7),hardCeiling,true);
    sys.pressure = lerp(sys.pressure,1032,0.006);
    sys.pressure = lerp(sys.pressure,980,(1-tropicalness)*map(jet,0,75,0.025,0,true));
    sys.pressure = lerp(sys.pressure,softCeiling,tropicalness*sys.organization*0.03);
    if(sys.pressure<1000)
        sys.pressure = lerp(sys.pressure,1000,tropicalness*(1-sys.organization)*0.01);
    sys.pressure = lerp(sys.pressure,1040,map(sys.pos.y,HEIGHT*0.97,HEIGHT,0,0.15,true));
    sys.pressure = lerp(sys.pressure,1040,map(lnd,0.8,0.93,0,0.2,true));
    sys.pressure += random(-1,1);

    let targetWind = map(sys.pressure,1030,900,1,160)*map(sys.lowerWarmCore,1,0,1,0.6);
    sys.windSpeed = lerp(sys.windSpeed,targetWind,0.15);

    sys.depth = lerp(sys.depth,1,(1-tropicalness)*0.02);
    sys.depth = lerp(sys.depth,0,tropicalness*(1-sys.organization)*0.02);
    sys.depth = lerp(sys.depth,lnd ? 0.5 : map(SST,26,29,0.5,0.65,true),tropicalness*sys.organization*0.025);

    if(sys.kaboom > 0 && sys.kaboom < 1)
        sys.kaboom = random()<sys.kaboom ? 1 : 0;

    let namedBoom = false;
    if(sys.fetchStorm()){
        let d = sys.fetchStorm().designations.primary;
        for(let i = 0; i < d.length; i++){
            if(d[i].value === 'Boom'){
                namedBoom = true;
                sys.kaboom = 2;
            }
        }
    }

    if(sys.kaboom){
        if((!lnd || namedBoom) && (sys.organization > 0.8 || sys.kaboom === 2)){
            sys.kaboom = 2;
            if(sys.pressure > 600)
                sys.pressure -= random(5,10);
            sys.organization = 1;
            sys.lowerWarmCore = 1;
            if(sys.upperWarmCore < 0.5)
                sys.upperWarmCore = 0.5;
            sys.depth = 0.8;
        }

        if(lnd && !namedBoom){
            if(sys.kaboom === 2)
                sys.kaboom = 1;
            sys.organization = 0;
        }
    }else if(random()<0.0001)
        sys.kaboom = 1;

    if(sys.pressure > 1030 || sys.interaction.kill > 0)
        sys.kill = true;
};

// -- Type Determination -- //

STORM_ALGORITHM.defaults.typeDetermination = function(sys,u){
    switch(sys.type){
        case TROP:
            sys.type = sys.lowerWarmCore<0.55 ? EXTROP : ((sys.organization<0.4 && sys.windSpeed<50) || sys.windSpeed<20) ? sys.upperWarmCore<0.56 ? EXTROP : TROPWAVE : sys.upperWarmCore<0.56 ? SUBTROP : TROP;
            break;
        case SUBTROP:
            sys.type = sys.lowerWarmCore<0.55 ? EXTROP : ((sys.organization<0.4 && sys.windSpeed<50) || sys.windSpeed<20) ? sys.upperWarmCore<0.57 ? EXTROP : TROPWAVE : sys.upperWarmCore<0.57 ? SUBTROP : TROP;
            break;
        case TROPWAVE:
            sys.type = sys.lowerWarmCore<0.55 ? EXTROP : (sys.organization<0.45 || sys.windSpeed<25) ? sys.upperWarmCore<0.56 ? EXTROP : TROPWAVE : sys.upperWarmCore<0.56 ? SUBTROP : TROP;
            break;
        default:
            sys.type = sys.lowerWarmCore<0.6 ? EXTROP : (sys.organization<0.45 || sys.windSpeed<25) ? sys.upperWarmCore<0.57 ? EXTROP : TROPWAVE : sys.upperWarmCore<0.57 ? SUBTROP : TROP;
    }
};

// -- Version -- //
// Version number of a simulation mode's storm algorithm
// Used for upgrading the active attribute values if needed

STORM_ALGORITHM[SIM_MODE_NORMAL].version = 0;
STORM_ALGORITHM[SIM_MODE_HYPER].version = 0;
STORM_ALGORITHM[SIM_MODE_WILD].version = 0;
STORM_ALGORITHM[SIM_MODE_MEGABLOBS].version = 0;
STORM_ALGORITHM[SIM_MODE_EXPERIMENTAL].version = 1;
STORM_ALGORITHM[SIM_MODE_SPOOKY].version = 0;
STORM_ALGORITHM[SIM_MODE_CHAOS].version = 1;

// -- Upgrade -- //
// Converts active attributes in case an active system is loaded after an algorithm change breaks old values

// STORM_ALGORITHM[SIM_MODE_NORMAL].upgrade = function(sys,data,oldVersion){

// };

// STORM_ALGORITHM[SIM_MODE_HYPER].upgrade = function(sys,data,oldVersion){

// };

// STORM_ALGORITHM[SIM_MODE_WILD].upgrade = function(sys,data,oldVersion){

// };

// STORM_ALGORITHM[SIM_MODE_MEGABLOBS].upgrade = function(sys,data,oldVersion){

// };

STORM_ALGORITHM[SIM_MODE_EXPERIMENTAL].upgrade = function(sys,data,oldVersion){
    if(oldVersion < 1){
        sys.organization = data.organization;
        sys.lowerWarmCore = data.lowerWarmCore;
        sys.upperWarmCore = data.upperWarmCore;
        sys.depth = data.depth;
        sys.kaboom = 0;
    }
};

// STORM_ALGORITHM[SIM_MODE_SPOOKY].upgrade = function(sys,data,oldVersion){

// };
