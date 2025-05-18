import Tab from "@/app/types/Tab";
import { useState } from "react";
import TabItem from "./TabItem";
import { AlertDialogTrigger } from "./ui/alert-dialog";

const TabView = ({
  tabs,
  tabIndex,
  onNewNoteOpen,
}: {
  tabs: Tab[];
  tabIndex: number;
  onNewNoteOpen: () => void;
}) => {
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(tabIndex);
  const [currentTab, setCurrentTab] = useState<Tab | undefined>(
    tabs.at(tabIndex)
  );

  const handleTabChange = (index: number) => {
    if (index !== currentTabIndex) {
      setCurrentTabIndex(index);
      setCurrentTab(tabs.at(index));
    }
  };

  return (
    <div className="bg-white  flex flex-col  space-y-4 pb-8 ">
      <div className="bg-white border-b-2 border-gray-200  sticky top-0 left-0 z-10 ">
        <div className=" h-fit flex items-center justify-between ">
          <div className="h-fit flex space-x-4 items-center">
            {tabs.map((tab, index) => {
              return (
                <TabItem
                  key={index}
                  title={tab.title}
                  isActive={index === currentTabIndex}
                  onClick={() => {
                    handleTabChange(index);
                  }}
                />
              );
            })}
          </div>
          {currentTab && currentTab?.title == "Notes" && (
            <AlertDialogTrigger asChild>
              <button
                type="submit"
                className={`button my-2 text-white flex items-center justify-center space-x-2`}
                onClick={() => onNewNoteOpen()}
              >
                New note
              </button>
            </AlertDialogTrigger>
          )}
        </div>
      </div>
      {currentTab && <currentTab.content />}
    </div>
  );
};

export default TabView;
