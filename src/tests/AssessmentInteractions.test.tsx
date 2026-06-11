import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ProfileProvider } from '../context/ProfileContext';
import LifestyleAssessment from '../pages/LifestyleAssessment';

function renderAssessment() {
  return render(
    <MemoryRouter initialEntries={['/assessment']}>
      <ProfileProvider>
        <LifestyleAssessment />
      </ProfileProvider>
    </MemoryRouter>,
  );
}

describe('LifestyleAssessment interactions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders the first step (Transportation) by default', () => {
    renderAssessment();

    expect(screen.getByText('How do you navigate your world?')).toBeInTheDocument();
    expect(screen.getByText('Car')).toBeInTheDocument();
    expect(screen.getByText('Bus')).toBeInTheDocument();
    expect(screen.getByText('Walk')).toBeInTheDocument();
  });

  it('shows all 5 step indicators', () => {
    renderAssessment();

    expect(screen.getByText('Transportation')).toBeInTheDocument();
    expect(screen.getByText('Energy')).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('Household')).toBeInTheDocument();
    expect(screen.getByText('Goal')).toBeInTheDocument();
  });

  it('disables Back button on first step', () => {
    renderAssessment();

    const backButton = screen.getByText('Back').closest('button');
    expect(backButton).toBeDisabled();
  });

  it('shows validation error when clicking Continue with no selection', async () => {
    renderAssessment();

    await userEvent.click(screen.getByText('Continue Journey'));

    expect(screen.getByText('Please select a transport mode.')).toBeInTheDocument();
  });

  it('shows validation error when distance is empty', async () => {
    renderAssessment();

    await userEvent.click(screen.getByText('Car'));
    await userEvent.click(screen.getByText('Continue Journey'));

    expect(screen.getByText('Please enter your weekly distance.')).toBeInTheDocument();
  });

  it('progresses to step 2 after valid step 1 input', async () => {
    renderAssessment();

    await userEvent.click(screen.getByText('Car'));
    await userEvent.type(screen.getByLabelText(/Weekly Journey Distance/i), '50');
    await userEvent.click(screen.getByText('Continue Journey'));

    expect(screen.getByText('How do you power your home?')).toBeInTheDocument();
  });

  it('shows progress bar with correct width on step 1', () => {
    renderAssessment();

    const progressBar = document.querySelector('.bg-\\[\\#003527\\].h-full');
    expect(progressBar).toBeInTheDocument();
  });

  it('enables Back on step 2 and returns to step 1', async () => {
    renderAssessment();

    await userEvent.click(screen.getByText('Car'));
    await userEvent.type(screen.getByLabelText(/Weekly Journey Distance/i), '50');
    await userEvent.click(screen.getByText('Continue Journey'));

    expect(screen.getByText('How do you power your home?')).toBeInTheDocument();

    const backButton = screen.getByText('Back').closest('button');
    expect(backButton).not.toBeDisabled();

    await userEvent.click(backButton!);
    expect(screen.getByText('How do you navigate your world?')).toBeInTheDocument();
  });

  it('completes full assessment flow and saves to localStorage', async () => {
    renderAssessment();

    // Step 1: Transportation
    await userEvent.click(screen.getByText('Car'));
    await userEvent.type(screen.getByLabelText(/Weekly Journey Distance/i), '80');
    await userEvent.click(screen.getByText('Continue Journey'));

    // Step 2: Energy
    await userEvent.click(screen.getByText('Grid Electricity'));
    await userEvent.type(screen.getByLabelText(/Monthly Energy Usage/i), '400');
    await userEvent.click(screen.getByText('Continue Journey'));

    // Step 3: Food
    await userEvent.click(screen.getByText('Omnivore'));
    await userEvent.click(screen.getByText('Continue Journey'));

    // Step 4: Household
    await userEvent.click(screen.getByText('2 People'));
    await userEvent.click(screen.getByText('Continue Journey'));

    // Step 5: Goal — button text is "View My Footprint" on final step
    await userEvent.click(screen.getByText('Reduce 25%'));
    await userEvent.click(screen.getByText('View My Footprint'));

    const saved = localStorage.getItem('carbwiser_profile');
    expect(saved).not.toBeNull();

    if (saved) {
      const parsed = JSON.parse(saved);
      expect(parsed.transportMode).toBe('car');
      expect(parsed.weeklyDistance).toBe(80);
      expect(parsed.energySource).toBe('grid');
      expect(parsed.monthlyKwh).toBe(400);
      expect(parsed.dietType).toBe('omnivore');
      expect(parsed.householdSize).toBe('2');
      expect(parsed.reductionGoal).toBe('25');
    }
  });

  it('displays error banner with alert role when validation fails', async () => {
    renderAssessment();

    await userEvent.click(screen.getByText('Continue Journey'));

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('Please select a transport mode.');
  });

  it('has accessible step progress indicator', () => {
    renderAssessment();

    const progressIndicator = screen.getByRole('progressbar');
    expect(progressIndicator).toHaveAttribute('aria-valuenow', '1');
    expect(progressIndicator).toHaveAttribute('aria-valuemin', '1');
    expect(progressIndicator).toHaveAttribute('aria-valuemax', '5');
    expect(progressIndicator).toHaveAttribute('aria-valuetext', 'Step 1 of 5: Transportation');
  });

  it('option cards are keyboard accessible on step 1', async () => {
    renderAssessment();

    const evOption = screen.getByLabelText('Electric Vehicle: Fully electric');
    expect(evOption).toHaveAttribute('aria-pressed', 'false');

    await userEvent.click(evOption);
    expect(evOption).toHaveAttribute('aria-pressed', 'true');
  });

  it('clears error when navigating to next step with valid data', async () => {
    renderAssessment();

    await userEvent.click(screen.getByText('Continue Journey'));
    expect(screen.getByRole('alert')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Car'));
    await userEvent.type(screen.getByLabelText(/Weekly Journey Distance/i), '50');
    await userEvent.click(screen.getByText('Continue Journey'));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('How do you power your home?')).toBeInTheDocument();
  });

  it('moves focus to step heading on forward navigation', async () => {
    renderAssessment();

    await userEvent.click(screen.getByText('Car'));
    await userEvent.type(screen.getByLabelText(/Weekly Journey Distance/i), '50');
    await userEvent.click(screen.getByText('Continue Journey'));

    const heading = screen.getByText('How do you power your home?');
    expect(heading).toHaveAttribute('tabindex', '-1');
    expect(document.activeElement).toBe(heading);
  });

  it('moves focus to step heading on back navigation', async () => {
    renderAssessment();

    await userEvent.click(screen.getByText('Car'));
    await userEvent.type(screen.getByLabelText(/Weekly Journey Distance/i), '50');
    await userEvent.click(screen.getByText('Continue Journey'));
    await userEvent.click(screen.getByText('Back'));

    const heading = screen.getByText('How do you navigate your world?');
    expect(heading).toHaveAttribute('tabindex', '-1');
    expect(document.activeElement).toBe(heading);
  });

  it('announces step change via live region', async () => {
    renderAssessment();

    const announcer = document.querySelector('[role="status"]');
    expect(announcer).toBeInTheDocument();
    expect(announcer).toHaveClass('sr-only');
    expect(announcer).toHaveAttribute('aria-live', 'polite');

    await userEvent.click(screen.getByText('Car'));
    await userEvent.type(screen.getByLabelText(/Weekly Journey Distance/i), '50');
    await userEvent.click(screen.getByText('Continue Journey'));

    expect(announcer).toHaveTextContent('Step 2 of 5: Energy');
  });

  it('keeps heading focusable but not in tab order', async () => {
    renderAssessment();

    await userEvent.click(screen.getByText('Car'));
    await userEvent.type(screen.getByLabelText(/Weekly Journey Distance/i), '50');
    await userEvent.click(screen.getByText('Continue Journey'));

    const heading = screen.getByText('How do you power your home?');
    expect(heading.tabIndex).toBe(-1);
  });
});
