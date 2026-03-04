// resources/js/utils/videoThumbnail.js

export function extractVideoThumbnail(file, seekSeconds = 1, quality = 0.82) {
    return new Promise((resolve) => {
        const video     = document.createElement('video');
        const objectUrl = URL.createObjectURL(file);

        video.preload     = 'auto';
        video.muted       = true;
        video.playsInline = true;

        const cleanup = () => {
            URL.revokeObjectURL(objectUrl);
            video.removeAttribute('src');
            video.load();
        };

        const captureFrame = () => {
            // raf x2: first frame schedules the paint, second confirms it's on screen
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    try {
                        const canvas  = document.createElement('canvas');
                        canvas.width  = video.videoWidth  || 1280;
                        canvas.height = video.videoHeight || 720;

                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                        // Detect black frame: sample the centre pixel
                        const centre = ctx.getImageData(
                            Math.floor(canvas.width  / 2),
                            Math.floor(canvas.height / 2),
                            1, 1,
                        ).data;
                        const isBlack = centre[0] < 10 && centre[1] < 10 && centre[2] < 10;

                        if (isBlack && video.duration > seekSeconds + 1) {
                            // First seek landed on a black frame — try a later timestamp
                            video.currentTime = Math.min(seekSeconds + 2, video.duration - 0.1);
                            return; // onseeked will fire again → captureFrame called again
                        }

                        canvas.toBlob(
                            (blob) => { cleanup(); resolve(blob); },
                            'image/jpeg',
                            quality,
                        );
                    } catch {
                        cleanup();
                        resolve(null);
                    }
                });
            });
        };

        video.onerror = () => { cleanup(); resolve(null); };

        video.onloadedmetadata = () => {
            // Clamp seek: never exceed duration, aim for ~10% in
            video.currentTime = Math.min(seekSeconds, video.duration * 0.1, video.duration - 0.1);
        };

        // onseeked may fire multiple times if we retry on black frame
        video.onseeked = captureFrame;

        video.src = objectUrl;
    });
}

export function blobToPreviewUrl(blob) {
    if (!blob) return null;
    return URL.createObjectURL(blob);
}
