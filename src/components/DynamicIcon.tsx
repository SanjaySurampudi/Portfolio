import * as Icons from "lucide-react";

interface DynamicIconProps {
  name: string;
  size?: number;
  className?: string;
}

export default function DynamicIcon({ name, size = 20, className = "" }: DynamicIconProps) {
  // Try to resolve the icon by name
  const IconComponent = (Icons as any)[name];

  if (!IconComponent) {
    // Return a default icon if not found
    const FallbackIcon = Icons.HelpCircle;
    return <FallbackIcon size={size} className={className} />;
  }

  return <IconComponent size={size} className={className} />;
}
