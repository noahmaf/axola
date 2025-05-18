const TabItem = ({
  title,
  isActive,
  onClick,
}: {
  title: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      className={`select-none h-full cursor-pointer px-4 py-2 transition duration-300 ${
        isActive
          ? "border-b-4 border-secondary text-secondary font-bold"
          : "hover:text-secondary text-black"
      }`}
      onClick={onClick}
    >
      {title}
    </div>
  );
};

export default TabItem;
