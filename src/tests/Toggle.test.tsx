import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Toggle } from '../components/ui/Toggle';

const defaultProps = {
  checked: false,
  onChange: vi.fn(),
  id: 'switch-ev',
  label: 'Switch to EV',
  sub: 'Replace primary vehicle with electric',
};

describe('Toggle', () => {
  it('renders label text', () => {
    render(<Toggle {...defaultProps} />);

    expect(screen.getByText('Switch to EV')).toBeInTheDocument();
  });

  it('renders sub description text', () => {
    render(<Toggle {...defaultProps} />);

    expect(screen.getByText('Replace primary vehicle with electric')).toBeInTheDocument();
  });

  it('has role="switch"', () => {
    render(<Toggle {...defaultProps} />);

    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  describe('checked state', () => {
    it('has aria-checked=true when checked', () => {
      render(<Toggle {...defaultProps} checked={true} />);

      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
    });

    it('has aria-checked=false when not checked', () => {
      render(<Toggle {...defaultProps} checked={false} />);

      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('interactions', () => {
    it('calls onChange with true when clicked while unchecked', async () => {
      const onChange = vi.fn();
      render(<Toggle {...defaultProps} onChange={onChange} checked={false} />);

      await userEvent.click(screen.getByRole('switch'));

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('calls onChange with false when clicked while checked', async () => {
      const onChange = vi.fn();
      render(<Toggle {...defaultProps} onChange={onChange} checked={true} />);

      await userEvent.click(screen.getByRole('switch'));

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(false);
    });
  });

  describe('accessibility', () => {
    it('connects label via htmlFor matching button id', () => {
      render(<Toggle {...defaultProps} />);

      const switchButton = screen.getByRole('switch');
      const label = screen.getByText('Switch to EV').closest('label');

      expect(label).toHaveAttribute('for', 'switch-ev');
      expect(switchButton).toHaveAttribute('id', 'switch-ev');
    });

    it('has aria-labelledby pointing to the label element id', () => {
      render(<Toggle {...defaultProps} />);

      const switchButton = screen.getByRole('switch');
      expect(switchButton).toHaveAttribute('aria-labelledby', 'switch-ev-label');
    });

    it('has aria-describedby pointing to the description element id', () => {
      render(<Toggle {...defaultProps} />);

      const switchButton = screen.getByRole('switch');
      expect(switchButton).toHaveAttribute('aria-describedby', 'switch-ev-desc');
    });

    it('label element has id matching aria-labelledby target', () => {
      render(<Toggle {...defaultProps} />);

      const label = screen.getByText('Switch to EV').closest('label');
      expect(label).toHaveAttribute('id', 'switch-ev-label');
    });

    it('description span has id matching aria-describedby target', () => {
      render(<Toggle {...defaultProps} />);

      const desc = screen.getByText('Replace primary vehicle with electric');
      expect(desc).toHaveAttribute('id', 'switch-ev-desc');
    });

    it('hides decorative thumb span from screen readers', () => {
      const { container } = render(<Toggle {...defaultProps} />);

      const spans = container.querySelectorAll('span[aria-hidden="true"]');
      expect(spans.length).toBeGreaterThanOrEqual(1);
    });
  });
});
