import { describe, it, expect } from 'vitest';
import {
  validateRequired,
  validateSelection,
  validatePositiveNumber,
  validateRange,
  validateAssessmentStep,
} from '../lib/validation';

describe('validateRequired', () => {
  it('passes for a non-empty string', () => {
    expect(validateRequired('hello', 'Required.').isValid).toBe(true);
  });

  it('passes for the number 0', () => {
    expect(validateRequired(0, 'Required.').isValid).toBe(true);
  });

  it('fails for an empty string', () => {
    const res = validateRequired('', 'Required.');
    expect(res.isValid).toBe(false);
    expect(res.error).toBe('Required.');
  });

  it('fails for null', () => {
    const res = validateRequired(null, 'Required.');
    expect(res.isValid).toBe(false);
    expect(res.error).toBe('Required.');
  });

  it('fails for undefined', () => {
    const res = validateRequired(undefined, 'Required.');
    expect(res.isValid).toBe(false);
    expect(res.error).toBe('Required.');
  });
});

describe('validateSelection', () => {
  it('passes for a non-null string', () => {
    expect(validateSelection('car', 'Select.').isValid).toBe(true);
  });

  it('fails for null', () => {
    const res = validateSelection(null, 'Please select.');
    expect(res.isValid).toBe(false);
    expect(res.error).toBe('Please select.');
  });

  it('fails for empty string', () => {
    const res = validateSelection('', 'Please select.');
    expect(res.isValid).toBe(false);
  });
});

describe('validatePositiveNumber', () => {
  it('passes for valid positive numbers', () => {
    expect(validatePositiveNumber('50', 'weekly distance').isValid).toBe(true);
    expect(validatePositiveNumber(100, 'monthly usage').isValid).toBe(true);
    expect(validatePositiveNumber('0', 'distance').isValid).toBe(true);
  });

  it('fails for empty string', () => {
    const res = validatePositiveNumber('', 'weekly distance');
    expect(res.isValid).toBe(false);
    expect(res.error).toBe('Please enter your weekly distance.');
  });

  it('fails for null', () => {
    const res = validatePositiveNumber(null, 'monthly usage');
    expect(res.isValid).toBe(false);
    expect(res.error).toBe('Please enter your monthly usage.');
  });

  it('fails for negative values', () => {
    const res = validatePositiveNumber('-10', 'weekly distance');
    expect(res.isValid).toBe(false);
    expect(res.error).toBe('Weekly distance must be a positive number.');
  });

  it('fails for non-numeric strings', () => {
    const res = validatePositiveNumber('abc', 'weekly distance');
    expect(res.isValid).toBe(false);
    expect(res.error).toBe('Weekly distance must be a positive number.');
  });

  it('capitalizes the field name in the error message', () => {
    const res = validatePositiveNumber('-5', 'kWh usage');
    expect(res.error).toBe('KWh usage must be a positive number.');
  });
});

describe('validateRange', () => {
  it('passes when value is within range', () => {
    expect(validateRange(5, 0, 10, 'Days').isValid).toBe(true);
    expect(validateRange(0, 0, 5, 'Days').isValid).toBe(true);
    expect(validateRange(5, 0, 5, 'Days').isValid).toBe(true);
  });

  it('fails below minimum', () => {
    const res = validateRange(-1, 0, 5, 'Remote days');
    expect(res.isValid).toBe(false);
    expect(res.error).toBe('Remote days must be between 0 and 5.');
  });

  it('fails above maximum', () => {
    const res = validateRange(100, 0, 21, 'Meals');
    expect(res.isValid).toBe(false);
    expect(res.error).toBe('Meals must be between 0 and 21.');
  });
});

describe('Form Onboarding Validation (legacy step-based)', () => {
  const validData = {
    transportMode: 'car',
    weeklyDistance: '50',
    energySource: 'grid',
    monthlyKwh: '300',
    dietType: 'flexitarian',
    householdSize: '2',
    reductionGoal: '25',
  };

  it('passes validation when all fields are valid for the given step', () => {
    const step0Res = validateAssessmentStep(0, validData);
    expect(step0Res.isValid).toBe(true);
    expect(step0Res.error).toBeNull();

    const step1Res = validateAssessmentStep(1, validData);
    expect(step1Res.isValid).toBe(true);
    expect(step1Res.error).toBeNull();

    const step2Res = validateAssessmentStep(2, validData);
    expect(step2Res.isValid).toBe(true);

    const step3Res = validateAssessmentStep(3, validData);
    expect(step3Res.isValid).toBe(true);

    const step4Res = validateAssessmentStep(4, validData);
    expect(step4Res.isValid).toBe(true);
  });

  it('fails step 0 validation when transportMode is missing', () => {
    const invalidData = { ...validData, transportMode: null };
    const res = validateAssessmentStep(0, invalidData);
    expect(res.isValid).toBe(false);
    expect(res.error).toBe('Please select a transport mode.');
  });

  it('fails step 0 validation when weeklyDistance is empty', () => {
    const invalidData = { ...validData, weeklyDistance: '' };
    const res = validateAssessmentStep(0, invalidData);
    expect(res.isValid).toBe(false);
    expect(res.error).toBe('Please enter your weekly distance.');
  });

  it('fails step 0 validation when weeklyDistance is negative or invalid', () => {
    const invalidData = { ...validData, weeklyDistance: '-10' };
    const res = validateAssessmentStep(0, invalidData);
    expect(res.isValid).toBe(false);
    expect(res.error).toBe('Weekly distance must be a positive number.');

    const invalidData2 = { ...validData, weeklyDistance: 'abc' };
    const res2 = validateAssessmentStep(0, invalidData2);
    expect(res2.isValid).toBe(false);
    expect(res2.error).toBe('Weekly distance must be a positive number.');
  });

  it('fails step 1 validation when energySource is missing', () => {
    const invalidData = { ...validData, energySource: null };
    const res = validateAssessmentStep(1, invalidData);
    expect(res.isValid).toBe(false);
    expect(res.error).toBe('Please select an energy source.');
  });

  it('fails step 1 validation when monthlyKwh is empty or invalid', () => {
    const invalidData = { ...validData, monthlyKwh: '' };
    const res = validateAssessmentStep(1, invalidData);
    expect(res.isValid).toBe(false);
    expect(res.error).toBe('Please enter your monthly usage.');

    const invalidData2 = { ...validData, monthlyKwh: '-50' };
    const res2 = validateAssessmentStep(1, invalidData2);
    expect(res2.isValid).toBe(false);
    expect(res2.error).toBe('Monthly energy usage must be a positive number.');
  });

  it('fails step 2 validation when dietType is missing', () => {
    const invalidData = { ...validData, dietType: null };
    const res = validateAssessmentStep(2, invalidData);
    expect(res.isValid).toBe(false);
    expect(res.error).toBe('Please select a diet type.');
  });

  it('fails step 3 validation when householdSize is missing', () => {
    const invalidData = { ...validData, householdSize: null };
    const res = validateAssessmentStep(3, invalidData);
    expect(res.isValid).toBe(false);
    expect(res.error).toBe('Please select your household size.');
  });

  it('fails step 4 validation when reductionGoal is missing', () => {
    const invalidData = { ...validData, reductionGoal: null };
    const res = validateAssessmentStep(4, invalidData);
    expect(res.isValid).toBe(false);
    expect(res.error).toBe('Please select a climate goal to proceed.');
  });
});
