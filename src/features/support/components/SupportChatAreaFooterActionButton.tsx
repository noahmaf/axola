const SupportChatAreaFooterActionButton = ({
  icon: Icon,
  title,
  onTap,
}: {
  title: string;
  onTap: () => void;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) => {
  return (
    <div
      className="flex flex-col justify-center items-center space-y-2"
      onClick={onTap}
    >
      <div className="rounded-full p-3 bg-secondary text-base text-white ">
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-sm text-black">{title}</p>
    </div>
  );
};

export default SupportChatAreaFooterActionButton;

export const SupportChatAreaFooterActionButtonSkeleton = () => {
  return (
    <div className="flex flex-col justify-center items-center space-y-2">
      <div className="rounded-full w-14 h-14 p-3 bg-secondary bg-opacity-20 ">
        _
      </div>
      <p className="w-full bg-secondary bg-opacity-20 rounded-md">_</p>
    </div>
  );
};
