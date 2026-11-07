const https = require('https');
const fs = require('fs');
const path = require('path');

const targetImages = [
  // 1. PRODUCTS (12 distinct, accurate bottles)
  {
    name: "product_chateau_lumiere_cabernet.jpg",
    url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=85",
    desc: "Château Lumière Cabernet Sauvignon (Bordeaux Left Bank)"
  },
  {
    name: "product_villa_rose_provencal.jpg",
    url: "https://images.unsplash.com/photo-1558001373-a8ef32b507d4?auto=format&fit=crop&w=1000&q=85",
    desc: "Villa Rosé Provençal (Pale Provence Rosé)"
  },
  {
    name: "product_monteverde_pinot_noir.jpg",
    url: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1000&q=85",
    desc: "Monteverde Pinot Noir (Veneto volcanic hillside)"
  },
  {
    name: "product_maison_etoile_chardonnay.jpg",
    url: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=1000&q=85",
    desc: "Maison Étoile Chardonnay (Burgundy Côte de Beaune)"
  },
  {
    name: "product_domaine_reine_champagne.jpg",
    url: "https://images.unsplash.com/photo-1569919659476-f0852f6834b7?auto=format&fit=crop&w=1000&q=85",
    desc: "Domaine de la Reine Brut Grand Cru (Champagne)"
  },
  {
    name: "product_san_pietro_brunello.jpg",
    url: "https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?auto=format&fit=crop&w=1000&q=85",
    desc: "Tenuta di San Pietro Brunello di Montalcino (Tuscany)"
  },
  {
    name: "product_cloud_valley_sauvignon.jpg",
    url: "https://images.unsplash.com/photo-1574888158525-241c8d5ea7d6?auto=format&fit=crop&w=1000&q=85",
    desc: "Cloud Valley Sauvignon Blanc (Marlborough, NZ)"
  },
  {
    name: "product_bodega_solaria_rioja.jpg",
    url: "https://images.unsplash.com/photo-1547595628-c61a29f496f0?auto=format&fit=crop&w=1000&q=85",
    desc: "Bodega Solaria Gran Reserva (Rioja, Spain with gold wire)"
  },
  {
    name: "product_st_helena_napa_cabernet.jpg",
    url: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=1000&q=85",
    desc: "St. Helena Reserve Cabernet (Napa Valley, California)"
  },
  {
    name: "product_schloss_johannisberg_riesling.jpg",
    url: "https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=1000&q=85",
    desc: "Schloss Johannisberg Riesling Feinherb (Rheingau, Germany)"
  },
  {
    name: "product_valdobbiadene_prosecco.jpg",
    url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=85",
    desc: "Valdobbiadene Prosecco Superiore DOCG (Veneto, Italy)"
  },
  {
    name: "product_grand_terroirs_gift_box.jpg",
    url: "https://images.unsplash.com/photo-1528823872057-9c018a7a7553?auto=format&fit=crop&w=1000&q=85",
    desc: "Grand Terroirs of France Trio in handcrafted wooden gift box"
  },

  // 2. CATEGORIES
  {
    name: "category_red_wine_curated.jpg",
    url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=85",
    desc: "Red Wine Collection"
  },
  {
    name: "category_white_wine_curated.jpg",
    url: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=1000&q=85",
    desc: "White Wine Collection"
  },
  {
    name: "category_rose_wine_curated.jpg",
    url: "https://images.unsplash.com/photo-1558001373-a8ef32b507d4?auto=format&fit=crop&w=1000&q=85",
    desc: "Rosé Wine Collection (Provence pale pink)"
  },
  {
    name: "category_sparkling_wine_curated.jpg",
    url: "https://images.unsplash.com/photo-1569919659476-f0852f6834b7?auto=format&fit=crop&w=1000&q=85",
    desc: "Sparkling Wine & Champagne Collection"
  },
  {
    name: "category_collections_vault_curated.jpg",
    url: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1000&q=85",
    desc: "Prestige Rare Cellar Allocations"
  },
  {
    name: "category_gift_sets_curated.jpg",
    url: "https://images.unsplash.com/photo-1528823872057-9c018a7a7553?auto=format&fit=crop&w=1000&q=85",
    desc: "Handcrafted Wooden Box Gift Sets & Decanters"
  },

  // 3. DAVAO BRANCHES
  {
    name: "branch_lanang_flagship.jpg",
    url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=85",
    desc: "Lanang Subterranean Vault & Flagship Cellar"
  },
  {
    name: "branch_abreeza_wine_bar.jpg",
    url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=85",
    desc: "Abreeza Modern Wine Bar & Enomatic Dispensers"
  },
  {
    name: "branch_matina_reserve.jpg",
    url: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1200&q=85",
    desc: "Matina Enclaves Intimate Fireside Cellar & VIP Lockers"
  },
  {
    name: "branch_azuela_waterfront.jpg",
    url: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=1200&q=85",
    desc: "Azuela Cove Boardwalk Waterfront Terrace & Champagne Bar"
  },
  {
    name: "branch_sm_lanang_boutique.jpg",
    url: "https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=1200&q=85",
    desc: "SM Lanang Luxury Boutique Cellar & Gift Concierge"
  },

  // 4. FOOD PAIRINGS
  {
    name: "pairing_prime_ribeye_steak.jpg",
    url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85",
    desc: "Sizzling Dry-Aged Prime Ribeye Steak"
  },
  {
    name: "pairing_oysters_and_caviar.jpg",
    url: "https://images.unsplash.com/photo-1553659971-f01207815844?auto=format&fit=crop&w=1200&q=85",
    desc: "Fresh Chilled Oysters on Crushed Ice with Champagne"
  },
  {
    name: "pairing_artisanal_charcuterie.jpg",
    url: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=85",
    desc: "Aged Comté, Prosciutto, Truffle Honey, and Fig Charcuterie Board"
  },
  {
    name: "pairing_seared_scallops_lobster.jpg",
    url: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=1200&q=85",
    desc: "Butter-Basted Jumbo Sea Scallops with Chard and Citrus"
  },

  // 5. WORLD WINE TERROIRS
  {
    name: "region_bordeaux_chateau.jpg",
    url: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=85",
    desc: "Bordeaux Historic Stone Château & Gravel Vineyard"
  },
  {
    name: "region_burgundy_slopes.jpg",
    url: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=85",
    desc: "Burgundy Côte d Or limestone terraces"
  },
  {
    name: "region_tuscany_hills.jpg",
    url: "https://images.unsplash.com/photo-1523528283115-9bf9b1699245?auto=format&fit=crop&w=1200&q=85",
    desc: "Tuscany rolling hills with cypress trees and Sangiovese vines"
  },
  {
    name: "region_napa_valley.jpg",
    url: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=1200&q=85",
    desc: "Napa Valley benchland vineyards framed by Mayacamas mountains"
  },
  {
    name: "region_rioja_spain.jpg",
    url: "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=1200&q=85",
    desc: "Rioja Alta red clay vineyards and medieval Basque hilltops"
  },
  {
    name: "region_marlborough_nz.jpg",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
    desc: "Marlborough Wairau valley flanked by mountain peaks"
  },
  {
    name: "region_champagne_france.jpg",
    url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=85",
    desc: "Montagne de Reims rolling chalk vineyards and ancient cellars"
  },

  // 6. WINE GUIDE ARTICLES
  {
    name: "guide_choosing_wine.jpg",
    url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=85",
    desc: "Sommelier presenting wine bottle at fine dining table"
  },
  {
    name: "guide_red_vs_white.jpg",
    url: "https://images.unsplash.com/photo-1558001373-a8ef32b507d4?auto=format&fit=crop&w=1200&q=85",
    desc: "Comparative wine glasses of rich red and luminous white"
  },
  {
    name: "guide_wine_labels.jpg",
    url: "https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?auto=format&fit=crop&w=1200&q=85",
    desc: "Close-up macro of embossed vintage Grand Cru wine labels"
  },
  {
    name: "guide_food_wine_pairing.jpg",
    url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85",
    desc: "Art of food and wine pairing gastronomy table"
  },
  {
    name: "guide_tropical_cellaring.jpg",
    url: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=85",
    desc: "Climate-controlled subterranean wine preservation vault"
  },
  {
    name: "guide_tasting_notes.jpg",
    url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=85",
    desc: "Master Sommelier swirling crystal glass observing color and rim"
  }
];

function fetchWithRedirect(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchWithRedirect(res.headers.location).then(resolve).catch(reject);
      } else if (res.statusCode === 200) {
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => resolve(Buffer.concat(chunks)));
        res.on('error', reject);
      } else {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
    }).on('error', reject);
  });
}

async function run() {
  const pubDir = path.resolve('public/images');
  const srcDir = path.resolve('src/assets/images');

  if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });
  if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir, { recursive: true });

  console.log(`Starting download of ${targetImages.length} curated images...`);

  let count = 0;
  for (const img of targetImages) {
    try {
      const buffer = await fetchWithRedirect(img.url);
      const p1 = path.join(pubDir, img.name);
      const p2 = path.join(srcDir, img.name);
      fs.writeFileSync(p1, buffer);
      fs.writeFileSync(p2, buffer);
      count++;
      console.log(`[${count}/${targetImages.length}] OK: ${img.name} (${Math.round(buffer.length / 1024)} KB)`);
    } catch (err) {
      console.error(`Error downloading ${img.name}:`, err.message);
    }
  }

  console.log(`Successfully finished downloading ${count} / ${targetImages.length} photos!`);
}

run();
