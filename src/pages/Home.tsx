import NewAnnouncementForm from "@/features/announcements/components/NewAnnouncementForm";
import { PublishedAnnouncements } from "@/features/announcements/components/PublishedAnnouncements";

const Home = () => {
  return (
    <div className="flex-1 overflow-y-auto    bg-white   flex md:flex-row gap-6  p-4">
      <PublishedAnnouncements />
      <div className="w-full ">
        <NewAnnouncementForm />
      </div>
    </div>
  );
};

export default Home;
