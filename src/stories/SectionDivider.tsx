import { ComponentChild, ComponentChildren, VNode } from "preact";
import { apply, tw } from "twind";
import { Component } from "./model";

export const SECTION_DIVIDER_VARIANT = [
  "single",
  "double",
  "background",
] as const;

export type SectionDividerVariant = typeof SECTION_DIVIDER_VARIANT[number];

export interface SectionDividerProps extends Component {
  variant?: SectionDividerVariant;
  className?: string;
  children?: ComponentChildren;
}

export const SectionDivider = ({
  variant = "single",
  className,
  children,
  tw: twProp = tw,
}: SectionDividerProps) => {
  const rootClassNames = twProp(sectionClasses.root[variant], className);

  const Line = ({ className }: { className?: string }) => (
    <div className={twProp(sectionClasses.line, className)} />
  );

  if (!children) {
    return <Line className={className} />;
  }

  // Check for custom elements with empty children slot
  if (
    ((children as VNode<unknown>).props.children as ComponentChild[])
      ?.length === 0
  ) {
    return <Line className={className} />;
  }

  switch (variant) {
    case "single":
    case "double": {
      return (
        <div className={rootClassNames}>
          <Line />
          {children}
          <Line />
        </div>
      );
    }

    case "background": {
      return <div className={rootClassNames}>{children}</div>;
    }
  }
};

export const SingleDivider = (props: Omit<SectionDividerProps, "variant">) => (
  <SectionDivider variant="single" {...props} />
);
export const DoubleDivider = (props: Omit<SectionDividerProps, "variant">) => (
  <SectionDivider variant="double" {...props} />
);
export const BackgroundDivider = (
  props: Omit<SectionDividerProps, "variant">
) => <SectionDivider variant="background" {...props} />;

export const sectionClasses = {
  root: {
    single: `flex flex-row items-center whitespace-nowrap gap-2`,
    double: apply`flex flex-col items-center gap-2`,
    background: apply`flex flex-row justify-center items-center p-2 rounded-lg bg-neutral-50`,
  },
  line: `w-full h-px bg-surface-variant-light-outline`,
};
