import SupportChatsSidebar from "@/features/support/components/SupportChatsSidebar";
import SupportChatArea from "@/features/support/components/SupportChatArea";

const Support = () => {
  return (
    <div className="flex flex-1 overflow-y-auto  ">
      {/* Sidebar */}

      <SupportChatsSidebar />

      {/* Chat Area */}
      <SupportChatArea />
    </div>
  );
};

export default Support;
