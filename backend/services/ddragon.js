const axios = require('axios');

const version = '13.24.1';
const lang = 'es_ES';

async function getRandomChampionData() {
  // Obtener la lista de campeones
  const champListUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/data/${lang}/champion.json`;
  const { data } = await axios.get(champListUrl);
  const champs = Object.values(data.data);

  //Elegir uno al azar
  const randomChamp = champs[Math.floor(Math.random() * champs.length)];

  //Obtener los datos completos del campeón
  const champDetailUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/data/${lang}/champion/${randomChamp.id}.json`;
  const { data: detail } = await axios.get(champDetailUrl);
  const champData = detail.data[randomChamp.id];

  //Limpiar y recortar el lore
  const shortLore = cleanChampionLore(champData.lore, champData.name);

  return {
    id: champData.id,
    name: champData.name,
    lore: shortLore,
    tags: champData.tags,
    region: getRegionFromChamp(champData.id),
    spells: champData.spells.map(spell => ({
      name: spell.name,
      description: spell.description,
      image: `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${spell.image.full}`
    })),
    passive: {
      name: champData.passive.name,
      description: champData.passive.description,
      image: `https://ddragon.leagueoflegends.com/cdn/${version}/img/passive/${champData.passive.image.full}`
    },
    icon: `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champData.image.full}`
  };
}

function cleanChampionLore(lore, name) {
  const escapedName = name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  const nameRegex = new RegExp(escapedName, 'gi');
  const loreWithoutName = lore.replace(nameRegex, '_____');
  const shortLore = loreWithoutName.split('.').slice(0, 2).join('.') + '.';
  return shortLore;
}

function getRegionFromChamp(champId) {
  const regions = {
    Aatrox: "Runaterra",
    Ahri: "Jonia",
    Akali: "Jonia",
    Alistar: "Runaterra",
    Amumu: "Shurima",
    Anivia: "Freljord",
    Annie: "Noxus",
    Aphelios: "Targon",
    Ashe: "Freljord",
    AurelionSol: "Targon",
    Azir: "Shurima",
    Bard: "Targon",
    Belveth: "El Vacío",
    Blitzcrank: "Zaun",
    Brand: "Freljord",
    Braum: "Freljord",
    Caitlyn: "Piltover",
    Camille: "Piltover",
    Cassiopeia: "Noxus",
    ChoGath: "El Vacío",
    Corki: "Bandle",
    Darius: "Noxus",
    Diana: "Targon",
    DrMundo: "Zaun",
    Draven: "Noxus",
    Ekko: "Zaun",
    Elise: "Islas de la Sombra",
    Evelynn: "Runaterra",
    Ezreal: "Piltover",
    Fiddlesticks: "Islas de la Sombra",
    Fiora: "Demacia",
    Fizz: "Aguas Estancadas",
    Galio: "Demacia",
    Gangplank: "Aguas Estancadas",
    Garen: "Demacia",
    Gnar: "Freljord",
    Gragas: "Freljord",
    Graves: "Aguas Estancadas",
    Gwen: "Islas de la Sombra",
    Hecarim: "Islas de la Sombra",
    Heimerdinger: "Piltover",
    Illaoi: "Aguas Estancadas",
    Irelia: "Jonia",
    Ivern: "Jonia",
    Janna: "Zaun",
    JarvanIV: "Demacia",
    Jax: "Icathia",
    Jayce: "Piltover",
    Jhin: "Jonia",
    Jinx: "Zaun",
    Kaisa: "El Vacío",
    Kalista: "Islas de la Sombra",
    Karma: "Jonia",
    Karthus: "Islas de la Sombra",
    Kassadin: "El Vacío",
    Katarina: "Noxus",
    Kayle: "Demacia",
    Kayn: "Jonia",
    Kennen: "Jonia",
    Khazix: "El Vacío",
    Kindred: "Runaterra",
    Kled: "Noxus",
    KogMaw: "El Vacío",
    LeBlanc: "Noxus",
    LeeSin: "Jonia",
    Leona: "Targon",
    Lillia: "Jonia",
    Lissandra: "Freljord",
    Lucian: "Islas de la Sombra",
    Lulu: "Bandle",
    Lux: "Demacia",
    Malphite: "Jonia",
    Malzahar: "El Vacío",
    Maokai: "Islas de la Sombra",
    MasterYi: "Jonia",
    MissFortune: "Aguas Estancadas",
    Mordekaiser: "Noxus",
    Morgana: "Demacia",
    Nami: "Mar de los Espíritus",
    Nasus: "Shurima",
    Nautilus: "Aguas Estancadas",
    Neeko: "Jonia",
    Nidalee: "Jonia",
    Nilah: "Aguas Estancadas",
    Nocturne: "Runaterra",
    Nunu: "Freljord",
    Olaf: "Freljord",
    Orianna: "Piltover",
    Ornn: "Freljord",
    Pantheon: "Targon",
    Poppy: "Demacia",
    Pyke: "Aguas Estancadas",
    Qiyana: "Ixaocan",
    Quinn: "Demacia",
    Rakan: "Jonia",
    Rammus: "Shurima",
    RekSai: "El Vacío",
    Rell: "Noxus",
    Renata: "Zaun",
    Renekton: "Shurima",
    Rengar: "Jonia",
    Riven: "Noxus",
    Rumble: "Bandle",
    Ryze: "Runaterra",
    Samira: "Shurima",
    Sejuani: "Freljord",
    Senna: "Islas de la Sombra",
    Seraphine: "Piltover",
    Sett: "Jonia",
    Shaco: "Runaterra",
    Shen: "Jonia",
    Shyvana: "Demacia",
    Singed: "Zaun",
    Sion: "Noxus",
    Sivir: "Shurima",
    Skarner: "Shurima",
    Sona: "Demacia",
    Soraka: "Targon",
    Swain: "Noxus",
    Sylas: "Demacia",
    Syndra: "Jonia",
    TahmKench: "Aguas Estancadas",
    Taliyah: "Shurima",
    Talon: "Noxus",
    Taric: "Targon",
    Teemo: "Bandle",
    Thresh: "Islas de la Sombra",
    Tristana: "Bandle",
    Trundle: "Freljord",
    Tryndamere: "Freljord",
    TwistedFate: "Aguas Estancadas",
    Twitch: "Zaun",
    Udyr: "Freljord",
    Urgot: "Zaun",
    Varus: "Jonia",
    Vayne: "Demacia",
    Veigar: "Bandle",
    Velkoz: "El Vacío",
    Vex: "Islas de la Sombra",
    Vi: "Piltover",
    Viego: "Islas de la Sombra",
    Viktor: "Zaun",
    Vladimir: "Noxus",
    Volibear: "Freljord",
    Warwick: "Zaun",
    Wukong: "Jonia",
    Xayah: "Jonia",
    Xerath: "Shurima",
    XinZhao: "Demacia",
    Yasuo: "Jonia",
    Yone: "Jonia",
    Yorick: "Islas de la Sombra",
    Yuumi: "Bandle",
    Zac: "Zaun",
    Zed: "Jonia",
    Zeri: "Zaun",
    Ziggs: "Bandle",
    Zilean: "Runaterra",
    Zoe: "Targon",
    Zyra: "Runaterra"
  };

  return regions[champId] || "Desconocida";
}

module.exports = { getRandomChampionData };
