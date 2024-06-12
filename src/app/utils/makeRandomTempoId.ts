// the new entity ID should be generated on BE, that's why here I gave the ID below 0.
// it is needed only for UI, and will not be passed via API
export const makeRandomTempoId = () => -Math.floor(10000 + Math.random() * 90000);