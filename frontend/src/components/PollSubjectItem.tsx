import { decodeTheUInt8 } from "../utils";
import { PollSubject } from "./Poll";
import { web3 } from "@coral-xyz/anchor";

interface PollSubjectProps {
  pollSubject: PollSubject;
  addVote: (parentPoll: web3.PublicKey, pollSubject: web3.PublicKey) => Promise<void>;
}

export const PollSubjectItem = ({ pollSubject, addVote }: PollSubjectProps) => {
  return (
    <div className="flex flex-col items-start p-2 border-2 rounded-lg border-slate-500 bg-gradient-to-br from-indigo-600 to-fuchsia-600">
      <div>
        <div className='font-bold text-sm'>{decodeTheUInt8(pollSubject.title)}</div>
        <div className='text-xs'>total votes: {pollSubject.votes.toString()}</div>
      </div>
      <button
        className="group w-24 mt-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
        onClick={(e) => addVote(pollSubject.parentPoll, pollSubject.pubkey)}
      >
        <div>
          Vote!
        </div>
      </button>
    </div>
  );
};