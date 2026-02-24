interface PageLayoutProps {
  title: string;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  children: React.ReactNode;
}

export function PageLayout({
  title,
  leftContent,
  rightContent,
  children,
}: PageLayoutProps) {
  return (
    <div className="w-full">
      <div className="mb-4 flex flex-1 items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {leftContent}
          <h1 className="font-semibold">{title}</h1>
        </div>
        {rightContent != null ? <div>{rightContent}</div> : null}
      </div>
      {children}
    </div>
  );
}
