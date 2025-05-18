import AnnouncementCard from "@/features/announcements/components/AnnouncementCard";

import AnnouncementCardSkeleton from "./AnnouncementCardSkeleton";
import { useAnnouncements } from "@/features/announcements/context/announcmentsContext";
import EmptyResponses from "@/assets/images/empty-step-responses.png";

export const PublishedAnnouncements = () => {
  const { announcements, announcementsLoading } = useAnnouncements();

  return (
    <div
      className={`${
        !announcementsLoading && "overflow-y-auto"
      } flex flex-col gap-2  bg-gray-100 w-full md:w-[80%]  text-black rounded-md p-3 `}
    >
      <div className="bg-white rounded-lg p-3 shadow-lg text-center font-semibold text-lg  top-0  ">
        {announcementsLoading ? (
          <p className="bg-secondary bg-opacity-20 text-transparent rounded-md w-fit animate-pulse">
            _______________________
          </p>
        ) : (
          <p>Published Announcements</p>
        )}
      </div>
      {announcementsLoading ? (
        <div className="flex flex-col w-full gap-1 pt-[6px] animate-pulse">
          <AnnouncementCardSkeleton />
          <AnnouncementCardSkeleton />
          <AnnouncementCardSkeleton />
          <AnnouncementCardSkeleton />
          <AnnouncementCardSkeleton />
          <AnnouncementCardSkeleton />
          <AnnouncementCardSkeleton />
          <AnnouncementCardSkeleton />
        </div>
      ) : announcements.length === 0 ? (
        <div className="flex flex-col  items-center justify-center text-center space-y-12 p-24">
          <img className="h-32 " src={EmptyResponses} />
          <p className=" text-lg font-medium  text-neutral-500">
            No announcements have been published yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col w-full gap-1 pt-[6px]">
          {announcements.map((prevAnouncement) => {
            return (
              <AnnouncementCard
                key={prevAnouncement.id}
                announcement={prevAnouncement}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
