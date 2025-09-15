
// Helper function to create a data URL from an SVG string
const svgToDataUrl = (svg: string): string => {
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `url("data:image/svg+xml,${encoded}")`;
};

// Function to generate the CSS style for a given pattern
export const getPatternStyle = (patternId: string | undefined, color: string) => {
  const pattern = patterns.find((p) => p.id === patternId);
  if (!pattern) return {};
  
  // Inject the color into the SVG string
  const coloredSvg = pattern.svg.replace(/currentColor/g, color);
  
  return {
    backgroundImage: svgToDataUrl(coloredSvg),
    backgroundSize: pattern.size || 'auto',
  };
};

export const patterns = [
  {
    id: 'dots',
    name: 'Dots',
    svg: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor" fill-opacity="0.4" fill-rule="evenodd"><circle cx="5" cy="5" r="2"/><circle cx="15" cy="15" r="2"/></g></svg>`,
    size: '15px',
  },
  {
    id: 'lines',
    name: 'Diagonal Lines',
    svg: `<svg width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke="currentColor" stroke-opacity="0.2" stroke-width="1.5"/></svg>`,
    size: '8px',
  },
  {
    id: 'grid',
    name: 'Grid',
    svg: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M0 10L20 10M10 0L10 20" stroke="currentColor" stroke-opacity="0.2" stroke-width="1"/></svg>`,
    size: '12px',
  },
  {
    id: 'cross',
    name: 'Cross',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" fill-opacity="0.3" d="M8 0v16M0 8h16"/></svg>`,
    size: '12px'
  },
  {
    id: 'zig-zag',
    name: 'Zig Zag',
    svg: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M0 5L5 0L10 5L15 0L20 5" stroke="currentColor" stroke-opacity="0.3" stroke-width="2" fill="none"/><path d="M0 15L5 10L10 15L15 10L20 15" stroke="currentColor" stroke-opacity="0.3" stroke-width="2" fill="none"/></svg>`,
    size: '15px'
  },
  {
    id: 'carbon-fiber',
    name: 'Carbon Fiber',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path fill="currentColor" fill-opacity="0.15" d="M0 0h6v6H0zM6 6h6v6H6z"/></svg>`,
    size: '10px'
  },
  {
    id: 'circles',
    name: 'Circles',
    svg: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="5" fill="none" stroke="currentColor" stroke-opacity="0.3" stroke-width="2"/></svg>`,
    size: '20px'
  },
   {
    id: 'triangles',
    name: 'Triangles',
    svg: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M0 20L10 0L20 20z" fill="none" stroke="currentColor" stroke-opacity="0.2" stroke-width="2"/></svg>`,
    size: '20px'
  },
  {
    id: 'wavy',
    name: 'Wavy',
    svg: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M0 40C10 20 30 20 40 40S70 60 80 40" fill="none" stroke="currentColor" stroke-opacity="0.3" stroke-width="4"/></svg>`,
    size: '60px'
  }
];
