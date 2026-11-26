import type { Localized } from "@/lib/i18n/lang";

export type YoutubeItem = {
    title: string; // titre de la vidéo ou de la chaîne (non traduit)
    url: string;
    description: Localized;
    thumbnail?: string;
};

export type YoutubeSection = {
    title: Localized;
    items: YoutubeItem[];
};

export const YOUTUBE_SECTIONS: YoutubeSection[] = [
    {
        title: { en: "How to Draw", fr: "Apprendre à dessiner" },
        items: [
            {
                title: "Design Theory - Sinix Design",
                url: "https://www.youtube.com/watch?v=uEgCsWyOyCo&list=PLflflDShjUKF_7w4YTmpjGO27iuyHDpDu&pp=0gcJCQ4DOCosWNin",
                description: {
                    en: "Macro thinking about your drawing.",
                    fr: "Une réflexion d'ensemble sur ton dessin.",
                },
            },
            {
                title: "Anatomy Quick Tips - Sinix Design",
                url: "https://www.youtube.com/watch?v=IVbqoy_JEV0&list=PLflflDShjUKH4EfZyf0vuKEuqeqvlV0Qd",
                description: { en: "Must watch", fr: "À voir absolument" },
            },
            {
                title: "Paintover Pals - Sinix Design",
                url: "https://www.youtube.com/watch?v=WTh4CdJpJZ0&list=PLflflDShjUKG_c6Ty5g8U4-fVmWBQQNS9&pp=0gcJCbwFa94AFGB0",
                description: {
                    en: "Give many ideas on how to approach a design and of course how to fix mistakes.",
                    fr: "Plein d'idées pour aborder un design et, bien sûr, pour corriger ses erreurs.",
                },
            },
            {
                title: "Proko",
                url: "https://www.youtube.com/@ProkoTV",
                description: {
                    en: "Not Sinix but still good. Look for the video on lighting. Group of many different artists with different styles and points of view.",
                    fr: "Pas Sinix, mais quand même bien. Cherche la vidéo sur l'éclairage. Un collectif de nombreux artistes aux styles et points de vue différents.",
                },
            },
            {
                title: "blfsloth",
                url: "https://www.youtube.com/@blfsloth",
                description: {
                    en: "Mostly sexy girls I'm afraid, but good process and rendering.",
                    fr: "Surtout des filles sexy, j'en ai peur, mais un bon processus et un bon rendu.",
                },
            },
            {
                title: "WLOP",
                url: "https://www.youtube.com/@WLOP",
                description: {
                    en: "Cute girls again. Sorry but digital artists tend to do this.",
                    fr: "Encore des jolies filles. Désolé, mais les artistes numériques ont tendance à faire ça.",
                },
            },
            {
                title: "Andrew Cadima",
                url: "https://www.youtube.com/@andrewcadima",
                description: { en: "Crazy understanding of values.", fr: "Une compréhension folle des valeurs." },
            },
            {
                title: "J'ai essayé de créer un manga - Pewdiepie",
                url: "https://www.youtube.com/watch?v=iRRpvuMG7AM",
                description: {
                    en: "I just like pewdiepie ok sue me. Still it is valuable to follow the process of a beginner. He knows how to share his journey.",
                    fr: "J'aime bien PewDiePie, voilà, attaquez-moi en justice. Ça reste précieux de suivre le parcours d'un débutant. Il sait partager son cheminement.",
                },
            },
            {
                title: "Jeff Haines",
                url: "https://www.youtube.com/@JeffHainesArt",
                description: { en: "Good charcoal mm yummy.", fr: "Du bon fusain, miam." },
            },
            {
                title: "Sinix Design",
                url: "https://www.youtube.com/@sinixdesign",
                description: { en: "Just wanted to put Sinix again.", fr: "Je voulais juste remettre Sinix." },
            },
        ],
    },
    {
        title: { en: "How to Digital paint", fr: "Apprendre la peinture numérique" },
        items: [
            {
                title: "how to choose a drawing tablet  - shar",
                url: "https://www.youtube.com/watch?v=-gEh8n6dmjg",
                description: {
                    en: "I do not recommend it if you want to decide which brand to pick. I recommend this video if you want to find out which type of tablet is best for you: pen tablet, pen display, or standalone.",
                    fr: "Je ne la recommande pas pour choisir une marque. Je recommande cette vidéo pour savoir quel type de tablette te convient : tablette à stylet, écran à stylet ou tablette autonome.",
                },
            },
            {
                title: "Brad Colbow",
                url: "https://www.youtube.com/@thebradcolbow/featured",
                description: {
                    en: "Another link to choose the best tablet. Comprehensive and always up to date. I encourage to explore his website as well.",
                    fr: "Un autre lien pour choisir la meilleure tablette. Complet et toujours à jour. Je t'encourage à explorer son site aussi.",
                },
            },
            {
                title: "Learn to Procreate - Procreate",
                url: "https://www.youtube.com/watch?v=8DIkyEjXp4s&list=PLlpSQCrjuGkoZHyUyO3cNEMyYPNkF0Hne",
                description: {
                    en: "Shortcuts specific to Procreate but also gives general idea on how any digital software should be manipulated.",
                    fr: "Des raccourcis propres à Procreate, mais aussi une idée générale de la façon de manier n'importe quel logiciel de dessin.",
                },
            },
            {
                title: "Rakurri",
                url: "https://www.youtube.com/@Rakurri",
                description: {
                    en: "Krita tutorials! They are rare! Krita is an open source and free alternative to Photoshop. It does everything Photoshop does.",
                    fr: "Des tutos Krita ! C'est rare ! Krita est une alternative libre et gratuite à Photoshop. Il fait tout ce que fait Photoshop.",
                },
            },
            {
                title: "DucThang Ds",
                url: "https://www.youtube.com/@DucThangDs1998/shorts",
                description: {
                    en: "Don't use Photoshop. Use Krita. But the tutorials are good...",
                    fr: "N'utilise pas Photoshop. Utilise Krita. Mais les tutos sont bons…",
                },
            },
        ],
    },
    {
        title: { en: "How to Graphic Design", fr: "Apprendre le graphisme" },
        items: [
            {
                title: "elliotisacoolguy",
                url: "https://www.youtube.com/@elliotisacoolguyTV",
                description: { en: "Cool guy.", fr: "Un type sympa." },
            },
            {
                title: "why Dropout looks so good - elliotisacoolguy",
                url: "https://www.youtube.com/watch?v=a-eU0BFLyO4",
                description: {
                    en: "Intersection of two of my favorite things on the internet.",
                    fr: "À la croisée de deux de mes choses préférées sur Internet.",
                },
            },
        ],
    },
    {
        title: { en: "How to 3D Modelling", fr: "Apprendre la modélisation 3D" },
        items: [
            {
                title: "Beginner Blender Tutorial (2026)  - Blender Guru",
                url: "https://www.youtube.com/watch?v=z-Xl9tGqH14",
                description: {
                    en: "I mean.. Duh. This is the Hello World for 3D Modelling. Everyone with remote interest for the discipline reveres the Guru.",
                    fr: "Enfin… évidemment. C'est le « Hello World » de la modélisation 3D. Quiconque s'intéresse un tant soit peu à la discipline vénère le Gourou.",
                },
            },
            {
                title: "Connect 3D Printed Parts | Design for Mass Production 3D Printing - Slant 3D",
                url: "https://www.youtube.com/watch?v=djm5tCFn9S0",
                description: {
                    en: "Seems niche but actually incredibly useful.",
                    fr: "Ça a l'air pointu, mais c'est en fait incroyablement utile.",
                },
            },
            {
                title: "How to Design a Print with Perfect Tolerance EVERY Time - Slant 3D",
                url: "https://www.youtube.com/watch?v=XKrDUnZCmQQ",
                description: {
                    en: "Seems niche but actually incredibly useful as well.",
                    fr: "Ça a l'air pointu, mais c'est aussi incroyablement utile.",
                },
            },
        ],
    },
    {
        title: { en: "How to 3D Printing", fr: "Apprendre l'impression 3D" },
        items: [
            {
                title: "Factorian Design",
                url: "https://www.youtube.com/@Factorian_Designs",
                description: {
                    en: "All his videos are very important to watch. Gives you a deep understanding of a slicer. Don't mock his accent like the stupid people in the comments. The master deserves better.",
                    fr: "Toutes ses vidéos sont à voir. Elles donnent une compréhension profonde d'un slicer. Ne te moque pas de son accent comme les idiots dans les commentaires. Le maître mérite mieux.",
                },
            },
        ],
    },
    {
        title: { en: "How to DIY", fr: "Apprendre à bricoler" },
        items: [
            {
                title: "Stuff Madde Here",
                url: "https://www.youtube.com/@StuffMadeHere",
                description: {
                    en: "Every video is excellent. Guy is no joke. He really is incredible at Math, Computer Science, Physics, Engineering and basically everything techy. Projects are fun and entertaining to follow.",
                    fr: "Chaque vidéo est excellente. Ce type ne rigole pas. Il est vraiment incroyable en maths, en informatique, en physique, en ingénierie et en gros dans tout ce qui est technique. Ses projets sont amusants et divertissants à suivre.",
                },
            },
            {
                title: "I did a thing",
                url: "https://www.youtube.com/@Ididathing",
                description: {
                    en: "Stuff Made Here's chaotic sibling: dumb and incredibly dangerous. I am amazed he is not dead yet.",
                    fr: "Le frère chaotique de Stuff Made Here : idiot et incroyablement dangereux. Je suis épaté qu'il soit encore en vie.",
                },
            },
            {
                title: "HTX Studio",
                url: "https://www.youtube.com/@HTXStudio",
                description: {
                    en: "Brilliant but I'm not sure about the company's ethics.",
                    fr: "Brillant, mais je ne suis pas sûr de l'éthique de l'entreprise.",
                },
            },
        ],
    },
    {
        title: { en: "How to Build a PC", fr: "Apprendre à monter un PC" },
        items: [
            {
                title: "I built the PC I could not buy - Christian Selig",
                url: "https://www.youtube.com/watch?v=7HgAN5cEmkk",
                description: { en: "He does everything himself", fr: "Il fait tout lui-même" },
            },
            {
                title: "Gamers Nexus",
                url: "https://www.youtube.com/@GamersNexus",
                description: {
                    en: "Good tests on trending components. I like his politics as well. English barely understandable.",
                    fr: "De bons tests des composants du moment. J'aime bien ses idées politiques aussi. Un anglais à peine compréhensible.",
                },
            },
            {
                title: "MrMattLee",
                url: "https://www.youtube.com/@Mr_Matt_Lee",
                description: { en: "Just cool and cinematic.", fr: "Simplement cool et cinématographique." },
            },
        ],
    },
    {
        title: { en: "How to Selfhost", fr: "Apprendre l'auto-hébergement" },
        items: [
            {
                title: "Pro Tech Show",
                url: "https://www.youtube.com/@ProTechShow",
                description: {
                    en: "I just remember he's good. Not much more. I think I watched stuff on selfhosting and password managers.",
                    fr: "Je me souviens juste qu'il est bon. Pas grand-chose de plus. Je crois avoir regardé des vidéos sur l'auto-hébergement et les gestionnaires de mots de passe.",
                },
            },
        ],
    },
    {
        title: { en: "How to Linux", fr: "Apprendre Linux" },
        items: [
            {
                title: "diinki",
                url: "https://www.youtube.com/@diinkikot",
                description: { en: "Setup and theming. Elegant", fr: "Configuration et thèmes. Élégant" },
            },
            {
                title: "I installed Linux (so should you) - Pewdiepie",
                url: "https://www.youtube.com/watch?v=pVI_smLgTY0",
                description: {
                    en: "This guy actually is a great tech youtuber",
                    fr: "Ce type est vraiment un excellent youtubeur tech",
                },
            },
            {
                title: "Linux user Tries MacOS™ - diinki",
                url: "https://www.youtube.com/watch?v=ij4MfN6H_3U",
                description: { en: "How to Linux within MacOS.", fr: "Comment faire du Linux dans macOS." },
            },
        ],
    },
    {
        title: { en: "How to Code", fr: "Apprendre à coder" },
        items: [
            {
                title: "C++ Series - The Cherno",
                url: "https://www.youtube.com/watch?v=18c3MTX0PK0&list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb&pp=0gcJCQ4DOCosWNin",
                description: {
                    en: "There is no better class online.",
                    fr: "Il n'existe pas de meilleur cours en ligne.",
                },
            },
            {
                title: "Fireship",
                url: "https://www.youtube.com/@Fireship",
                description: {
                    en: "Great for tech news as well. Funniest guy on the planet. Front end specialist.",
                    fr: "Génial aussi pour l'actu tech. Le type le plus drôle de la planète. Spécialiste du front-end.",
                },
            },
        ],
    },
    {
        title: { en: "How to Computer Graphics", fr: "Apprendre l'informatique graphique" },
        items: [
            {
                title: "ACMSIGGRAPH",
                url: "https://www.youtube.com/@ACMSIGGRAPH",
                description: {
                    en: "The official Siggraph channel. Siggraph is an international conference for Computer Graphics papers.",
                    fr: "La chaîne officielle du Siggraph. Le Siggraph est une conférence internationale de publications en informatique graphique.",
                },
            },
            {
                title: "Two Minute Papers",
                url: "https://www.youtube.com/@TwoMinutePapers",
                description: {
                    en: "Overview of latest significant Computer Graphics papers. Nowadays mostly AI unfortunately. Funny guy.",
                    fr: "Un tour d'horizon des dernières publications marquantes en informatique graphique. Surtout de l'IA aujourd'hui, malheureusement. Un type drôle.",
                },
            },
            {
                title: "Keenan Crane",
                url: "https://www.youtube.com/@keenancrane",
                description: {
                    en: "Youtube channel of a US teacher. Crazy work on repulsive shapes.",
                    fr: "La chaîne YouTube d'un enseignant américain. Un travail fou sur les formes répulsives.",
                },
            },
            {
                title: "Freya Holmér",
                url: "https://www.youtube.com/@acegikmo",
                description: {
                    en: "Very simple stuff but I like her.",
                    fr: "Des choses très simples, mais je l'aime bien.",
                },
            },
            {
                title: "How Pixar Changed 3D Animation With Every Movie (Part 1, 'Toy Story' to 'Cars 2') | Movies Insider",
                url: "https://www.youtube.com/watch?v=n1xAYik1g-w",
                description: {
                    en: "Careful: 2 videos! More on the history of Computer Graphics rather than Computer Graphics directly.",
                    fr: "Attention : 2 vidéos ! Plutôt sur l'histoire de l'informatique graphique que sur l'informatique graphique elle-même.",
                },
            },
            {
                title: "How I made a 3D Level in a 2D Game - Spu7Nix",
                url: "https://www.youtube.com/watch?v=Qvlb-Yo6Rqo",
                description: {
                    en: "Fascinated by the monstrous investment for such a niche task.",
                    fr: "Passionné par l'investissement monstrueux pour une tâche aussi niche.",
                },
            },
        ],
    },
    {
        title: { en: "How to VFX", fr: "Apprendre les effets spéciaux" },
        items: [
            {
                title: "Corridor Crew",
                url: "https://www.youtube.com/@CorridorCrew",
                description: {
                    en: "Artistic side of Computer Graphics: creating Visual Effects for the cinema. Some engineering as well.",
                    fr: "Le côté artistique de l'informatique graphique : créer des effets spéciaux pour le cinéma. Un peu d'ingénierie aussi.",
                },
            },
        ],
    },
    {
        title: { en: "How to Web develop", fr: "Apprendre le développement web" },
        items: [
            {
                title: "how i made my website - shar",
                url: "https://www.youtube.com/watch?v=_tWh4cYCTv0&pp=ygUObWFrZSBhIHdlYnNpdGU%3D",
                description: { en: "Mostly conception ideas.", fr: "Surtout des idées de conception." },
            },
            {
                title: "Steve Builds Websites",
                url: "https://www.youtube.com/@stevebuildswebsites",
                description: {
                    en: "First result on YouTube page I know, but well deserved. Very good for simple solutions without any coding. Good informative rankings of website frameworks and generators.",
                    fr: "Premier résultat sur YouTube, je sais, mais c'est mérité. Très bien pour des solutions simples sans coder. De bons classements instructifs des frameworks et générateurs de sites web.",
                },
            },
        ],
    },
    {
        title: { en: "How to Degoogle", fr: "Apprendre à se passer de Google" },
        items: [
            {
                title: "I'm DONE with Google - Pewdiepie",
                url: "https://www.youtube.com/watch?v=u_Lxkt50xOg",
                description: {
                    en: "Something everyone should do. It is hard. It takes time. But it is for the better.",
                    fr: "Quelque chose que tout le monde devrait faire. C'est dur. Ça prend du temps. Mais c'est pour le mieux.",
                },
            },
        ],
    },
    {
        title: { en: "How to Math", fr: "Apprendre les maths" },
        items: [
            {
                title: "Numberphile",
                url: "https://www.youtube.com/@numberphile",
                description: { en: "Not academic. Deeply engaging.", fr: "Pas académique. Profondément captivant." },
            },
            {
                title: "3blue1brown",
                url: "https://www.youtube.com/@3blue1brown",
                description: {
                    en: "I would have never truly understood deep learning without his series on the subject. I come back to it regularly. Very intelligent visuals. Terrifying subjects are deconstructed to make you understand anything.",
                    fr: "Je n'aurais jamais vraiment compris l'apprentissage profond sans sa série sur le sujet. J'y reviens régulièrement. Des visuels très intelligents. Des sujets terrifiants sont décortiqués pour te faire comprendre n'importe quoi.",
                },
            },
        ],
    },
    {
        title: { en: "How to Zoology", fr: "Apprendre la zoologie" },
        items: [
            {
                title: "TierZoo",
                url: "https://www.youtube.com/@TierZoo",
                description: {
                    en: "I love him. Compares biology and evolution to builds in video games. Don't have to know anything about video games to watch though.",
                    fr: "Je l'adore. Il compare la biologie et l'évolution à des builds de jeux vidéo. Pas besoin de rien connaître aux jeux vidéo pour regarder, cela dit.",
                },
            },
            {
                title: "Faune Cool",
                url: "https://www.youtube.com/@FauneCool",
                description: {
                    en: "Should post moooore. Fellow leftist. French though",
                    fr: "Devrait poster plus souvent. Un camarade de gauche. En français, par contre",
                },
            },
        ],
    },
    {
        title: { en: "How to Science", fr: "Apprendre les sciences" },
        items: [
            {
                title: "Veritasium",
                url: "https://www.youtube.com/@veritasium",
                description: {
                    en: "Watch the old stuff, when he was still one guy on his channel.",
                    fr: "Regarde les anciennes vidéos, quand il était encore seul sur sa chaîne.",
                },
            },
            {
                title: "Rabbit Hole",
                url: "https://www.youtube.com/@rabbithole",
                description: {
                    en: "Used to work on Veritasium videos. First four videos are excellent. Don't watch the one about four-leaf clovers.",
                    fr: "Il a travaillé sur les vidéos de Veritasium. Les quatre premières vidéos sont excellentes. Ne regarde pas celle sur les trèfles à quatre feuilles.",
                },
            },
        ],
    },
    {
        title: { en: "How to History", fr: "Apprendre l'histoire" },
        items: [
            {
                title: "History of the entire world, I guess - billwurtz",
                url: "https://www.youtube.com/watch?v=xuCn8ux2gbs",
                description: { en: "Best video on youtube. Period.", fr: "La meilleure vidéo de YouTube. Point." },
            },
        ],
    },
    {
        title: { en: "How to Note Taking", fr: "Apprendre la prise de notes" },
        items: [
            {
                title: "How to Become an Expert with Obsidian (FULL GUIDE) - Odysseas",
                url: "https://www.youtube.com/watch?v=IMfz9E7g-Hk",
                description: {
                    en: "Mostly inspirational. Don't watch everything.",
                    fr: "Surtout pour l'inspiration. Ne regarde pas tout.",
                },
            },
        ],
    },
    {
        title: { en: "How to Learn a new language", fr: "Apprendre une nouvelle langue" },
        items: [
            {
                title: "Livakivi",
                url: "https://www.youtube.com/@Livakivi",
                description: {
                    en: "Look for the videos in which he shares his Japanese learning journey.",
                    fr: "Cherche les vidéos où il raconte son apprentissage du japonais.",
                },
            },
        ],
    },
    {
        title: { en: "How to Sing", fr: "Apprendre à chanter" },
        items: [
            {
                title: "Sing Powerfully Without Straining - Placement, Resonance, and The Mask of Singing",
                url: "https://www.youtube.com/watch?v=MDYdsJyPkEs&t=5s",
                description: {
                    en: "I am new to singing so I don't have much knowledge in tutorials yet, but this one was interesting.",
                    fr: "Je débute en chant, donc je ne connais pas encore beaucoup de tutos, mais celui-ci était intéressant.",
                },
            },
        ],
    },
    {
        title: { en: "How to Produce Music", fr: "Apprendre la production musicale" },
        items: [
            {
                title: "Music & Sound production on Linux - diinki",
                url: "https://www.youtube.com/watch?v=2iRbyVo6mg0",
                description: {
                    en: "This is what I will come back to to start producing.",
                    fr: "C'est vers ça que je reviendrai pour commencer à produire.",
                },
            },
        ],
    },
    {
        title: { en: "How to Origami", fr: "Apprendre l'origami" },
        items: [
            {
                title: "Origami with Jo Nakashima",
                url: "https://www.youtube.com/@jonakashima",
                description: {
                    en: "Very advanced. I think he is a creator.",
                    fr: "Très avancé. Je crois que c'est un créateur.",
                },
            },
        ],
    },
    {
        title: { en: "How to Game Design", fr: "Apprendre le game design" },
        items: [
            {
                title: "Every Game Genre. Ever - Game Maker's Toolkit",
                url: "https://www.youtube.com/watch?v=Dbgdi7BzMR0",
                description: {
                    en: "An inspiring 2 hour watch. Simply learning about game genres give plenty of ideas for your own conception.",
                    fr: "Deux heures inspirantes. Rien que découvrir les genres de jeux donne plein d'idées pour tes propres créations.",
                },
            },
            {
                title: "Game Maker's Toolkit",
                url: "https://www.youtube.com/@GMTK",
                description: {
                    en: "Deserves a spot. I don't watch him much but he is hard-working and well informed.",
                    fr: "Mérite sa place. Je ne le regarde pas beaucoup, mais il est travailleur et bien informé.",
                },
            },
        ],
    },
    {
        title: { en: "How to Game", fr: "Apprendre à jouer" },
        items: [
            {
                title: "16 Y/O UNDERDOG vs. 7-TIME CHAMP - Classic Tetris World Championship 2018 Final Round - Classic Tetris",
                url: "https://www.youtube.com/watch?v=L_UPHsGR6fM",
                description: {
                    en: "History. I watched it when it was released. RIP Jonas you were a good one.",
                    fr: "Historique. Je l'ai regardée à sa sortie. Repose en paix Jonas, tu étais quelqu'un de bien.",
                },
            },
            {
                title: "Balatro by adef in 1:04:49 - Summer Games Done Quick 2026 - Games Done Quick",
                url: "https://www.youtube.com/watch?v=A7Go7IXlYLg",
                description: {
                    en: "Cinema. I was on the edge of my seat. Need to know the game pretty well to fully appreciate the video.",
                    fr: "Du cinéma. J'étais au bord de mon siège. Il faut bien connaître le jeu pour apprécier pleinement la vidéo.",
                },
            },
            {
                title: "Silksong Any% 47:52 | First 47! - Nebula",
                url: "https://www.youtube.com/watch?v=5T5XOVVigO8",
                description: {
                    en: "Any Silksong any% speedrun will do. Most talented person on the game today (end of 2026).",
                    fr: "N'importe quel speedrun any% de Silksong fera l'affaire. La personne la plus douée sur le jeu aujourd'hui (fin 2026).",
                },
            },
            {
                title: "SMO Hide and Seek - cjya",
                url: "https://www.youtube.com/watch?v=SStdceQJKzU&list=PLZvsmoFpb4hztplxk0jP5AAHxr9aDkV-m",
                description: {
                    en: "Fun. Love them. cjya is a nice guy.",
                    fr: "Drôle. Je les adore. cjya est un chic type.",
                },
            },
            {
                title: "Coach by Lege: Tours 1 à 5: Bien commencer sa partie - Lege",
                url: "https://www.youtube.com/watch?v=BBG32QxOd8E&list=PLf0m3hwAMY7aD9PglZyFDYV_fGt74IOd-",
                description: {
                    en: "How to play civ6 optimally. French though.",
                    fr: "Comment jouer à Civ 6 de façon optimale. En français, par contre.",
                },
            },
            {
                title: "Team Darkside",
                url: "https://www.youtube.com/@TeamDarkside",
                description: {
                    en: "Cool Monster Hunter stuff. Don't mind the edgy name.",
                    fr: "Du contenu Monster Hunter sympa. Ne fais pas attention au nom un peu edgy.",
                },
            },
        ],
    },
    {
        title: { en: "How to Cinema", fr: "Apprendre le cinéma" },
        items: [
            {
                title: "It’s Just Cinema",
                url: "https://www.youtube.com/@itsjustcinema",
                description: { en: "I recommend what he recommends.", fr: "Je recommande ce qu'il recommande." },
            },
            {
                title: "Thomas Flight",
                url: "https://www.youtube.com/@ThomasFlight/",
                description: {
                    en: "Restricts himself too much to popular movies, but analysis is still good.",
                    fr: "Il se limite trop aux films populaires, mais ses analyses restent bonnes.",
                },
            },
        ],
    },
    {
        title: { en: "How to Laugh", fr: "Apprendre à rire" },
        items: [
            {
                title: "CheeseParade",
                url: "https://www.youtube.com/@CheeseParade",
                description: { en: "smart", fr: "malin" },
            },
            {
                title: "Legends of Avantris",
                url: "https://www.youtube.com/@LegendsofAvantris/shorts",
                description: { en: "Look for Bitsy and Chuckles", fr: "Cherche Bitsy et Chuckles" },
            },
            {
                title: "Game Changer",
                url: "https://www.youtube.com/@GameChangerShorts",
                description: {
                    en: "Improv makes me laugh. They are good at it.",
                    fr: "L'impro me fait rire. Ils sont doués.",
                },
            },
            {
                title: "Fireship",
                url: "https://www.youtube.com/@Fireship",
                description: { en: "Relevant and sarcastic -> haha", fr: "Pertinent et sarcastique -> haha" },
            },
            {
                title: "Luis",
                url: "https://www.youtube.com/@LuisLuis",
                description: {
                    en: "Got to love the croissant ranking in Paris during riots",
                    fr: "Impossible de ne pas aimer le classement des croissants à Paris pendant les émeutes",
                },
            },
            {
                title: "Something About Zelda Breath of the Wild ANIMATED SPEEDRUN ❤️❤️🖤 ANY% 04:11 (no amiibo) WR - TerminalMontage",
                url: "https://www.youtube.com/watch?v=1or3YILu28M&pp=ygUadGVybWluYWxtb250YWdlIHplbGRhIGJvdHc%3D",
                description: {
                    en: "Niche jokes about video game speedrunning",
                    fr: "Des blagues de niche sur le speedrun de jeux vidéo",
                },
            },
        ],
    },
];
