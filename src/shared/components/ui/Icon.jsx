/**
 * Icon — Material Symbols Wrapper
 *
 * Renders a Google Material Symbol with optional fill state.
 * Automatically sets aria-hidden for decorative icons.
 *
 * @param {string}  name     - Material Symbol name (e.g., 'point_of_sale')
 * @param {boolean} [filled] - Use filled variant
 * @param {string}  [className] - Additional CSS classes
 */
export default function Icon({ name, filled = false, className = '', ...props }) {
  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
      aria-hidden="true"
      {...props}
    >
      {name}
    </span>
  );
}
