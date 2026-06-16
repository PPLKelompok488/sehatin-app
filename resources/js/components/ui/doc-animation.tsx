import React, { useState, useEffect } from 'react';

interface DocAnimationProps {
    className?: string;
    style?: React.CSSProperties;
    frameCount?: number;
    fps?: number;
}

export function DocAnimation({ className, style, frameCount = 53, fps = 24 }: DocAnimationProps) {
    const [currentFrame, setCurrentFrame] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    // Preload images
    useEffect(() => {
        let loadedCount = 0;
        const images: HTMLImageElement[] = [];
        
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = `/images/doc_anim_comp/doc_anim_gr${i.toString().padStart(5, '0')}.png`;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === frameCount) {
                    setImagesLoaded(true);
                }
            };
            images.push(img);
        }

        // Fallback in case some images fail to load or take too long
        const timeout = setTimeout(() => setImagesLoaded(true), 3000);
        return () => clearTimeout(timeout);
    }, [frameCount]);

    useEffect(() => {
        if (!imagesLoaded) return;

        let timeoutId: NodeJS.Timeout;
        const play = () => {
            setCurrentFrame((prev) => (prev + 1) % frameCount);
            timeoutId = setTimeout(play, 1000 / fps);
        };
        
        play();
        
        return () => clearTimeout(timeoutId);
    }, [frameCount, fps, imagesLoaded]);

    const imageSrc = `/images/doc_anim_comp/doc_anim_gr${currentFrame.toString().padStart(5, '0')}.png`;

    return (
        <img
            src={imageSrc}
            alt="Doctor Animation"
            className={className}
            style={{ 
                ...style, 
                opacity: imagesLoaded ? (style?.opacity ?? 1) : 0,
                transition: 'opacity 0.3s ease-in'
            }}
        />
    );
}
