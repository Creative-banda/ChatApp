import React from 'react';
import { SvgXml } from 'react-native-svg';

const PlusIcon = ({ width = 30, height = 30 }) => {

    const svgXml = `
    <?xml version="1.0" encoding="utf-8"?>
    <!-- Your SVG XML content -->
    <svg width="196px" height="196px" viewBox="-1.68 -1.68 27.36 27.36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="SVGRepo_bgCarrier" stroke-width="0">
    </g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round">
    </g><g id="SVGRepo_iconCarrier"> 
    <circle opacity="0.5" cx="12" cy="12" r="10" stroke="#FFF" stroke-width="1.32">
    </circle> <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="#FFF" stroke-width="1.32" stroke-linecap="round">
    </path> </g></svg>
  `;

    return <SvgXml xml={svgXml} width={width} height={height} />;
};

export default PlusIcon;

