import type {
  Transition,
  Variants
} from "motion/react";

export const backofficeEase: [number, number, number, number] = [
  0.22,
  1,
  0.36,
  1
];

export const backofficeTransition: Transition = {
  duration: 0.22,
  ease: backofficeEase
};

export const backofficeExitTransition: Transition = {
  duration: 0.18,
  ease: [0.4, 0, 1, 1]
};

export const fadeOverlayVariants: Variants = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: backofficeTransition
  },
  exit: {
    opacity: 0,
    transition: backofficeExitTransition
  }
};

export const slideOverVariants: Variants = {
  initial: {
    opacity: 0.98,
    x: "-100%"
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: backofficeTransition
  },
  exit: {
    opacity: 0.98,
    x: "-100%",
    transition: backofficeExitTransition
  }
};

export const popoverVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.96,
    y: -8
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: backofficeTransition
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: -6,
    transition: backofficeExitTransition
  }
};

export const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 12
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      ...backofficeTransition,
      duration: 0.26
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: backofficeExitTransition
  }
};
