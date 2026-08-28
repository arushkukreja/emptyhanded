import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export default function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="surface-card px-6 py-16 text-center sm:px-12">
      {icon && <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-accent-100 text-4xl text-accent-700">{icon}</div>}
      <h3 className="display-type text-2xl font-bold text-primary">{title}</h3>
      {description && <p className="mx-auto mt-3 max-w-md leading-relaxed text-primary-600">{description}</p>}
      {action && <div className="mt-7">{action}</div>}
    </div>
  );
}
