import type { Localized } from "@/lib/i18n/lang";

export type Section = {
    imageInternational: string;
    imageFrench: string;
    imageAlt: Localized;
    title: Localized;
    text: Localized;
};

export const SECTIONS: Section[] = [
    {
        imageInternational: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/English_prototypes.jpg?w=1000",
        imageFrench: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/photo2.jpg?w=1000",
        imageAlt: { en: "Photo 1", fr: "Photo 1" },
        title: { en: "Horizontal and Vertical Storage", fr: "Rangement horizontal et vertical" },
        text: {
            en: "Actually… storage in any direction",
            fr: "En fait… rangement dans tous les sens",
        },
    },
    {
        imageInternational: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/English_prototypes.jpg?w=1000",
        imageFrench: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/photo2.jpg?w=1000",
        imageAlt: { en: "Photo 2", fr: "Photo 2" },
        title: { en: "Sleeve compatible", fr: "Compatible avec les protège-cartes" },
        text: {
            en: "Official sleeves from Leder Games as well as common market ones. Fit in individual faction boxes and in the card rack.",
            fr: "Les protège-cartes officiels de Leder Games comme ceux du commerce. Ils tiennent dans chaque boîte de faction et dans le range-cartes.",
        },
    },
    {
        imageInternational: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/English_prototypes.jpg?w=1000",
        imageFrench: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/photo2.jpg?w=1000",
        imageAlt: { en: "Photo 3", fr: "Photo 3" },
        title: { en: "Boxes rearrangeable", fr: "Boîtes réorganisables" },
        text: {
            en: "Rearrange your boxes how you like. Side designs adapt to your desired orientation.",
            fr: "Agence tes boîtes comme tu veux. Les motifs sur les côtés s'adaptent à l'orientation choisie.",
        },
    },
    {
        imageInternational: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/English_prototypes.jpg?w=1000",
        imageFrench: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/photo2.jpg?w=1000",
        imageAlt: { en: "Photo 4", fr: "Photo 4" },
        title: { en: "Stickers compatible", fr: "Compatible avec les autocollants" },
        text: {
            en: "Tested and proven with brand X. No, the holes are not too tight!",
            fr: "Testé et approuvé avec la marque X. Non, les trous ne sont pas trop serrés !",
        },
    },
    {
        imageInternational: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/English_prototypes.jpg?w=1000",
        imageFrench: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/photo2.jpg?w=1000",
        imageAlt: { en: "Photo 5", fr: "Photo 5" },
        title: { en: "Everything in one box", fr: "Tout dans une boîte" },
        text: {
            en: "All components relative to a faction in one place: its designated box. No need to look in 10 different places to find what you want during setup.",
            fr: "Tout le matériel d'une faction au même endroit : sa boîte. Plus besoin de chercher à dix endroits différents pendant la mise en place.",
        },
    },
    {
        imageInternational: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/English_prototypes.jpg?w=1000",
        imageFrench: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/photo2.jpg?w=1000",
        imageAlt: { en: "Photo 6", fr: "Photo 6" },
        title: { en: "Extremely dense storage", fr: "Rangement ultra compact" },
        text: {
            en: "All small boxes up to the Homeland expansion in one box. Boards and maps in another, and hirelings in the Hireling Box.",
            fr: "Toutes les petites boîtes jusqu'à l'extension Homeland dans une seule boîte. Les plateaux et les cartes dans une autre, et les mercenaires dans la boîte des mercenaires.",
        },
    },
    {
        imageInternational: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/English_prototypes.jpg?w=1000",
        imageFrench: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/photo2.jpg?w=1000",
        imageAlt: { en: "Photo 7", fr: "Photo 7" },
        title: { en: "Neat little designs on the sides", fr: "De jolis motifs sur les côtés" },
        text: {
            en: "Vertical and horizontal. Everything was decorated with care: head logo for each faction as well as symbolic background.",
            fr: "À la verticale comme à l'horizontale. Tout a été décoré avec soin : la tête de chaque faction en logo et un fond symbolique.",
        },
    },
    {
        imageInternational: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/English_prototypes.jpg?w=1000",
        imageFrench: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/photo2.jpg?w=1000",
        imageAlt: { en: "Photo 8", fr: "Photo 8" },
        title: { en: "They clip!", fr: "Ça se clipse !" },
        text: {
            en: "The drawers clip into the boxes when fully inserted, preventing accidental falls.",
            fr: "Les tiroirs se clipsent dans les boîtes une fois bien enfoncés, ce qui évite les chutes involontaires.",
        },
    },
    {
        imageInternational: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/English_prototypes.jpg?w=1000",
        imageFrench: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/photo2.jpg?w=1000",
        imageAlt: { en: "Photo 9", fr: "Photo 9" },
        title: { en: "30 unique colors", fr: "30 couleurs uniques" },
        text: {
            en: "30 unique 3D printing plastics from the Bambu brand. They are recyclable.",
            fr: "30 plastiques d'impression 3D différents de la marque Bambu. Ils sont recyclables.",
        },
    },
    {
        imageInternational: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/English_prototypes.jpg?w=1000",
        imageFrench: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/photo2.jpg?w=1000",
        imageAlt: { en: "Photo 10", fr: "Photo 10" },
        title: { en: "Glass", fr: "Vitre" },
        text: {
            en: "See through glass for every box. Glass separators for the cards.",
            fr: "Une vitre transparente pour chaque boîte. Des séparateurs transparents pour les cartes.",
        },
    },
    {
        imageInternational: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/English_prototypes.jpg?w=1000",
        imageFrench: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/photo2.jpg?w=1000",
        imageAlt: { en: "Photo 10", fr: "Photo 10" },
        title: { en: "Ergonomic insertion", fr: "Rangement ergonomique" },
        text: {
            en: "Convenient, easy, intelligent storage for every piece. No need to rack your brain trying to fit pieces in. It's all thought out for you. A cute meeple always faces you.",
            fr: "Un rangement pratique, simple et intelligent pour chaque pièce. Inutile de te creuser la tête pour tout faire rentrer : tout a été pensé pour toi. Un petit meeple mignon te fait toujours face.",
        },
    },
    {
        imageInternational: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/English_prototypes.jpg?w=1000",
        imageFrench: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/photo2.jpg?w=1000",
        imageAlt: { en: "Photo 10", fr: "Photo 10" },
        title: { en: "Many boxes", fr: "De nombreuses boîtes" },
        text: {
            en: "One box for each faction. One for setup. One for landmarks. One box per Hireling release. One box for Hireling setup. One rack for all remaining cards. A bonus box for any additional component or card.",
            fr: "Une boîte par faction. Une pour la mise en place. Une pour les repères. Une boîte par sortie de mercenaires. Une boîte pour la mise en place des mercenaires. Un range-cartes pour toutes les autres cartes. Une boîte bonus pour tout composant ou carte supplémentaire.",
        },
    },
    {
        imageInternational: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/English_prototypes.jpg?w=1000",
        imageFrench: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/photo2.jpg?w=1000",
        imageAlt: { en: "Photo 10", fr: "Photo 10" },
        title: { en: "Holes for easy extraction", fr: "Des encoches pour sortir facilement" },
        text: {
            en: "'Finger holes' on the drawers' sides.",
            fr: "Des encoches pour les doigts sur les côtés des tiroirs.",
        },
    },
    {
        imageInternational: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/English_prototypes.jpg?w=1000",
        imageFrench: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/photo2.jpg?w=1000",
        imageAlt: { en: "Photo 10", fr: "Photo 10" },
        title: { en: "Paint them!", fr: "Peins-les !" },
        text: {
            en: "Just like miniatures, paint the boxes however you like.",
            fr: "Comme des figurines, peins les boîtes comme bon te semble.",
        },
    },
    {
        imageInternational: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/English_prototypes.jpg?w=1000",
        imageFrench: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/photo2.jpg?w=1000",
        imageAlt: { en: "Photo 10", fr: "Photo 10" },
        title: { en: "Future proof", fr: "Prêt pour l'avenir" },
        text: {
            en: "A new Root expansion is released? Just buy the add-ons and rearrange your boxes! No changes needed on existing boxes: keep them as they are.",
            fr: "Une nouvelle extension de Root vient de sortir ? Achète simplement les modules complémentaires et réorganise tes boîtes ! Aucune modification des boîtes existantes : garde-les telles quelles.",
        },
    },
    {
        imageInternational: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/English_prototypes.jpg?w=1000",
        imageFrench: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/photo2.jpg?w=1000",
        imageAlt: { en: "Photo 10", fr: "Photo 10" },
        title: { en: "Made by a Root connoisseur", fr: "Conçu par un connaisseur de Root" },
        text: {
            en: "I am a Root fan at core. I understand how the game works and what 'convenient storage' really means. Find me in the French community discords and sometimes playing tournaments!",
            fr: "Je suis fan de Root jusqu'au bout des ongles. Je sais comment le jeu fonctionne et ce que « rangement pratique » veut vraiment dire. Retrouve-moi sur les Discord de la communauté française, et parfois en tournoi !",
        },
    },
    {
        imageInternational: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/English_prototypes.jpg?w=1000",
        imageFrench: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/photo2.jpg?w=1000",
        imageAlt: { en: "Photo 10", fr: "Photo 10" },
        title: { en: "Super fast setup", fr: "Mise en place ultra rapide" },
        text: {
            en: "Install the setup components with the setup box. Give each player their faction box. Play.",
            fr: "Installe le matériel commun avec la boîte de mise en place. Donne à chaque joueur la boîte de sa faction. Jouez.",
        },
    },
    {
        imageInternational: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/English_prototypes.jpg?w=1000",
        imageFrench: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/photo2.jpg?w=1000",
        imageAlt: { en: "Photo 10", fr: "Photo 10" },
        title: { en: "Website for help", fr: "Un site pour t'aider" },
        text: {
            en: "See through glass for every box. Glass separators for the cards.",
            fr: "Une vitre transparente pour chaque boîte. Des séparateurs transparents pour les cartes.",
        },
    },
    {
        imageInternational: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/English_prototypes.jpg?w=1000",
        imageFrench: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/photo2.jpg?w=1000",
        imageAlt: { en: "Photo 10", fr: "Photo 10" },
        title: { en: "Glass", fr: "Vitre" },
        text: {
            en: "See through glass for every box. Glass separators for the cards.",
            fr: "Une vitre transparente pour chaque boîte. Des séparateurs transparents pour les cartes.",
        },
    },
    {
        imageInternational: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/English_prototypes.jpg?w=1000",
        imageFrench: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/photo2.jpg?w=1000",
        imageAlt: { en: "Photo 10", fr: "Photo 10" },
        title: { en: "Glass", fr: "Vitre" },
        text: {
            en: "See through glass for every box. Glass separators for the cards.",
            fr: "Une vitre transparente pour chaque boîte. Des séparateurs transparents pour les cartes.",
        },
    },
    {
        imageInternational: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/English_prototypes.jpg?w=1000",
        imageFrench: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/photo2.jpg?w=1000",
        imageAlt: { en: "Photo 10", fr: "Photo 10" },
        title: { en: "Glass", fr: "Vitre" },
        text: {
            en: "See through glass for every box. Glass separators for the cards.",
            fr: "Une vitre transparente pour chaque boîte. Des séparateurs transparents pour les cartes.",
        },
    },
    {
        imageInternational: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/English_prototypes.jpg?w=1000",
        imageFrench: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/photo2.jpg?w=1000",
        imageAlt: { en: "Photo 10", fr: "Photo 10" },
        title: { en: "Glass", fr: "Vitre" },
        text: {
            en: "See through glass for every box. Glass separators for the cards.",
            fr: "Une vitre transparente pour chaque boîte. Des séparateurs transparents pour les cartes.",
        },
    },
    {
        imageInternational: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/English_prototypes.jpg?w=1000",
        imageFrench: "/api/media/Projets/Root_BolzaBoxes/Media/Presentation/photo2.jpg?w=1000",
        imageAlt: { en: "Photo 10", fr: "Photo 10" },
        title: { en: "Glass", fr: "Vitre" },
        text: {
            en: "See through glass for every box. Glass separators for the cards.",
            fr: "Une vitre transparente pour chaque boîte. Des séparateurs transparents pour les cartes.",
        },
    },
    // Ajoute, retire ou modifie autant d'objets que nécessaire ici.
];
