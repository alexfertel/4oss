import { motion } from 'motion/react';

export interface IconProps {
  className?: string;
}

export interface GalaxyIconProps extends IconProps {
  loading: boolean;
}

export function GalaxyIcon(props: GalaxyIconProps): JSX.Element {
  const rotationTransition = { repeat: Infinity, duration: 2.5, ease: "linear" };

  return (
    props.loading ? <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={`${props.className}`}
      animate={{ rotate: -360 }}
      transition={rotationTransition}
    // style={{ originX: '50%', originY: '50%' }}
    >
      <motion.g
        animate={{ rotate: -360 }}
        transition={rotationTransition}
      // Ensure the rotation occurs around the element's center.
      // style={{ originX: '50%', originY: '50%' }}
      >
        <rect
          x="9.79"
          y="10.55"
          width="3.89"
          height="3.89"
          rx=".81"
          ry=".81"
          transform="translate(12.28 -4.63) rotate(45)"
        />
      </motion.g>
      <circle cx="21.08" cy="18.68" r="1.08" />
      <circle cx="11.73" cy="2.54" r="1.08" />
      <circle cx="2.91" cy="17.12" r="1.08" />
      <path strokeLinecap="round" d="M13.39,7.45c1.79-1.12,3.98-1.33,5.82-.35,2.72,1.45,3.71,4.98,2.38,8.11" />
      <path strokeLinecap="round" d="M16.04,16.49c.08,2.08-.82,4.07-2.58,5.19-2.6,1.66-6.13.84-8.17-1.81" />
      <path strokeLinecap="round" d="M6.61,14.16c-1.94-.76-3.41-2.37-3.74-4.43-.49-3.04,1.67-5.96,4.9-6.78" />
    </motion.svg >
      :
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className={`${props.className}`}
      >
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        // Ensure the rotation occurs around the element's center.
        // style={{ originX: '50%', originY: '50%' }}
        >
          <rect
            x="9.79"
            y="10.55"
            width="3.89"
            height="3.89"
            rx=".81"
            ry=".81"
            transform="translate(12.28 -4.63) rotate(45)"
          />
        </motion.g>
        <circle cx="21.08" cy="18.68" r="1.08" />
        <circle cx="11.73" cy="2.54" r="1.08" />
        <circle cx="2.91" cy="17.12" r="1.08" />
        <path strokeLinecap="round" d="M13.39,7.45c1.79-1.12,3.98-1.33,5.82-.35,2.72,1.45,3.71,4.98,2.38,8.11" />
        <path strokeLinecap="round" d="M16.04,16.49c.08,2.08-.82,4.07-2.58,5.19-2.6,1.66-6.13.84-8.17-1.81" />
        <path strokeLinecap="round" d="M6.61,14.16c-1.94-.76-3.41-2.37-3.74-4.43-.49-3.04,1.67-5.96,4.9-6.78" />
      </motion.svg>
  );
}
