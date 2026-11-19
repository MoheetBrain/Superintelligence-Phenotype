import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Briefcase,
  Check,
  Copy,
  Factory,
  FileCheck,
  FileSearch,
  GitMerge,
  Handshake,
  HardHat,
  Info,
  Lock,
  Mail,
  Menu,
  Percent,
  Receipt,
  Scale,
  Search,
  ShieldCheck,
  ShoppingCart,
  Target,
  Truck,
  X,
  type LucideIcon,
} from 'lucide-react';
import type { IconName } from '../content/types';

/** Content icons (from the content schema) plus the few interface icons the chrome needs. */
export type UiIconName = 'arrow-right' | 'arrow-up-right' | 'check' | 'info' | 'menu' | 'close';

const ICONS: Record<IconName | UiIconName, LucideIcon> = {
  receipt: Receipt,
  copy: Copy,
  percent: Percent,
  'file-search': FileSearch,
  'git-merge': GitMerge,
  search: Search,
  'shield-check': ShieldCheck,
  scale: Scale,
  'file-check': FileCheck,
  lock: Lock,
  handshake: Handshake,
  target: Target,
  boxes: Boxes,
  'hard-hat': HardHat,
  'shopping-cart': ShoppingCart,
  truck: Truck,
  factory: Factory,
  briefcase: Briefcase,
  mail: Mail,
  'arrow-right': ArrowRight,
  'arrow-up-right': ArrowUpRight,
  check: Check,
  info: Info,
  menu: Menu,
  close: X,
};

interface IconProps {
  name: IconName | UiIconName;
  size?: number;
  className?: string;
}

/** Decorative 1.5px-stroke icon, rendered to inline SVG at build time. */
export function Icon({ name, size = 20, className }: IconProps) {
  const Component = ICONS[name];
  return (
    <Component
      size={size}
      strokeWidth={1.5}
      absoluteStrokeWidth
      aria-hidden="true"
      focusable="false"
      className={className ? `icon ${className}` : 'icon'}
    />
  );
}

/** Icon inside a small tinted square, used on cards. */
export function IconTile({ name }: { name: IconName }) {
  return (
    <span className="icon-tile">
      <Icon name={name} size={20} />
    </span>
  );
}
