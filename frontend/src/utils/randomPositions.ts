// Helper to generate random positions once (outside render)
export const generateRandomPositions = (count: number) => {
  return Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: 3 + Math.random() * 2,
    delay: Math.random() * 2,
  }));
};

export const generateConfettiPositions = (count: number) => {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 200 - 50,
    rotate: Math.random() * 720,
    duration: 2 + Math.random(),
    delay: Math.random() * 0.8,
  }));
};

export const generateMoneyPositions = (count: number) => {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
  }));
};
