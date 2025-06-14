
export const saveFormData = (step, data) => {
  if (typeof window !== 'undefined') {
    const existingData = JSON.parse(sessionStorage.getItem('multiStepForm') || '{}');
    const updatedData = { ...existingData, [step]: data };
    sessionStorage.setItem('multiStepForm', JSON.stringify(updatedData));
  }
};

export const getFormData = () => {
  if (typeof window !== 'undefined') {
    return JSON.parse(sessionStorage.getItem('multiStepForm') || '{}');
  }
  return {};
};

export const clearFormData = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('multiStepForm');
  }
};