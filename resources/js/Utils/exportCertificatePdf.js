/**
 * Captures a DOM node and exports it as a landscape A4 PDF.
 *
 * Key fixes vs the original:
 *  1. Uses `animation-delay: -99999ms` instead of `animation-duration: 0.001ms`.
 *     A huge negative delay jumps every animation to its fully-completed (final)
 *     state regardless of the original duration/delay, so all elements appear
 *     at full opacity with their final transforms.
 *  2. Uses html2canvas's `onclone` callback to apply the same freeze inside the
 *     cloned document that html2canvas creates internally.  Without this the
 *     clone restarts every animation from t = 0 (the invisible "from" keyframe).
 *  3. Scale raised to 3 for higher-resolution output.
 *  4. Background forced to white so transparent areas don't go black in the PDF.
 *
 * Requires: html2canvas, jspdf  (npm install html2canvas jspdf)
 */

/** CSS injected into any document to freeze all animations at their final state */
const FREEZE_CSS = `
    *, *::before, *::after {
        animation-play-state:  paused   !important;
        animation-delay:       -99999ms !important;
        transition-duration:   0ms      !important;
        transition-delay:      0ms      !important;
    }
`;

/**
 * Captures a DOM node and exports it as a landscape A4 PDF.
 */

export default async function exportCertificatePdf(node) {
    const uid = '__cert_freeze_' + Date.now() + '__';
    const styleEl = document.createElement('style');

    // 1. Define valid, flat CSS rules to force the final animation frame
    const freezeRules = `
        animation-play-state: paused !important;
        animation-delay: -99999ms !important;
        animation-fill-mode: forwards !important;
        transition: none !important;
    `;

    // 2. Apply rules to the specific node and all its children correctly
    styleEl.textContent = `
        [data-pdf-freeze="${uid}"],
        [data-pdf-freeze="${uid}"] *,
        [data-pdf-freeze="${uid}"] *::before,
        [data-pdf-freeze="${uid}"] *::after {
            ${freezeRules}
        }
    `;

    document.head.appendChild(styleEl);
    node.setAttribute('data-pdf-freeze', uid);

    // Give the browser time to apply the CSS and repaint
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    await new Promise(r => setTimeout(r, 150));

    try {
        const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
            import('html2canvas'),
            import('jspdf'),
        ]);

        // 3. Let html2canvas handle the dimensions automatically to fix centering
        const canvas = await html2canvas(node, {
            scale: 3,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            onclone: (clonedDoc) => {
                const s = clonedDoc.createElement('style');
                // Apply the exact same freeze rules globally inside the clone
                s.textContent = `
                    *, *::before, *::after {
                        ${freezeRules}
                    }
                `;
                clonedDoc.head.appendChild(s);
            },
        });

        const imgData = canvas.toDataURL('image/png');

        const pdfW = 297, pdfH = 210, margin = 8;
        const maxW = pdfW - margin * 2;
        const maxH = pdfH - margin * 2;

        const ratio = Math.min(maxW / canvas.width, maxH / canvas.height);
        const drawW = canvas.width * ratio;
        const drawH = canvas.height * ratio;

        const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

        pdf.addImage(
            imgData, 'PNG',
            (pdfW - drawW) / 2,
            (pdfH - drawH) / 2,
            drawW, drawH,
        );

        return pdf;
    } finally {
        document.head.removeChild(styleEl);
        node.removeAttribute('data-pdf-freeze');
    }
}
