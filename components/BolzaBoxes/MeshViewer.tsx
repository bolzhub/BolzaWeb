"use client";

import { useEffect } from "react";

declare module "react" {
    namespace JSX {
        interface IntrinsicElements {
            "model-viewer": React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement> & {
                    src?: string;
                    alt?: string;
                    "camera-controls"?: boolean;
                    "auto-rotate"?: boolean;
                    exposure?: string;
                },
                HTMLElement
            >;
        }
    }
}

export default function MeshViewer({ src }: { src: string }) {
    useEffect(() => {
        if (customElements.get("model-viewer")) return;
        const script = document.createElement("script");
        script.type = "module";
        script.src =
            "https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js";
        document.head.appendChild(script);
    }, []);

    return (
        <model-viewer
            src={src}
            alt="3D model"
            camera-controls
            style={{ width: "100%", height: "100%" }}
        />
    );
}