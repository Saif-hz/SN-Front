import React from "react";
import Svg, { Path } from "react-native-svg";

const GoogleIcon = ({ width = 24, height = 24 }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 48 48">
      <Path
        fill="#4285F4"
        d="M23.49 12.27h10.71c.89 0 1.65.64 1.79 1.51l.68 4.06c.07.42-.04.86-.29 1.22s-.63.6-1.05.66l-5.94.64c-.47.05-.91.27-1.22.63-.31.36-.46.81-.42 1.27l.46 5.3c.04.46-.09.92-.38 1.28s-.7.59-1.16.62l-5.34.5c-.87.08-1.62-.61-1.71-1.48l-2.4-26.21c-.08-.88.6-1.64 1.48-1.73l5.42-.47c.87-.08 1.62.61 1.7 1.48l.45 5.09c.08.87-.6 1.62-1.47 1.7l-2.16.19.38 4.21 3.03-.34c.47-.05.91-.27 1.22-.63s.46-.81.42-1.27l-.37-4.22z"
      />
      <Path
        fill="#34A853"
        d="M11.1 15.71c-.7.84-1.14 1.89-1.24 2.97s.09 2.17.52 3.13l3.67 8.33c.35.79 1.1 1.32 1.95 1.36l4.71.26c.49.03.95-.12 1.33-.42s.63-.71.72-1.18l.47-5.32c.09-.97-.63-1.82-1.61-1.91l-4.88-.43-1.17-2.68 9.42.83c.45.04.91-.09 1.27-.37s.58-.68.63-1.12l.65-4.06c.08-.49-.06-1-.39-1.38s-.8-.63-1.29-.66L11.1 15.71z"
      />
    </Svg>
  );
};

export default GoogleIcon;
