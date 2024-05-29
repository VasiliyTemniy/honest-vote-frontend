
import { FC } from "react";
import { Poll } from '../../components/Poll';

export const VoteAppView: FC = () => {

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
          VoteApp
        </h1>
        <div className="flex flex-col items-start w-96 pb-4 text-xl rounded-lg bg-clip-text bg-gradient-to-br from-indigo-600 to-fuchsia-600">
          <div className="text-left">
            Simple rules:
          </div>
          <div className="text-left text-sm">
            1. You can create a poll
          </div>
          <div className="text-left text-sm">
            2. You can add a subject to your poll
          </div>
          <div className="text-left text-sm">
            3. You cannot add a subject to another person&apos;s poll
          </div>
          <div className="text-left text-sm">
            4. You can add a comment to any poll
          </div>
          <div className="text-left text-sm">
            5. You can remove your comment at any time
          </div>
          <div className="text-left text-sm">
            6. You cannot remove another person&apos;s comment
          </div>
          <div className="text-left text-sm">
            7. For each poll, you can only vote once
          </div>
        </div>
        <div className="text-center">
          <Poll />
        </div>
      </div>
    </div>
  );
};
