const RoundedIconButton = ({
  icon: Icon,
  iconClassName,
  containerClassName,
  onClick,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconClassName?: string;
  containerClassName?: string;
  onClick: () => void;
}) => {
  return (
    <div
      className={` h-full justify-center flex items-center ${containerClassName}`}
    >
      <Icon
        onClick={onClick}
        className={iconClassName ? iconClassName : `transparent-icon-button`}
      />
    </div>
  );
};

export default RoundedIconButton;
