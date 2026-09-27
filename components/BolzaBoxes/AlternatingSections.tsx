"use client";

import { SECTIONS } from "@/lib/BolzaBoxes/section";
import { useVersion } from "@/lib/BolzaBoxes/VersionContext";

export default function AlternatingSections() {
    const { version } = useVersion();

    return (
        <div className="flex flex-col gap-6 md:gap-8 px-6 md:px-10 py-6 md:py-8">
            {SECTIONS.map((section, i) => {
                const reversed = i % 2 === 1;
                const image =
                    version === "french" ? section.imageFrench : section.imageInternational;

                return (
                    <div
                        key={i}
                        className={`flex flex-col md:flex-row ${
                            reversed ? "md:flex-row-reverse" : ""
                        } items-center bg-[#ECE5D8] rounded-3xl overflow-hidden`}
                    >
                        <div className="w-full md:w-1/4 aspect-square relative shrink-0">
                            <img
                                src={image}
                                alt={section.imageAlt}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>

                        <div className="w-full md:w-3/4 flex flex-col justify-center px-8 md:px-16 py-10">
                            <h2
                                className="text-[#3a352c] mb-4"
                                style={{
                                    fontFamily: "var(--font-playfair)",
                                    fontWeight: 700,
                                    fontSize: "clamp(1.5rem, 3.2vw, 3rem)",
                                }}
                            >
                                {section.title}
                            </h2>
                            <p
                                className="text-[#3a352c] leading-relaxed"
                                style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.3rem)" }}
                            >
                                {section.text}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}