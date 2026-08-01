// SVG Path Processing Worker Logic
// This processes paths off the main thread

export interface PathData {
  index: number;
  length: number;
}

export const processPathsInWorker = (
  svgString: string
): Promise<PathData[]> => {
  return new Promise((resolve) => {
    // Create a blob URL for the worker
    const workerCode = `
      self.onmessage = function(e) {
        const { svgString } = e.data;
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgString, 'image/svg+xml');
        const paths = doc.querySelectorAll('path');
        const pathData = [];
        
        paths.forEach((path, index) => {
          try {
            // Estimate path length without getTotalLength (rough approximation)
            const d = path.getAttribute('d') || '';
            // Simple estimation based on path command count
            const commands = d.match(/[MLHVCSQTAZ]/gi) || [];
            const estimatedLength = commands.length * 50 + 100;
            pathData.push({ index, length: estimatedLength });
          } catch(e) {
            pathData.push({ index, length: 500 });
          }
        });
        
        self.postMessage(pathData);
      };
    `;

    // If Web Workers are supported, use them
    if (typeof Worker !== "undefined") {
      try {
        const blob = new Blob([workerCode], { type: "application/javascript" });
        const worker = new Worker(URL.createObjectURL(blob));

        worker.onmessage = (e) => {
          resolve(e.data);
          worker.terminate();
        };

        worker.onerror = () => {
          // Fallback to simple estimation
          resolve(estimatePathLengths(svgString));
          worker.terminate();
        };

        worker.postMessage({ svgString });
      } catch {
        resolve(estimatePathLengths(svgString));
      }
    } else {
      resolve(estimatePathLengths(svgString));
    }
  });
};

// Fallback estimation without getTotalLength
function estimatePathLengths(svgString: string): PathData[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const paths = doc.querySelectorAll("path");
  const pathData: PathData[] = [];

  paths.forEach((_, index) => {
    // Use a standard length that works for most paths
    pathData.push({ index, length: 500 });
  });

  return pathData;
}
