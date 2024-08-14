import React from 'react';
import { SvgXml } from 'react-native-svg';

const UserIcon = ({ width = 30, height = 30, strokeWidth = 1.5 }) => {

    const svgXml = `
    <?xml version="1.0" encoding="utf-8"?>
    <svg xmlns="http://www.w3.org/2000/svg" id="Isolation_Mode" data-name="Isolation Mode" viewBox="0 0 24 24" width="512" height="512" stroke-width="${strokeWidth}">
        <path fill="white" d="M21,24H18V19a2,2,0,0,0-2-2H8a2,2,0,0,0-2,2v5H3V19a5.006,5.006,0,0,1,5-5h8a5.006,5.006,0,0,1,5,5Z" stroke="black"/>
        <path fill="white" d="M12,12a6,6,0,1,1,6-6A6.006,6.006,0,0,1,12,12Zm0-9a3,3,0,1,0,3,3A3,3,0,0,0,12,3Z" stroke="black"/>
    </svg>
  `;

    return <SvgXml xml={svgXml} width={width} height={height} />;
};

export default UserIcon;
