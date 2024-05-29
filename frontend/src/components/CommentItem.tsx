import { decodeTheUInt8 } from '../utils';
import { Comment } from './Poll';
import { web3 } from '@coral-xyz/anchor';

interface CommentItemProps {
  comment: Comment;
  publicKey: web3.PublicKey | null;
  removeComment: (commentKey: web3.PublicKey) => Promise<void>;
}

export const CommentItem = ({ comment, publicKey, removeComment }: CommentItemProps) => {
  return (
    <div className="flex flex-col items-start p-2 border-2 rounded-lg border-slate-500 bg-gradient-to-br from-indigo-600 to-fuchsia-600">
      <div className='font-bold text-sm self-end'>
        {decodeTheUInt8(comment.title)}
      </div>
      <div className='text-sm'>
        {decodeTheUInt8(comment.content)}
      </div>
      {comment.commentAuthor.toString() === publicKey?.toString() &&
        <button
          className="group w-24 mt-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
          onClick={(e) => removeComment(comment.pubkey)}
        >
          <div>
            remove
          </div>
        </button>
      }
    </div>
  );
}