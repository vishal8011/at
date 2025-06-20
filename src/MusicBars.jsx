// components/MusicBars.jsx
import React, { useEffect } from "react";

const MusicBars = () => {
    useEffect(() => {
        const style = document.createElement("style");
        style.innerHTML = `
            .music-bars {
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 50vh; /* Half of the viewport height */
                display: flex;
                justify-content: center;
                align-items: end;
                gap: 8px;
                z-index: 0;
                pointer-events: none;
                overflow: hidden;
            }

            .bar {
                width: 10px;
                background: linear-gradient(180deg, #00ffc3, #0077ff);
                animation: bounce 1.2s infinite ease-in-out;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 255, 200, 0.6),
                            0 0 20px rgba(0, 100, 255, 0.3);
                opacity: 0.7;
            }

            ${Array.from({ length: 40 }, (_, i) =>
            `.bar:nth-child(${i + 1}) {
                    animation-delay: ${i * 0.07}s;
                    height: ${30 + (i % 5) * 15}px;
                }`
        ).join("\n")}

            @keyframes bounce {
                0%, 100% {
                    transform: scaleY(1);
                }
                50% {
                    transform: scaleY(2.4);
                }
            }

            @media (max-width: 768px) {
                .bar {
                    width: 5px;
                }
                .music-bars {
                    gap: 4px;
                }
            }
        `;
        document.head.appendChild(style);
    }, []);

    return (
        <div className="music-bars">
            {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="bar"></div>
            ))}
        </div>
    );
};

export default MusicBars;
