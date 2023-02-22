import { JSX } from "preact";
import { apply, tw } from "twind";
import { Component } from "./model";

export enum PillSize {
  SMALL = "sm",
  MEDIUM = "md",
  LARGE = "lg",
}

export enum PillVariant {
  CHIP = "chip",
  BADGE = "badge",
}

export enum PillChipColor {
  TRANSPARENT = "transparent",
  LIGHT = "light",
  WHITE = "white",
  BLACK = "black",
}

export enum PillBadgeColor {
  WHITE = "white",
  GRAY = "gray",
  TEAL = "teal",
  YELLOW = "yellow",
  BLUE = "blue",
  PURPLE = "purple",
  ORANGE = "orange",
  ERROR = "error",
  SUCCESS = "success",
  SKYBLUE = "skyblue",
  PINK = "pink",
}

export const PillSizeTypes = Object.values(PillSize);
export const PillChipColors = Object.values(PillChipColor);
export const PillBadgeColors = Object.values(PillBadgeColor);

export interface PillProps extends Component {
  size?: PillSize;
  variant?: PillVariant;
  chipColor?: PillChipColor;
  badgeColor?: PillBadgeColor;
  label?: string;
  icon?: JSX.Element;
  iconLeft?: boolean;
  "aria-label"?: string;
  role?: "button" | "none";
  className?: string;
  onClick?: () => void;
}

export const Pill = ({
  size = PillSize.LARGE,
  variant = PillVariant.CHIP,
  chipColor = PillChipColor.TRANSPARENT,
  badgeColor = PillBadgeColor.WHITE,
  label,
  icon,
  iconLeft,
  "aria-label": ariaLabel,
  role,
  className,
  onClick,
  tw: twProp = tw,
}: PillProps) => {
  if (!label && !icon) {
    throw new Error("label or Icon must be present");
  }
  if (!label && !ariaLabel) {
    throw new Error(`can't use icon without ariaLabel`);
  }

  const isClickable = !!onClick || role === "button";

  const classNames = {
    root: twProp(
      classes.root.default,
      classes.root.size[size].default,
      label
        ? classes.root.size[size].withLabel
        : classes.root.size[size].withoutLabel,
      // ugly hack to pass typescript checker
      variant === "chip"
        ? classes.root.color[variant][chipColor]
        : classes.root.color[variant][badgeColor],
      !icon && isClickable && classes.clickable,
      className
    ),
    icon: twProp(classes.icon.size[size], isClickable && classes.clickable),
    label: twProp(classes.label),
  };

  const onClickProps = isClickable
    ? {
        onClick,
        role: "button",
        "aria-label": ariaLabel || label,
      }
    : {};

  switch (true) {
    // Icon only
    case !label: {
      return (
        <div className={classNames.root}>
          <span className={classNames.icon} {...onClickProps}>
            {icon}
          </span>
        </div>
      );
    }

    // Label only
    case !icon: {
      return (
        <div className={classNames.root} {...onClickProps}>
          <span>{label}</span>
        </div>
      );
    }

    // Label and Icon
    default: {
      return (
        <div className={classNames.root}>
          {iconLeft && (
            <span className={classNames.icon} {...onClickProps}>
              {icon}
            </span>
          )}
          <span>{label}</span>
          {!iconLeft && (
            <span className={classNames.icon} {...onClickProps}>
              {icon}
            </span>
          )}
        </div>
      );
    }
  }
};

export const Chip = (props: PillProps) => (
  <Pill variant={PillVariant.CHIP} {...props} />
);
export const Badge = (props: PillProps) => (
  <Pill variant={PillVariant.BADGE} {...props} />
);

const classes = {
  root: {
    default: apply`w-fit flex flex-row justify-center items-center gap-1`,
    size: {
      lg: {
        default: apply`rounded-[32px]`,
        withLabel: apply`px-2.5 py-1`,
        withoutLabel: apply`p-2`,
      },
      md: {
        default: apply`rounded-[28px]`,
        withLabel: apply`px-2 py-1`,
        withoutLabel: apply`p-[7px]`,
      },
      sm: {
        default: apply`rounded-[22px]`,
        withLabel: apply`px-2 py-0.5`,
        withoutLabel: apply`p-1`,
      },
    },
    color: {
      chip: {
        transparent: apply`
          text-neutral-900 bg-transparent
         `,
        light: apply`
          text-neutral-900 bg-neutral-100
          `,
        white: apply`
          text-neutral-900 bg-white
         `,
        black: apply`text-white bg-gray-900`,
      },
      badge: {
        white: apply`bg-white`,
        gray: apply`bg-surface-variant-light`,
        teal: apply`bg-teal-100`,
        yellow: apply`bg-yellow-100`,
        blue: apply`bg-blue-100`,
        purple: apply`bg-purple-100`,
        orange: apply`bg-orange-100`,
        error: apply`bg-red-100`,
        success: apply`bg-green-100`,
        skyblue: apply`bg-skyblue-100`,
        pink: apply`bg-pink-100`,
      },
    },
  },
  label: apply`whitespace-nowrap`,
  icon: {
    size: {
      lg: apply`w-4`,
      md: apply`w-3.5`,
      sm: apply`w-3.5`,
    },
  },
  clickable: apply`cursor-pointer`,
};
