import { SupportChatMessage } from "@/app/models/SupportChatMessage";
import { formatTime } from "@/app/utils/dateFormat";
import { extractUrls, splitMessageIntoSegments } from "@/app/utils/linkify";
import { LinkPreview } from "@/components/LinkPreview";

const SupportChatAreaMessageCard = ({
  chatMessage,
}: {
  chatMessage: SupportChatMessage;
}) => {
  const segments = splitMessageIntoSegments(chatMessage.content);
  const urls = extractUrls(chatMessage.content);

  return chatMessage.referralNote ? (
    <div className={`flex justify-center `}>
      <div
        className={`w-[100%] bg-secondary bg-opacity-70 text-white selection:bg-white"
           
         p-2 rounded-lg max-w-xs text-sm flex flex-col justify-center items-center`}
      >
        <p className="font-semibold text-xl mb-8">Referral Note</p>

        {urls.length > 0 && (
          <div className="mb-6 space-y-2">
            {urls.map((u) => (
              <LinkPreview key={u} url={u} />
            ))}
          </div>
        )}

        {/* Text with clickable links */}
        <p className="whitespace-pre-wrap break-words">
          {segments.map((seg, i) =>
            seg.type === "text" ? (
              <span key={i}>{seg.value}</span>
            ) : (
              <a
                key={i}
                href={seg.value}
                target="_blank"
                rel="noopener noreferrer"
                className={`underline ${
                  chatMessage.sent ? "text-white" : "text-blue-600"
                } hover:opacity-80`}
              >
                {seg.value}
              </a>
            )
          )}

          <span className="w-full mt-2 justify-center flex text-orange-500 font-medium pt-1">
            {formatTime(chatMessage.dateCreated)}
          </span>
        </p>
      </div>
    </div>
  ) : (
    <div
      className={`flex ${chatMessage.sent ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`${
          chatMessage.sent
            ? "bg-secondary text-white rounded-tr-none selection:bg-orange-500"
            : "bg-gray-50 text-black rounded-tl-none"
        } p-2 rounded-lg max-w-xs text-sm flex flex-col`}
      >
        {urls.length > 0 && (
          <div className="mb-6 space-y-2">
            {urls.map((u) => (
              <LinkPreview key={u} url={u} />
            ))}
          </div>
        )}

        {/* Text with clickable links */}
        <p className="whitespace-pre-wrap break-words">
          {segments.map((seg, i) =>
            seg.type === "text" ? (
              <span key={i}>{seg.value}</span>
            ) : (
              <a
                key={i}
                href={seg.value}
                target="_blank"
                rel="noopener noreferrer"
                className={`underline ${
                  chatMessage.sent ? "text-white" : "text-blue-600"
                } hover:opacity-80`}
              >
                {seg.value}
              </a>
            )
          )}
        </p>

        <span className="w-full justify-end flex text-orange-500 font-medium pt-1">
          {formatTime(chatMessage.dateCreated)}
        </span>
      </div>
    </div>
  );
};

export default SupportChatAreaMessageCard;

export const SupportChatAreaMessageCardSkeleton = ({
  sent,
}: {
  sent: boolean;
}) => {
  return (
    <div className={`flex ${sent ? "justify-end" : "justify-start"}`}>
      <div
        className={`bg-secondary bg-opacity-15 p-2 rounded-lg max-w-xs text-sm w-[50%] text-transparent`}
      >
        _
      </div>
    </div>
  );
};
