export type YoutubeItem = {
    title: string; // titre de la vidéo ou de la chaîne
    url: string;
    description: string;
    thumbnail?: string;
};

export type YoutubeSection = {
    title: string;
    items: YoutubeItem[];
};

export const YOUTUBE_SECTIONS: YoutubeSection[] = [
    {
        title: "How to Computer Graphics",
        items: [
            {
                title: "ACMSIGGRAPH",
                url: "https://www.youtube.com/@ACMSIGGRAPH",
                description: "The official Siggraph channel. Siggraph is an international conference for Computer Graphics papers.",
            },
            {
                title: "Two Minute Papers",
                url: "https://www.youtube.com/@TwoMinutePapers",
                description: "Overview of latest significant Computer Graphics papers. Nowadays mostly AI unfortunately. Funny guy.",
            },
            {
                title: "Keenan Crane",
                url: "https://www.youtube.com/@keenancrane",
                description: "Youtube channel of a US teacher. Crazy work on repulsive shapes.",
            },
            {
                title: "Freya Holmér",
                url: "https://www.youtube.com/@acegikmo",
                description: "Very simple stuff but I like her.",
            },
        ],
    },
    {
        title: "How to Build a PC",
        items: [
            {
                title: "I built the PC I could not buy - Christian Selig",
                url: "https://www.youtube.com/watch?v=7HgAN5cEmkk",
                description: "He does everything himself",
            },
            {
                title: "Gamers Nexus",
                url: "https://www.youtube.com/@GamersNexus",
                description: "Good tests on trending components. I like his politics as well. English barely understandable.",
            },
            {
                title: "MrMattLee",
                url: "https://www.youtube.com/@Mr_Matt_Lee",
                description: "Just cool and cinematic.",
            },
        ],
    },
    {
        title: "How to Tech",
        items: [
            {
                title: "Pro Tech Show",
                url: "https://www.youtube.com/@ProTechShow",
                description: "I just remember he's good. Not much more. I think I watched stuff on selfhosting and password managers.",
            },
        ],
    },
    {
        title: "How to Code",
        items: [
            {
                title: "C++ Series - The Cherno",
                url: "https://www.youtube.com/watch?v=18c3MTX0PK0&list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb&pp=0gcJCQ4DOCosWNin",
                description: "There is no better class online.",
            },
            {
                title: "Fireship",
                url: "https://www.youtube.com/@Fireship",
                description: "Great for tech news as well. Funniest guy on the planet. Front end specialist.",
            },
        ],
    },
    {
        title: "How to Linux",
        items: [
            {
                title: "diinki",
                url: "https://www.youtube.com/@diinkikot",
                description: "Setup and theming. Elegant",
            },
            {
                title: "I installed Linux (so should you) - Pewdiepie",
                url: "https://www.youtube.com/watch?v=pVI_smLgTY0",
                description: "This guy actually is a great tech youtuber",
            },
        ],
    },
    {
        title: "How to Degoogle",
        items: [
            {
                title: "I'm DONE with Google - Pewdiepie",
                url: "https://www.youtube.com/watch?v=u_Lxkt50xOg",
                description: "Something everyone should do. It is hard. It takes time. But it is for the better.",
            },
        ],
    },
    {
        title: "How to Draw",
        items: [
            {
                title: "Design Theory - Sinix Design",
                url: "https://www.youtube.com/watch?v=uEgCsWyOyCo&list=PLflflDShjUKF_7w4YTmpjGO27iuyHDpDu&pp=0gcJCQ4DOCosWNin",
                description: "Macro thinking about your drawing.",
            },
            {
                title: "Anatomy Quick Tips - Sinix Design",
                url: "https://www.youtube.com/watch?v=IVbqoy_JEV0&list=PLflflDShjUKH4EfZyf0vuKEuqeqvlV0Qd",
                description: "Must watch",
            },
            {
                title: "Paintover Pals - Sinix Design",
                url: "https://www.youtube.com/watch?v=WTh4CdJpJZ0&list=PLflflDShjUKG_c6Ty5g8U4-fVmWBQQNS9&pp=0gcJCbwFa94AFGB0",
                description: "Give many ideas on how to approach a design and of course how to fix mistakes.",
            },
            {
                title: "Proko",
                url: "https://www.youtube.com/@ProkoTV",
                description: "Not Sinix but still good. Look for the video on lighting. Group of many different artists with different styles and points of view.",
            },
            {
                title: "blfsloth",
                url: "https://www.youtube.com/@blfsloth",
                description: "Mostly sexy girls I'm afraid, but good process and rendering.",
            },
            {
                title: "WLOP",
                url: "https://www.youtube.com/@WLOP",
                description: "Cute girls again. Sorry but digital artists tend to do this.",
            },
            {
                title: "Andrew Cadima",
                url: "https://www.youtube.com/@andrewcadima",
                description: "Crazy understanding of values.",
            },
            {
                title: "J'ai essayé de créer un manga - Pewdiepie",
                url: "https://www.youtube.com/watch?v=iRRpvuMG7AM",
                description: "I just like pewdiepie ok sue me. Still it is valuable to follow the process of a beginner. He knows how to share his journey.",
            },
            {
                title: "Jeff Haines",
                url: "https://www.youtube.com/@JeffHainesArt",
                description: "Good charcoal mm yummy.",
            },
            {
                title: "Sinx Design",
                url: "https://www.youtube.com/@sinixdesign",
                description: "Just wanted to put Sinix again.",
            },
        ],
    },
    {
        title: "How to Web develop",
        items: [
            {
                title: "how i made my website - shar",
                url: "https://www.youtube.com/watch?v=_tWh4cYCTv0&pp=ygUObWFrZSBhIHdlYnNpdGU%3D",
                description: "Mostly conception ideas.",
            },
            {
                title: "Steve Builds Websites",
                url: "https://www.youtube.com/@stevebuildswebsites",
                description: "First result on YouTube page I know, but well deserved. Very good for simple solutions without any coding. Good informative rankings of website frameworks and generators.",
            },
        ],
    },
    {
        title: "How to Digital paint",
        items: [
            {
                title: "how to choose a drawing tablet  - shar",
                url: "https://www.youtube.com/watch?v=-gEh8n6dmjg",
                description: "I do not recommend it if you want to decide which brand to pick. I recommend this video if you want to find out which type of tablet is best for you: pen tablet, pen display, or standalone.",
            },
            {
                title: "Brad Colbow",
                url: "https://www.youtube.com/@thebradcolbow/featured",
                description: "Another link to choose the best tablet. Comprehensive and always up to date. I encourage to explore his website as well.",
            },
            {
                title: "Learn to Procreate - Procreate",
                url: "https://www.youtube.com/watch?v=8DIkyEjXp4s&list=PLlpSQCrjuGkoZHyUyO3cNEMyYPNkF0Hne",
                description: "Shortcuts specific to Procreate but also gives general idea on how any digital software should be manipulated.",
            },
            {
                title: "Rakurri",
                url: "https://www.youtube.com/@Rakurri",
                description: "Krita tutorials! They are rare! Krita is an open source and free alternative to photoshop. I does everything photoshop does.",
            },
            {
                title: "DucThang Ds",
                url: "https://www.youtube.com/@DucThangDs1998/shorts",
                description: "Don't use Photoshop. Use Krita. But the tutorials are good...",
            },
        ],
    },
    {
        title: "How to Graphic Design",
        items: [
            {
                title: "elliotisacoolguy",
                url: "https://www.youtube.com/@elliotisacoolguyTV",
                description: "Cool guy.",
            },
        ],
    },
    {
        title: "How to 3D Modelling",
        items: [
            {
                title: "Beginner Blender Tutorial (2026)  - Blender Guru",
                url: "https://www.youtube.com/watch?v=z-Xl9tGqH14",
                description: "I mean.. Duh. This is the Hello World for 3D Modelling. Everyone with remote interest for the discipline reveres the Guru.",
            },
        ],
    },
    {
        title: "How to 3D Printing",
        items: [
            {
                title: "Factorian Design",
                url: "https://www.youtube.com/@Factorian_Designs",
                description: "All his videos are very important to watch. Gives you a deep understanding of a slicer. Don;t mock his accent like the stupid people in the comments. The master deserves better.",
            },
        ],
    },
    {
        title: "How to Math",
        items: [
            {
                title: "Numberphile",
                url: "https://www.youtube.com/@numberphile",
                description: "Not academic. Deeply engaging.",
            },
            {
                title: "3blue1brown",
                url: "https://www.youtube.com/@3blue1brown",
                description: "I would have never truly understood deep learning without his series on the subject. I come back to it regurlarly. Very intelligent visuals. Terrifying subjects are deconstructed to make you understand anything.",
            },
        ],
    },
    {
        title: "How to Science",
        items: [
            {
                title: "Veritasium",
                url: "https://www.youtube.com/@veritasium",
                description: "Watch the old stuff, when he was still one guy on his channel.",
            },
            {
                title: "Rabbit Hole",
                url: "https://www.youtube.com/@rabbithole",
                description: "Used to work on Veritasium videos. First four videos are excellent. Don't watch the one about four-leaf clovers.",
            },
        ],
    },
    {
        title: "How to Learn a new language",
        items: [
            {
                title: "Livakivi",
                url: "https://www.youtube.com/@Livakivi",
                description: "Look for the videos in which he shares his Japnese learning journey.",
            },
        ],
    },
    {
        title: "How to Note Taking",
        items: [
            {
                title: "How to Become an Expert with Obsidian (FULL GUIDE) - Odysseas",
                url: "https://www.youtube.com/watch?v=IMfz9E7g-Hk",
                description: "Mostly inspirational. Don't watch everything.",
            },
        ],
    },
    {
        title: "How to Cinema",
        items: [
            {
                title: "It’s Just Cinema",
                url: "https://www.youtube.com/@itsjustcinema",
                description: "I recommend what he recommends.",
            },
            {
                title: "Thomas Flight",
                url: "https://www.youtube.com/@ThomasFlight/",
                description: "Restricts himself too much to popular movies, but analysis is still good.",
            },
        ],
    },
    {
        title: "How to History",
        items: [
            {
                title: "History of the entire world, I guess - billwurtz",
                url: "https://www.youtube.com/watch?v=xuCn8ux2gbs",
                description: "Best video on youtube. Period.",
            },
        ],
    },
    {
        title: "How to Zoology",
        items: [
            {
                title: "TierZoo",
                url: "https://www.youtube.com/@TierZoo",
                description: "I love him. Compares biology and evolution to builds in video games. Don't have to know anything about video games to watch though.",
            },
        ],
    },
    {
        title: "How to Origami",
        items: [
            {
                title: "Origami with Jo Nakashima",
                url: "https://www.youtube.com/@jonakashima",
                description: "Very advanced. I think he is a creator.",
            },
        ],
    },
    {
        title: "How to Laugh",
        items: [
            {
                title: "CheeseParade",
                url: "https://www.youtube.com/@CheeseParade",
                description: "smart",
            },
            {
                title: "Legends of Avantris",
                url: "https://www.youtube.com/@LegendsofAvantris/shorts",
                description: "Look for Bitsy and Chuckles",
            },
            {
                title: "Game Changer",
                url: "https://www.youtube.com/@GameChangerShorts",
                description: "Improv makes me laugh. They are good at it.",
            },
            {
                title: "Fireship",
                url: "https://www.youtube.com/@Fireship",
                description: "Relevant and sarcastic -> haha",
            },
            {
                title: "Luis",
                url: "https://www.youtube.com/@LuisLuis",
                description: "Got to love the croissant ranking in Paris during riots",
            },
            {
                title: "Something About Zelda Breath of the Wild ANIMATED SPEEDRUN ❤️❤️🖤 ANY% 04:11 (no amiibo) WR - TerminalMontage",
                url: "https://www.youtube.com/watch?v=1or3YILu28M&pp=ygUadGVybWluYWxtb250YWdlIHplbGRhIGJvdHc%3D",
                description: "Niche jokes about video game speedrunning",
            },
        ],
    },
];