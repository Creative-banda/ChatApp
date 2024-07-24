import React from 'react';
import { SvgXml } from 'react-native-svg';

const CrossIcon = ({ width = 30, height = 30 }) => {

    const svgXml = `
    <?xml version="1.0" encoding="utf-8"?>
    <!-- Your SVG XML content -->
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
  `;

    return <SvgXml xml={svgXml} width={width} height={height} />;
};

export default CrossIcon;

