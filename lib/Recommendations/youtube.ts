export type YoutubeItem = {
    title: string; // titre de la vidéo ou de la chaîne
    url: string;
    description: string;
};

export type YoutubeSection = {
    title: string;
    items: YoutubeItem[];
};

export const YOUTUBE_SECTIONS: YoutubeSection[] = [
    {
        title: "How to C++",
        items: [
            {
                title: "C++ Series - The Cherno",
                url: "https://www.youtube.com/watch?v=18c3MTX0PK0&list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb&pp=0gcJCQ4DOCosWNin",
                description: "In the context of Game Development.",
            },
        ],
    },
    {
        title: "How to Linux",
        items: [
            {
                title: "diinki",
                url: "https://www.youtube.com/@diinkikot",
                description: "Installation and theming. Elegant",
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
                description: "Give many ideas on how to approacha design and of course how to fix mistakes.",
            },
        ],
    },
    {
        title: "How to Web develop",
        items: [
            {
                title: "how i made my website - shar",
                url: "https://www.youtube.com/watch?v=_tWh4cYCTv0&pp=ygUObWFrZSBhIHdlYnNpdGU%3D",
                description: "Mostly desing ideas.",
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
                description: "I do not recommend if you want to decide which brand to pick. I recommend this video if you want to find out which type of tablet is best for you: pen tablet, pen display, or standalone.",
            },
            {
                title: "Brad Colbow",
                url: "https://www.youtube.com/@thebradcolbow/featured",
                description: "Another link to choose the best tablet. Comprehensive and always up to date. Explore the website as well.",
            },
        ],
    },
];