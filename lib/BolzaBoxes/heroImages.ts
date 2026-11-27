import { MEDIA, projectMediaUrl } from "./media";

// ?w= : version WebP réduite servie par /api/media (main.png pèse près de 8 Mo)
const home = {
    international: projectMediaUrl(MEDIA.hero.international, 2400),
    french: projectMediaUrl(MEDIA.hero.french, 2400),
};

export const HERO_IMAGES = {
    home,
    // Provisoire : mêmes images que l'accueil, en attendant des photos dédiées
    gallery: home,
    makingOf: home,
};
