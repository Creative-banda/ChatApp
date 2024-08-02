import React from 'react';
import { SvgXml } from 'react-native-svg';

const CrossIcon = ({ width = 30, height = 30 }) => {

    const svgXml = `
    <?xml version="1.0" encoding="utf-8"?>
    <!-- Your SVG XML content -->
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#FFFFFF"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.4" d="M2.44922 14.9702C3.51922 18.4102 6.39923 21.0602 9.97923 21.7902" stroke="#FFFFFF" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M2.05078 10.98C2.56078 5.93 6.82078 2 12.0008 2C17.1808 2 21.4408 5.94 21.9508 10.98" stroke="#FFFFFF" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14.0098 21.8C17.5798 21.07 20.4498 18.45 21.5398 15.02" stroke="#FFFFFF" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
  `;

    return <SvgXml xml={svgXml} width={width} height={height} />;
};

export default CrossIcon;

