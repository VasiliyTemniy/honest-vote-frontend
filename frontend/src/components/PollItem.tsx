import { Poll } from "./Poll";
import { useState } from "react";
import { CommentItem } from "./CommentItem";
import { PollSubjectItem } from "./PollSubjectItem";

import { web3 } from '@coral-xyz/anchor';
import { decodeTheUInt8 } from "../utils";

export interface PollItemProps {
  poll: Poll;
  publicKey: web3.PublicKey | null;
  createPollSubject: (title: string, pollKey: web3.PublicKey) => Promise<void>;
  addComment: (title: string, content: string, parentPoll: web3.PublicKey) => Promise<void>;
  addVote: (parentPoll: web3.PublicKey, pollSubject: web3.PublicKey) => Promise<void>;
  removeComment: (commentKey: web3.PublicKey) => Promise<void>;
}

export const PollItem = ({ poll, publicKey, createPollSubject, addComment, addVote, removeComment }: PollItemProps) => {

  const [ pollSubjectInputsShown, setPollSubjectInputsShown ] = useState(false);
  const [ commentInputsShown, setCommentInputsShown ] = useState(false);

  const [ pollSubjectTitle, setPollSubjectTitle ] = useState('');

  const [ commentTitle, setCommentTitle ] = useState('');
  const [ commentContent, setCommentContent ] = useState('');

  const handleCreatePollSubjectClick = async (e: any) => {
    await createPollSubject(pollSubjectTitle, poll.pubkey);

    setPollSubjectInputsShown(false);
  }

  return (
    <div className="m-4 -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-lg flex flex-col items-center w-full p-2" key={poll.pubkey.toString()}>
      <h1 className="font-bold text-wrap">
        {decodeTheUInt8(poll.topic)}
      </h1>
      <div className="text-sm text-wrap">
        {decodeTheUInt8(poll.description)}
      </div>
      {poll.pollSubjects &&
        <div className="text-sm text-wrap pt-4 pb-4">
          <div className="pb-4 font-bold">Subjects:</div>
          <div className="flex flex-row gap-4 flex-wrap w-auto">
            {poll.pollSubjects.map((pollSubject) => (
              <PollSubjectItem
                key={pollSubject.pubkey.toString()}
                pollSubject={pollSubject}
                addVote={addVote}
              />
            ))}
          </div>
        </div>
      }
      {poll.pollAuthor.toString() === publicKey?.toString() && <>
        { !pollSubjectInputsShown &&
          <button
            className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
            onClick={(e) => setPollSubjectInputsShown(true)}
          >
            <div>
              Add Poll Subject
            </div>
          </button>
        }
        { pollSubjectInputsShown && <>
          <input
            className="w-60 m-2 input input-bordered input-primary"
            type="text"
            placeholder="Poll Subject Title"
            onChange={(e) => setPollSubjectTitle(e.target.value)}
          />
          <div className="w-60 flex flex-row gap-2">
            <button
              className="group flex-grow btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
              onClick={handleCreatePollSubjectClick}
            >
              <div>
                Submit
              </div>
            </button>
            <button
              className="group flex-grow btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
              onClick={(e) => setPollSubjectInputsShown(false)}
            >
              <div>
                Cancel
              </div>
            </button>
          </div></>
        }</>
      }
      { !commentInputsShown &&
        <button
          className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
          onClick={(e) => setCommentInputsShown(true)}
        >
          <div>
            Add comment
          </div>
        </button>
      }
      { commentInputsShown && <>
        <input
          className="w-60 m-2 input input-bordered input-primary"
          type="text"
          placeholder="Comment Title"
          onChange={(e) => setCommentTitle(e.target.value)}
        />
        <input
          className="w-60 m-2 input input-bordered input-primary"
          type="text"
          placeholder="Comment Content"
          onChange={(e) => setCommentContent(e.target.value)}
        />
        <div className="w-60 flex flex-row gap-2">
          <button
            className="group flex-grow btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
            onClick={() => addComment(commentTitle, commentContent, poll.pubkey)}
          >
            <div>
              Submit
            </div>
          </button>
          <button
            className="group flex-grow btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
            onClick={(e) => setCommentInputsShown(false)}
          >
            <div>
              Cancel
            </div>
          </button>
        </div></>
      }
      <div className="text-wrap pt-2 text-left">
        <div className="pb-2 font-bold">Comments:</div>
        { poll.comments &&
          poll.comments.map((comment) =>
            <CommentItem
              key={comment.pubkey.toString()}
              comment={comment}
              publicKey={publicKey}
              removeComment={removeComment}
            />
          )
        }
      </div>
    </div>
  )
}