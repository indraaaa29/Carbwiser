export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

export function validateRequired(value: unknown, message: string): ValidationResult {
  if (value === '' || value === null || value === undefined) {
    return { isValid: false, error: message };
  }
  return { isValid: true, error: null };
}

export function validateSelection(value: string | null, message: string): ValidationResult {
  if (!value) {
    return { isValid: false, error: message };
  }
  return { isValid: true, error: null };
}

export function validatePositiveNumber(
  value: string | number | null | undefined,
  fieldName: string,
): ValidationResult {
  if (value === '' || value === null || value === undefined) {
    return { isValid: false, error: `Please enter your ${fieldName}.` };
  }
  const num = Number(value);
  if (isNaN(num) || num < 0) {
    const label = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
    return { isValid: false, error: `${label} must be a positive number.` };
  }
  return { isValid: true, error: null };
}

export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string,
): ValidationResult {
  if (value < min || value > max) {
    return { isValid: false, error: `${fieldName} must be between ${min} and ${max}.` };
  }
  return { isValid: true, error: null };
}

export interface AssessmentData {
  transportMode: string | null;
  weeklyDistance: string | number;
  energySource: string | null;
  monthlyKwh: string | number;
  dietType: string | null;
  householdSize: string | null;
  reductionGoal: string | null;
}

export function validateAssessmentStep(
  stepIndex: number,
  data: AssessmentData,
): ValidationResult {
  if (stepIndex === 0) {
    let res = validateSelection(data.transportMode, 'Please select a transport mode.');
    if (!res.isValid) return res;
    res = validateRequired(data.weeklyDistance, 'Please enter your weekly distance.');
    if (!res.isValid) return res;
    return validatePositiveNumber(data.weeklyDistance, 'weekly distance');
  }

  if (stepIndex === 1) {
    let res = validateSelection(data.energySource, 'Please select an energy source.');
    if (!res.isValid) return res;
    res = validateRequired(data.monthlyKwh, 'Please enter your monthly usage.');
    if (!res.isValid) return res;
    return validatePositiveNumber(data.monthlyKwh, 'monthly energy usage');
  }

  if (stepIndex === 2) {
    return validateSelection(data.dietType, 'Please select a diet type.');
  }

  if (stepIndex === 3) {
    return validateSelection(data.householdSize, 'Please select your household size.');
  }

  if (stepIndex === 4) {
    return validateSelection(data.reductionGoal, 'Please select a climate goal to proceed.');
  }

  return { isValid: true, error: null };
}
