import type { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { Product } from '../../product/entities/product.entity.js';
import {
  beverages,
  condiments,
  confections,
  dairyProducts,
  grainsCereals,
  meatPoultry,
  produce,
  seafood,
} from './category.seeder.js';
import {
  auxJoyeuxEcclesiastiques,
  bigfootBreweries,
  cooperativaDeQuesosLasCabras,
  escargotsNouveaux,
  exoticLiquids,
  foretsDerables,
  formaggiFortiniSRL,
  gaiPaturage,
  gdayMate,
  grandmaKellysHomestead,
  heliSusswarenGmbHCoKG,
  karkkiOy,
  lekaTrading,
  lyngbysild,
  maMaison,
  mayumis,
  newEnglandSeafoodCannery,
  newOrleansCajunDelights,
  nordOstFischHandelsgesellschaftMbH,
  norskeMeierier,
  pastaButtiniSRL,
  pavlovaLtd,
  pbKnackebrodAB,
  plutzerLebensmittelgrossmarkteAG,
  refrescosAmericanasLTDA,
  specialtyBiscuitsLtd,
  svenskSjofoodaAB,
  tokyoTraders,
  zaanseSnoepfabriek,
} from './supplier.seeder.js';

export const chai = Object.assign(new Product(), {
  id: 1,
  name: 'Chai',
  supplier: exoticLiquids,
  category: beverages,
  quantityPerUnit: '10 boxes x 20 bags',
  unitPrice: 18,
  unitsInStock: 39,
  unitsOnOrder: 0,
  reorderLevel: 10,
  discontinued: false,
});

export const chang = Object.assign(new Product(), {
  id: 2,
  name: 'Chang',
  supplier: exoticLiquids,
  category: beverages,
  quantityPerUnit: '24 - 12 oz bottles',
  unitPrice: 19,
  unitsInStock: 17,
  unitsOnOrder: 40,
  reorderLevel: 25,
  discontinued: false,
});

export const aniseedSyrup = Object.assign(new Product(), {
  id: 3,
  name: 'Aniseed Syrup',
  supplier: exoticLiquids,
  category: condiments,
  quantityPerUnit: '12 - 550 ml bottles',
  unitPrice: 10,
  unitsInStock: 13,
  unitsOnOrder: 70,
  reorderLevel: 25,
  discontinued: false,
});

export const chefAntonSCajunSeasoning = Object.assign(new Product(), {
  id: 4,
  name: "Chef Anton's Cajun Seasoning",
  supplier: newOrleansCajunDelights,
  category: condiments,
  quantityPerUnit: '48 - 6 oz jars',
  unitPrice: 22,
  unitsInStock: 53,
  unitsOnOrder: 0,
  reorderLevel: 0,
  discontinued: false,
});

export const chefAntonSGumboMix = Object.assign(new Product(), {
  id: 5,
  name: "Chef Anton's Gumbo Mix",
  supplier: newOrleansCajunDelights,
  category: condiments,
  quantityPerUnit: '36 boxes',
  unitPrice: 21.35,
  unitsInStock: 0,
  unitsOnOrder: 0,
  reorderLevel: 0,
  discontinued: true,
});

export const grandmaSBoysenberrySpread = Object.assign(new Product(), {
  id: 6,
  name: "Grandma's Boysenberry Spread",
  supplier: grandmaKellysHomestead,
  category: condiments,
  quantityPerUnit: '12 - 8 oz jars',
  unitPrice: 25,
  unitsInStock: 120,
  unitsOnOrder: 0,
  reorderLevel: 25,
  discontinued: false,
});

export const uncleBobSOrganicDriedPears = Object.assign(new Product(), {
  id: 7,
  name: "Uncle Bob's Organic Dried Pears",
  supplier: grandmaKellysHomestead,
  category: produce,
  quantityPerUnit: '12 - 1 lb pkgs.',
  unitPrice: 30,
  unitsInStock: 15,
  unitsOnOrder: 0,
  reorderLevel: 10,
  discontinued: false,
});

export const northwoodsCranberrySauce = Object.assign(new Product(), {
  id: 8,
  name: 'Northwoods Cranberry Sauce',
  supplier: grandmaKellysHomestead,
  category: condiments,
  quantityPerUnit: '12 - 12 oz jars',
  unitPrice: 40,
  unitsInStock: 6,
  unitsOnOrder: 0,
  reorderLevel: 0,
  discontinued: false,
});

export const mishiKobeNiku = Object.assign(new Product(), {
  id: 9,
  name: 'Mishi Kobe Niku',
  supplier: tokyoTraders,
  category: meatPoultry,
  quantityPerUnit: '18 - 500 g pkgs.',
  unitPrice: 97,
  unitsInStock: 29,
  unitsOnOrder: 0,
  reorderLevel: 0,
  discontinued: true,
});

export const ikura = Object.assign(new Product(), {
  id: 10,
  name: 'Ikura',
  supplier: tokyoTraders,
  category: seafood,
  quantityPerUnit: '12 - 200 ml jars',
  unitPrice: 31,
  unitsInStock: 31,
  unitsOnOrder: 0,
  reorderLevel: 0,
  discontinued: false,
});

export const quesoCabrales = Object.assign(new Product(), {
  id: 11,
  name: 'Queso Cabrales',
  supplier: cooperativaDeQuesosLasCabras,
  category: dairyProducts,
  quantityPerUnit: '1 kg pkg.',
  unitPrice: 21,
  unitsInStock: 22,
  unitsOnOrder: 30,
  reorderLevel: 30,
  discontinued: false,
});

export const quesoManchegoLaPastora = Object.assign(new Product(), {
  id: 12,
  name: 'Queso Manchego La Pastora',
  supplier: cooperativaDeQuesosLasCabras,
  category: dairyProducts,
  quantityPerUnit: '10 - 500 g pkgs.',
  unitPrice: 38,
  unitsInStock: 86,
  unitsOnOrder: 0,
  reorderLevel: 0,
  discontinued: false,
});

export const konbu = Object.assign(new Product(), {
  id: 13,
  name: 'Konbu',
  supplier: mayumis,
  category: seafood,
  quantityPerUnit: '2 kg box',
  unitPrice: 6,
  unitsInStock: 24,
  unitsOnOrder: 0,
  reorderLevel: 5,
  discontinued: false,
});

export const tofu = Object.assign(new Product(), {
  id: 14,
  name: 'Tofu',
  supplier: mayumis,
  category: produce,
  quantityPerUnit: '40 - 100 g pkgs.',
  unitPrice: 23.25,
  unitsInStock: 35,
  unitsOnOrder: 0,
  reorderLevel: 0,
  discontinued: false,
});

export const genenShouyu = Object.assign(new Product(), {
  id: 15,
  name: 'Genen Shouyu',
  supplier: mayumis,
  category: condiments,
  quantityPerUnit: '24 - 250 ml bottles',
  unitPrice: 15.5,
  unitsInStock: 39,
  unitsOnOrder: 0,
  reorderLevel: 5,
  discontinued: false,
});

export const pavlova = Object.assign(new Product(), {
  id: 16,
  name: 'Pavlova',
  supplier: pavlovaLtd,
  category: confections,
  quantityPerUnit: '32 - 500 g boxes',
  unitPrice: 17.45,
  unitsInStock: 29,
  unitsOnOrder: 0,
  reorderLevel: 10,
  discontinued: false,
});

export const aliceMutton = Object.assign(new Product(), {
  id: 17,
  name: 'Alice Mutton',
  supplier: pavlovaLtd,
  category: meatPoultry,
  quantityPerUnit: '20 - 1 kg tins',
  unitPrice: 39,
  unitsInStock: 0,
  unitsOnOrder: 0,
  reorderLevel: 0,
  discontinued: true,
});

export const carnarvonTigers = Object.assign(new Product(), {
  id: 18,
  name: 'Carnarvon Tigers',
  supplier: pavlovaLtd,
  category: seafood,
  quantityPerUnit: '16 kg pkg.',
  unitPrice: 62.5,
  unitsInStock: 42,
  unitsOnOrder: 0,
  reorderLevel: 0,
  discontinued: false,
});

export const teatimeChocolateBiscuits = Object.assign(new Product(), {
  id: 19,
  name: 'Teatime Chocolate Biscuits',
  supplier: specialtyBiscuitsLtd,
  category: confections,
  quantityPerUnit: '10 boxes x 12 pieces',
  unitPrice: 9.2,
  unitsInStock: 25,
  unitsOnOrder: 0,
  reorderLevel: 5,
  discontinued: false,
});

export const sirRodneySMarmalade = Object.assign(new Product(), {
  id: 20,
  name: "Sir Rodney's Marmalade",
  supplier: specialtyBiscuitsLtd,
  category: confections,
  quantityPerUnit: '30 gift boxes',
  unitPrice: 81,
  unitsInStock: 40,
  unitsOnOrder: 0,
  reorderLevel: 0,
  discontinued: false,
});

export const sirRodneySScones = Object.assign(new Product(), {
  id: 21,
  name: "Sir Rodney's Scones",
  supplier: specialtyBiscuitsLtd,
  category: confections,
  quantityPerUnit: '24 pkgs. x 4 pieces',
  unitPrice: 10,
  unitsInStock: 3,
  unitsOnOrder: 40,
  reorderLevel: 5,
  discontinued: false,
});

export const gustafSKnCkebrD = Object.assign(new Product(), {
  id: 22,
  name: 'Gustaf’s Knäckebröd',
  supplier: pbKnackebrodAB,
  category: grainsCereals,
  quantityPerUnit: '24 - 500 g pkgs.',
  unitPrice: 21,
  unitsInStock: 104,
  unitsOnOrder: 0,
  reorderLevel: 25,
  discontinued: false,
});

export const tunnbrD = Object.assign(new Product(), {
  id: 23,
  name: 'Tunnbröd',
  supplier: pbKnackebrodAB,
  category: grainsCereals,
  quantityPerUnit: '12 - 250 g pkgs.',
  unitPrice: 9,
  unitsInStock: 61,
  unitsOnOrder: 0,
  reorderLevel: 25,
  discontinued: false,
});

export const guaranFantStica = Object.assign(new Product(), {
  id: 24,
  name: 'Guaraná Fantástica',
  supplier: refrescosAmericanasLTDA,
  category: beverages,
  quantityPerUnit: '12 - 355 ml cans',
  unitPrice: 4.5,
  unitsInStock: 20,
  unitsOnOrder: 0,
  reorderLevel: 0,
  discontinued: true,
});

export const nuNuCaNuNougatCreme = Object.assign(new Product(), {
  id: 25,
  name: 'NuNuCa Nuß-Nougat-Creme',
  supplier: heliSusswarenGmbHCoKG,
  category: confections,
  quantityPerUnit: '20 - 450 g glasses',
  unitPrice: 14,
  unitsInStock: 76,
  unitsOnOrder: 0,
  reorderLevel: 30,
  discontinued: false,
});

export const gumbRGummibRchen = Object.assign(new Product(), {
  id: 26,
  name: 'Gumbär Gummibärchen',
  supplier: heliSusswarenGmbHCoKG,
  category: confections,
  quantityPerUnit: '100 - 250 g bags',
  unitPrice: 31.23,
  unitsInStock: 15,
  unitsOnOrder: 0,
  reorderLevel: 0,
  discontinued: false,
});

export const schoggiSchokolade = Object.assign(new Product(), {
  id: 27,
  name: 'Schoggi Schokolade',
  supplier: heliSusswarenGmbHCoKG,
  category: confections,
  quantityPerUnit: '100 - 100 g pieces',
  unitPrice: 43.9,
  unitsInStock: 49,
  unitsOnOrder: 0,
  reorderLevel: 30,
  discontinued: false,
});

export const rSsleSauerkraut = Object.assign(new Product(), {
  id: 28,
  name: 'Rössle Sauerkraut',
  supplier: plutzerLebensmittelgrossmarkteAG,
  category: produce,
  quantityPerUnit: '25 - 825 g cans',
  unitPrice: 45.6,
  unitsInStock: 26,
  unitsOnOrder: 0,
  reorderLevel: 0,
  discontinued: true,
});

export const thRingerRostbratwurst = Object.assign(new Product(), {
  id: 29,
  name: 'Thüringer Rostbratwurst',
  supplier: plutzerLebensmittelgrossmarkteAG,
  category: meatPoultry,
  quantityPerUnit: '50 bags x 30 sausgs.',
  unitPrice: 123.79,
  unitsInStock: 0,
  unitsOnOrder: 0,
  reorderLevel: 0,
  discontinued: true,
});

export const nordOstMatjeshering = Object.assign(new Product(), {
  id: 30,
  name: 'Nord-Ost Matjeshering',
  supplier: nordOstFischHandelsgesellschaftMbH,
  category: seafood,
  quantityPerUnit: '10 - 200 g glasses',
  unitPrice: 25.89,
  unitsInStock: 10,
  unitsOnOrder: 0,
  reorderLevel: 15,
  discontinued: false,
});

export const gorgonzolaTelino = Object.assign(new Product(), {
  id: 31,
  name: 'Gorgonzola Telino',
  supplier: formaggiFortiniSRL,
  category: dairyProducts,
  quantityPerUnit: '12 - 100 g pkgs',
  unitPrice: 12.5,
  unitsInStock: 0,
  unitsOnOrder: 70,
  reorderLevel: 20,
  discontinued: false,
});

export const mascarponeFabioli = Object.assign(new Product(), {
  id: 32,
  name: 'Mascarpone Fabioli',
  supplier: formaggiFortiniSRL,
  category: dairyProducts,
  quantityPerUnit: '24 - 200 g pkgs.',
  unitPrice: 32,
  unitsInStock: 9,
  unitsOnOrder: 40,
  reorderLevel: 25,
  discontinued: false,
});

export const geitost = Object.assign(new Product(), {
  id: 33,
  name: 'Geitost',
  supplier: norskeMeierier,
  category: dairyProducts,
  quantityPerUnit: '500 g',
  unitPrice: 2.5,
  unitsInStock: 112,
  unitsOnOrder: 0,
  reorderLevel: 20,
  discontinued: false,
});

export const sasquatchAle = Object.assign(new Product(), {
  id: 34,
  name: 'Sasquatch Ale',
  supplier: bigfootBreweries,
  category: beverages,
  quantityPerUnit: '24 - 12 oz bottles',
  unitPrice: 14,
  unitsInStock: 111,
  unitsOnOrder: 0,
  reorderLevel: 15,
  discontinued: false,
});

export const steeleyeStout = Object.assign(new Product(), {
  id: 35,
  name: 'Steeleye Stout',
  supplier: bigfootBreweries,
  category: beverages,
  quantityPerUnit: '24 - 12 oz bottles',
  unitPrice: 18,
  unitsInStock: 20,
  unitsOnOrder: 0,
  reorderLevel: 15,
  discontinued: false,
});

export const inlagdSill = Object.assign(new Product(), {
  id: 36,
  name: 'Inlagd Sill',
  supplier: svenskSjofoodaAB,
  category: seafood,
  quantityPerUnit: '24 - 250 g  jars',
  unitPrice: 19,
  unitsInStock: 112,
  unitsOnOrder: 0,
  reorderLevel: 20,
  discontinued: false,
});

export const gravadLax = Object.assign(new Product(), {
  id: 37,
  name: 'Gravad lax',
  supplier: svenskSjofoodaAB,
  category: seafood,
  quantityPerUnit: '12 - 500 g pkgs.',
  unitPrice: 26,
  unitsInStock: 11,
  unitsOnOrder: 50,
  reorderLevel: 25,
  discontinued: false,
});

export const cTeDeBlaye = Object.assign(new Product(), {
  id: 38,
  name: 'Côte de Blaye',
  supplier: auxJoyeuxEcclesiastiques,
  category: beverages,
  quantityPerUnit: '12 - 75 cl bottles',
  unitPrice: 263.5,
  unitsInStock: 17,
  unitsOnOrder: 0,
  reorderLevel: 15,
  discontinued: false,
});

export const chartreuseVerte = Object.assign(new Product(), {
  id: 39,
  name: 'Chartreuse verte',
  supplier: auxJoyeuxEcclesiastiques,
  category: beverages,
  quantityPerUnit: '750 cc per bottle',
  unitPrice: 18,
  unitsInStock: 69,
  unitsOnOrder: 0,
  reorderLevel: 5,
  discontinued: false,
});

export const bostonCrabMeat = Object.assign(new Product(), {
  id: 40,
  name: 'Boston Crab Meat',
  supplier: newEnglandSeafoodCannery,
  category: seafood,
  quantityPerUnit: '24 - 4 oz tins',
  unitPrice: 18.4,
  unitsInStock: 123,
  unitsOnOrder: 0,
  reorderLevel: 30,
  discontinued: false,
});

export const jackSNewEnglandClamChowder = Object.assign(new Product(), {
  id: 41,
  name: "Jack's New England Clam Chowder",
  supplier: newEnglandSeafoodCannery,
  category: seafood,
  quantityPerUnit: '12 - 12 oz cans',
  unitPrice: 9.65,
  unitsInStock: 85,
  unitsOnOrder: 0,
  reorderLevel: 10,
  discontinued: false,
});

export const singaporeanHokkienFriedMee = Object.assign(new Product(), {
  id: 42,
  name: 'Singaporean Hokkien Fried Mee',
  supplier: lekaTrading,
  category: grainsCereals,
  quantityPerUnit: '32 - 1 kg pkgs.',
  unitPrice: 14,
  unitsInStock: 26,
  unitsOnOrder: 0,
  reorderLevel: 0,
  discontinued: true,
});

export const ipohCoffee = Object.assign(new Product(), {
  id: 43,
  name: 'Ipoh Coffee',
  supplier: lekaTrading,
  category: beverages,
  quantityPerUnit: '16 - 500 g tins',
  unitPrice: 46,
  unitsInStock: 17,
  unitsOnOrder: 10,
  reorderLevel: 25,
  discontinued: false,
});

export const gulaMalacca = Object.assign(new Product(), {
  id: 44,
  name: 'Gula Malacca',
  supplier: lekaTrading,
  category: condiments,
  quantityPerUnit: '20 - 2 kg bags',
  unitPrice: 19.45,
  unitsInStock: 27,
  unitsOnOrder: 0,
  reorderLevel: 15,
  discontinued: false,
});

export const rogedeSild = Object.assign(new Product(), {
  id: 45,
  name: 'Rogede sild',
  supplier: lyngbysild,
  category: seafood,
  quantityPerUnit: '1k pkg.',
  unitPrice: 9.5,
  unitsInStock: 5,
  unitsOnOrder: 70,
  reorderLevel: 15,
  discontinued: false,
});

export const spegesild = Object.assign(new Product(), {
  id: 46,
  name: 'Spegesild',
  supplier: lyngbysild,
  category: seafood,
  quantityPerUnit: '4 - 450 g glasses',
  unitPrice: 12,
  unitsInStock: 95,
  unitsOnOrder: 0,
  reorderLevel: 0,
  discontinued: false,
});

export const zaanseKoeken = Object.assign(new Product(), {
  id: 47,
  name: 'Zaanse koeken',
  supplier: zaanseSnoepfabriek,
  category: confections,
  quantityPerUnit: '10 - 4 oz boxes',
  unitPrice: 9.5,
  unitsInStock: 36,
  unitsOnOrder: 0,
  reorderLevel: 0,
  discontinued: false,
});

export const chocolade = Object.assign(new Product(), {
  id: 48,
  name: 'Chocolade',
  supplier: zaanseSnoepfabriek,
  category: confections,
  quantityPerUnit: '10 pkgs.',
  unitPrice: 12.75,
  unitsInStock: 15,
  unitsOnOrder: 70,
  reorderLevel: 25,
  discontinued: false,
});

export const maxilaku = Object.assign(new Product(), {
  id: 49,
  name: 'Maxilaku',
  supplier: karkkiOy,
  category: confections,
  quantityPerUnit: '24 - 50 g pkgs.',
  unitPrice: 20,
  unitsInStock: 10,
  unitsOnOrder: 60,
  reorderLevel: 15,
  discontinued: false,
});

export const valkoinenSuklaa = Object.assign(new Product(), {
  id: 50,
  name: 'Valkoinen suklaa',
  supplier: karkkiOy,
  category: confections,
  quantityPerUnit: '12 - 100 g bars',
  unitPrice: 16.25,
  unitsInStock: 65,
  unitsOnOrder: 0,
  reorderLevel: 30,
  discontinued: false,
});

export const manjimupDriedApples = Object.assign(new Product(), {
  id: 51,
  name: 'Manjimup Dried Apples',
  supplier: gdayMate,
  category: produce,
  quantityPerUnit: '50 - 300 g pkgs.',
  unitPrice: 53,
  unitsInStock: 20,
  unitsOnOrder: 0,
  reorderLevel: 10,
  discontinued: false,
});

export const filoMix = Object.assign(new Product(), {
  id: 52,
  name: 'Filo Mix',
  supplier: gdayMate,
  category: grainsCereals,
  quantityPerUnit: '16 - 2 kg boxes',
  unitPrice: 7,
  unitsInStock: 38,
  unitsOnOrder: 0,
  reorderLevel: 25,
  discontinued: false,
});

export const perthPasties = Object.assign(new Product(), {
  id: 53,
  name: 'Perth Pasties',
  supplier: gdayMate,
  category: meatPoultry,
  quantityPerUnit: '48 pieces',
  unitPrice: 32.8,
  unitsInStock: 0,
  unitsOnOrder: 0,
  reorderLevel: 0,
  discontinued: true,
});

export const tourtiRe = Object.assign(new Product(), {
  id: 54,
  name: 'Tourtière',
  supplier: maMaison,
  category: meatPoultry,
  quantityPerUnit: '16 pies',
  unitPrice: 7.45,
  unitsInStock: 21,
  unitsOnOrder: 0,
  reorderLevel: 10,
  discontinued: false,
});

export const pTChinois = Object.assign(new Product(), {
  id: 55,
  name: 'Pâté chinois',
  supplier: maMaison,
  category: meatPoultry,
  quantityPerUnit: '24 boxes x 2 pies',
  unitPrice: 24,
  unitsInStock: 115,
  unitsOnOrder: 0,
  reorderLevel: 20,
  discontinued: false,
});

export const gnocchiDiNonnaAlice = Object.assign(new Product(), {
  id: 56,
  name: 'Gnocchi di nonna Alice',
  supplier: pastaButtiniSRL,
  category: grainsCereals,
  quantityPerUnit: '24 - 250 g pkgs.',
  unitPrice: 38,
  unitsInStock: 21,
  unitsOnOrder: 10,
  reorderLevel: 30,
  discontinued: false,
});

export const ravioliAngelo = Object.assign(new Product(), {
  id: 57,
  name: 'Ravioli Angelo',
  supplier: pastaButtiniSRL,
  category: grainsCereals,
  quantityPerUnit: '24 - 250 g pkgs.',
  unitPrice: 19.5,
  unitsInStock: 36,
  unitsOnOrder: 0,
  reorderLevel: 20,
  discontinued: false,
});

export const escargotsDeBourgogne = Object.assign(new Product(), {
  id: 58,
  name: 'Escargots de Bourgogne',
  supplier: escargotsNouveaux,
  category: seafood,
  quantityPerUnit: '24 pieces',
  unitPrice: 13.25,
  unitsInStock: 62,
  unitsOnOrder: 0,
  reorderLevel: 20,
  discontinued: false,
});

export const racletteCourdavault = Object.assign(new Product(), {
  id: 59,
  name: 'Raclette Courdavault',
  supplier: gaiPaturage,
  category: dairyProducts,
  quantityPerUnit: '5 kg pkg.',
  unitPrice: 55,
  unitsInStock: 79,
  unitsOnOrder: 0,
  reorderLevel: 0,
  discontinued: false,
});

export const camembertPierrot = Object.assign(new Product(), {
  id: 60,
  name: 'Camembert Pierrot',
  supplier: gaiPaturage,
  category: dairyProducts,
  quantityPerUnit: '15 - 300 g rounds',
  unitPrice: 34,
  unitsInStock: 19,
  unitsOnOrder: 0,
  reorderLevel: 0,
  discontinued: false,
});

export const siropDRable = Object.assign(new Product(), {
  id: 61,
  name: 'Sirop d’érable',
  supplier: foretsDerables,
  category: condiments,
  quantityPerUnit: '24 - 500 ml bottles',
  unitPrice: 28.5,
  unitsInStock: 113,
  unitsOnOrder: 0,
  reorderLevel: 25,
  discontinued: false,
});

export const tarteAuSucre = Object.assign(new Product(), {
  id: 62,
  name: 'Tarte au sucre',
  supplier: foretsDerables,
  category: confections,
  quantityPerUnit: '48 pies',
  unitPrice: 49.3,
  unitsInStock: 17,
  unitsOnOrder: 0,
  reorderLevel: 0,
  discontinued: false,
});

export const vegieSpread = Object.assign(new Product(), {
  id: 63,
  name: 'Vegie-spread',
  supplier: pavlovaLtd,
  category: condiments,
  quantityPerUnit: '15 - 625 g jars',
  unitPrice: 43.9,
  unitsInStock: 24,
  unitsOnOrder: 0,
  reorderLevel: 5,
  discontinued: false,
});

export const wimmersGuteSemmelknDel = Object.assign(new Product(), {
  id: 64,
  name: 'Wimmers gute Semmelknödel',
  supplier: plutzerLebensmittelgrossmarkteAG,
  category: grainsCereals,
  quantityPerUnit: '20 bags x 4 pieces',
  unitPrice: 33.25,
  unitsInStock: 22,
  unitsOnOrder: 80,
  reorderLevel: 30,
  discontinued: false,
});

export const louisianaFieryHotPepperSauce = Object.assign(new Product(), {
  id: 65,
  name: 'Louisiana Fiery Hot Pepper Sauce',
  supplier: newOrleansCajunDelights,
  category: condiments,
  quantityPerUnit: '32 - 8 oz bottles',
  unitPrice: 21.05,
  unitsInStock: 76,
  unitsOnOrder: 0,
  reorderLevel: 0,
  discontinued: false,
});

export const louisianaHotSpicedOkra = Object.assign(new Product(), {
  id: 66,
  name: 'Louisiana Hot Spiced Okra',
  supplier: newOrleansCajunDelights,
  category: condiments,
  quantityPerUnit: '24 - 8 oz jars',
  unitPrice: 17,
  unitsInStock: 4,
  unitsOnOrder: 100,
  reorderLevel: 20,
  discontinued: false,
});

export const laughingLumberjackLager = Object.assign(new Product(), {
  id: 67,
  name: 'Laughing Lumberjack Lager',
  supplier: bigfootBreweries,
  category: beverages,
  quantityPerUnit: '24 - 12 oz bottles',
  unitPrice: 14,
  unitsInStock: 52,
  unitsOnOrder: 0,
  reorderLevel: 10,
  discontinued: false,
});

export const scottishLongbreads = Object.assign(new Product(), {
  id: 68,
  name: 'Scottish Longbreads',
  supplier: specialtyBiscuitsLtd,
  category: confections,
  quantityPerUnit: '10 boxes x 8 pieces',
  unitPrice: 12.5,
  unitsInStock: 6,
  unitsOnOrder: 10,
  reorderLevel: 15,
  discontinued: false,
});

export const gudbrandsdalsost = Object.assign(new Product(), {
  id: 69,
  name: 'Gudbrandsdalsost',
  supplier: norskeMeierier,
  category: dairyProducts,
  quantityPerUnit: '10 kg pkg.',
  unitPrice: 36,
  unitsInStock: 26,
  unitsOnOrder: 0,
  reorderLevel: 15,
  discontinued: false,
});

export const outbackLager = Object.assign(new Product(), {
  id: 70,
  name: 'Outback Lager',
  supplier: pavlovaLtd,
  category: beverages,
  quantityPerUnit: '24 - 355 ml bottles',
  unitPrice: 15,
  unitsInStock: 15,
  unitsOnOrder: 10,
  reorderLevel: 30,
  discontinued: false,
});

export const flotemysost = Object.assign(new Product(), {
  id: 71,
  name: 'Flotemysost',
  supplier: norskeMeierier,
  category: dairyProducts,
  quantityPerUnit: '10 - 500 g pkgs.',
  unitPrice: 21.5,
  unitsInStock: 26,
  unitsOnOrder: 0,
  reorderLevel: 0,
  discontinued: false,
});

export const mozzarellaDiGiovanni = Object.assign(new Product(), {
  id: 72,
  name: 'Mozzarella di Giovanni',
  supplier: formaggiFortiniSRL,
  category: dairyProducts,
  quantityPerUnit: '24 - 200 g pkgs.',
  unitPrice: 34.8,
  unitsInStock: 14,
  unitsOnOrder: 0,
  reorderLevel: 0,
  discontinued: false,
});

export const rDKaviar = Object.assign(new Product(), {
  id: 73,
  name: 'Röd Kaviar',
  supplier: svenskSjofoodaAB,
  category: seafood,
  quantityPerUnit: '24 - 150 g jars',
  unitPrice: 15,
  unitsInStock: 101,
  unitsOnOrder: 0,
  reorderLevel: 5,
  discontinued: false,
});

export const longlifeTofu = Object.assign(new Product(), {
  id: 74,
  name: 'Longlife Tofu',
  supplier: tokyoTraders,
  category: produce,
  quantityPerUnit: '5 kg pkg.',
  unitPrice: 10,
  unitsInStock: 4,
  unitsOnOrder: 20,
  reorderLevel: 5,
  discontinued: false,
});

export const rhNbrUKlosterbier = Object.assign(new Product(), {
  id: 75,
  name: 'Rhönbräu Klosterbier',
  supplier: plutzerLebensmittelgrossmarkteAG,
  category: beverages,
  quantityPerUnit: '24 - 0.5 l bottles',
  unitPrice: 7.75,
  unitsInStock: 125,
  unitsOnOrder: 0,
  reorderLevel: 25,
  discontinued: false,
});

export const lakkalikRi = Object.assign(new Product(), {
  id: 76,
  name: 'Lakkalikööri',
  supplier: karkkiOy,
  category: beverages,
  quantityPerUnit: '500 ml',
  unitPrice: 18,
  unitsInStock: 57,
  unitsOnOrder: 0,
  reorderLevel: 20,
  discontinued: false,
});

export const originalFrankfurterGrNeSoE = Object.assign(new Product(), {
  id: 77,
  name: 'Original Frankfurter grüne Soße',
  supplier: plutzerLebensmittelgrossmarkteAG,
  category: condiments,
  quantityPerUnit: '12 boxes',
  unitPrice: 13,
  unitsInStock: 32,
  unitsOnOrder: 0,
  reorderLevel: 15,
  discontinued: false,
});

const productJsonFixtures = JSON.stringify(
  [
    chai,
    chang,
    aniseedSyrup,
    chefAntonSCajunSeasoning,
    chefAntonSGumboMix,
    grandmaSBoysenberrySpread,
    uncleBobSOrganicDriedPears,
    northwoodsCranberrySauce,
    mishiKobeNiku,
    ikura,
    quesoCabrales,
    quesoManchegoLaPastora,
    konbu,
    tofu,
    genenShouyu,
    pavlova,
    aliceMutton,
    carnarvonTigers,
    teatimeChocolateBiscuits,
    sirRodneySMarmalade,
    sirRodneySScones,
    gustafSKnCkebrD,
    tunnbrD,
    guaranFantStica,
    nuNuCaNuNougatCreme,
    gumbRGummibRchen,
    schoggiSchokolade,
    rSsleSauerkraut,
    thRingerRostbratwurst,
    nordOstMatjeshering,
    gorgonzolaTelino,
    mascarponeFabioli,
    geitost,
    sasquatchAle,
    steeleyeStout,
    inlagdSill,
    gravadLax,
    cTeDeBlaye,
    chartreuseVerte,
    bostonCrabMeat,
    jackSNewEnglandClamChowder,
    singaporeanHokkienFriedMee,
    ipohCoffee,
    gulaMalacca,
    rogedeSild,
    spegesild,
    zaanseKoeken,
    chocolade,
    maxilaku,
    valkoinenSuklaa,
    manjimupDriedApples,
    filoMix,
    perthPasties,
    tourtiRe,
    pTChinois,
    gnocchiDiNonnaAlice,
    ravioliAngelo,
    escargotsDeBourgogne,
    racletteCourdavault,
    camembertPierrot,
    siropDRable,
    tarteAuSucre,
    vegieSpread,
    wimmersGuteSemmelknDel,
    louisianaFieryHotPepperSauce,
    louisianaHotSpicedOkra,
    laughingLumberjackLager,
    scottishLongbreads,
    gudbrandsdalsost,
    outbackLager,
    flotemysost,
    mozzarellaDiGiovanni,
    rDKaviar,
    longlifeTofu,
    rhNbrUKlosterbier,
    lakkalikRi,
    originalFrankfurterGrNeSoE,
  ],
  (key, value) => {
    if (key === 'supplier' || key === 'category') {
      return (value as Record<string, unknown>).id;
    }

    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }

    return value as unknown;
  },
);

export default class ProductSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    await dataSource.transaction(async (manager) => {
      await manager.sql`ALTER TABLE product NOCHECK CONSTRAINT ALL;
      SET IDENTITY_INSERT product ON;

      MERGE INTO product AS target
      USING OPENJSON(${productJsonFixtures}) WITH (
        id bigint,
        name varchar(40),
        supplier bigint,
        category bigint,
        quantityPerUnit varchar(20),
        unitPrice money,
        unitsInStock int,
        unitsOnOrder int,
        reorderLevel smallint,
        discontinued bit
      ) AS source
      ON target.id = source.id
      WHEN MATCHED THEN
        UPDATE SET
          name = source.name,
          supplierId = source.supplier,
          categoryId = source.category,
          quantityPerUnit = source.quantityPerUnit,
          unitPrice = source.unitPrice,
          unitsInStock = source.unitsInStock,
          unitsOnOrder = source.unitsOnOrder,
          reorderLevel = source.reorderLevel,
          discontinued = source.discontinued
      WHEN NOT MATCHED THEN
        INSERT (
          id,
          name,
          supplierId,
          categoryId,
          quantityPerUnit,
          unitPrice,
          unitsInStock,
          unitsOnOrder,
          reorderLevel,
          discontinued
        ) VALUES (
          source.id,
          source.name,
          source.supplier,
          source.category,
          source.quantityPerUnit,
          source.unitPrice,
          source.unitsInStock,
          source.unitsOnOrder,
          source.reorderLevel,
          source.discontinued
        );

      ALTER TABLE product CHECK CONSTRAINT ALL;
      SET IDENTITY_INSERT product OFF`;
    });
  }
}
