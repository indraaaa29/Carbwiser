import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { OptionCard } from '../components/ui/OptionCard';

const defaultProps = {
  value: 'car',
  icon: 'directions_car',
  label: 'Car',
  sub: 'Gas, Diesel, or Hybrid',
  selected: false,
  onSelect: vi.fn(),
};

describe('OptionCard', () => {
  it('renders label, sub, and icon', () => {
    render(<OptionCard {...defaultProps} />);

    expect(screen.getByText('Car')).toBeInTheDocument();
    expect(screen.getByText('Gas, Diesel, or Hybrid')).toBeInTheDocument();

    const icon = screen.getByText('directions_car');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('material-symbols-outlined');
  });

  it('uses data-value attribute from value prop', () => {
    render(<OptionCard {...defaultProps} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-value', 'car');
  });

  it('has type button to prevent form submission', () => {
    render(<OptionCard {...defaultProps} />);

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('calls onSelect with value on click', async () => {
    const onSelect = vi.fn();
    render(<OptionCard {...defaultProps} onSelect={onSelect} />);

    await userEvent.click(screen.getByRole('button'));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('car');
  });

  describe('selected state', () => {
    it('has aria-pressed=true when selected', () => {
      render(<OptionCard {...defaultProps} selected={true} />);

      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    });

    it('has aria-pressed=false when not selected', () => {
      render(<OptionCard {...defaultProps} selected={false} />);

      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
    });

    it('applies selected CSS classes when selected', () => {
      const { container } = render(<OptionCard {...defaultProps} selected={true} />);

      const button = container.querySelector('button');
      expect(button?.className).toContain('option-card-selected');
      expect(button?.className).not.toContain('option-card-unselected');
    });

    it('applies default CSS classes when not selected', () => {
      const { container } = render(<OptionCard {...defaultProps} selected={false} />);

      const button = container.querySelector('button');
      expect(button?.className).toContain('option-card-unselected');
      expect(button?.className).not.toContain('option-card-selected');
    });
  });

  describe('accessibility', () => {
    it('has aria-label combining label and sub', () => {
      render(<OptionCard {...defaultProps} />);

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Car: Gas, Diesel, or Hybrid',
      );
    });

    it('hides icon container from screen readers', () => {
      const { container } = render(<OptionCard {...defaultProps} />);

      const hiddenDivs = container.querySelectorAll('[aria-hidden="true"]');
      expect(hiddenDivs.length).toBeGreaterThanOrEqual(1);
    });

    it('renders icon span with aria-hidden', () => {
      render(<OptionCard {...defaultProps} />);

      const icon = screen.getByText('directions_car');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
