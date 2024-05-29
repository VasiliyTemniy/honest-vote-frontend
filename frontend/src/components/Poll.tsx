import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { FC, useState } from 'react';
import { notify } from "../utils/notifications";

import { AnchorProvider, web3, setProvider, BN} from '@coral-xyz/anchor';
import { getVoteProgram } from '@honest-vote-platform/anchor';
import { getPollAddress, getPollSubjectAddress, discriminatorMap, getCommentAddress, decodeTheUInt8, getVoteAddress } from '../utils';
import { PollItem } from './PollItem';


export interface Poll {
  pubkey: web3.PublicKey;
  pollAuthor: web3.PublicKey;
  topic: number[];
  topicLength: number;
  description: number[];
  bump: number;
  pollSubjects?: PollSubject[];
  comments?: Comment[];
}

export interface PollSubject {
  pubkey: web3.PublicKey;
  parentPoll: web3.PublicKey;
  title: number[];
  titleLength: number;
  votes: BN;
  bump: number;
}

export interface Comment {
  pubkey: web3.PublicKey;
  commentAuthor: web3.PublicKey;
  parentPoll: web3.PublicKey;
  title: number[];
  titleLength: number;
  content: number[];
  bump: number;
}

export const Poll: FC = () => {
    const { wallet, publicKey, signAllTransactions, signTransaction } = useWallet();
    const { connection } = useConnection();

    const [ pollInputsShown, setPollInputsShown ] = useState(false);

    const [ pollTopic, setPollTopic ] = useState('');
    const [ pollDescription, setPollDescription ] = useState('');

    const [ polls, setPolls ] = useState<Poll[]>([]);

    const getProvider = () => {
      if (!wallet || !signAllTransactions || !signTransaction || !publicKey || !connection) {
        return null;
      }
      const provider = new AnchorProvider(connection, { ...wallet, signAllTransactions, signTransaction, publicKey }, AnchorProvider.defaultOptions());
      setProvider(provider);
      return provider;
    };

    const createPoll = async (topic: string, description: string) => {
      try {
        const anchorProvider = getProvider();
        if (!anchorProvider) {
          throw new Error('Could not get the anchor provider');
        }
        const voteProgram = getVoteProgram(anchorProvider);

        const [ poll_pubKey ] = getPollAddress(topic, anchorProvider.publicKey, voteProgram.programId);

        await voteProgram.methods.initialize(topic, description)
          .accountsStrict(
            {
              pollAuthority: anchorProvider.publicKey,
              poll: poll_pubKey,
              systemProgram: web3.SystemProgram.programId
            }
          ).rpc()

        setPollInputsShown(false);

        await getPolls();

      } catch (error: any) {
        console.log('ERROR while creating a poll! ', error);
        notify({ type: 'error', message: 'Error while creating a poll', description: error.message });
        return;
      }
    }

    const distinguishAccount = (account: {
      pubkey: web3.PublicKey;
      account: web3.AccountInfo<Buffer | web3.ParsedAccountData>;
    }): string => {
      const data = Array.from(account.account.data as Uint8Array);
      const discriminator = data.slice(0, 8);
      const hash = discriminator.reduce((acc, val) => acc + val.toString(16), '0x');
      const accountType = discriminatorMap[hash];
      return accountType;
    };

    const getPolls = async () => {
      try {
        const anchorProvider = getProvider();
        if (!anchorProvider) {
          throw new Error('Could not get the anchor provider');
        }
        const voteProgram = getVoteProgram(anchorProvider);

        const accounts = await connection.getParsedProgramAccounts(voteProgram.programId);

        const pollMap: {
          [key: string]: Poll
        } = {};

        const pollSubjectMap: {
          [key: string]: PollSubject[]
        } = {};

        const commentMap: {
          [key: string]: Comment[]
        } = {};

        for (const account of accounts) {
          const accountType = distinguishAccount(account);

          let fetched;

          switch (accountType) {
            case 'Poll':
              fetched = await voteProgram.account.poll.fetch(account.pubkey);
              pollMap[account.pubkey.toString()] = {
                ...fetched,
                pubkey: account.pubkey
              };
              break;
            case 'PollSubject':
              fetched = await voteProgram.account.pollSubject.fetch(account.pubkey);
              if (pollSubjectMap[fetched.parentPoll.toString()]) {
                pollSubjectMap[fetched.parentPoll.toString()].push({ ...fetched, pubkey: account.pubkey });
              } else {
                pollSubjectMap[fetched.parentPoll.toString()] = [{ ...fetched, pubkey: account.pubkey }];
              }
              break;
            case 'Vote':
              // Not needed
              // fetched = await voteProgram.account.vote.fetch(account.pubkey);
              // data[unparsedAccount.pubkey.toString()] = fetched;
              break;
            case 'Comment':
              fetched = await voteProgram.account.comment.fetch(account.pubkey);
              if (commentMap[fetched.parentPoll.toString()]) {
                commentMap[fetched.parentPoll.toString()].push({ ...fetched, pubkey: account.pubkey });
              } else {
                commentMap[fetched.parentPoll.toString()] = [{ ...fetched, pubkey: account.pubkey }];
              }
              break;
            default:
              throw new Error('Unknown account type');
          }
        }

        const parsedPolls = Object.values(pollMap);

        const sortedPolls = parsedPolls.sort((a, b) => decodeTheUInt8(a.topic).localeCompare(decodeTheUInt8(b.topic)));

        for (const poll of sortedPolls) {
          poll.pollSubjects = pollSubjectMap[poll.pubkey.toString()]
            ? pollSubjectMap[poll.pubkey.toString()].sort((a, b) => decodeTheUInt8(a.title).localeCompare(decodeTheUInt8(b.title)))
            : [];
          // Do not sort the comments
          poll.comments = commentMap[poll.pubkey.toString()]
            ? commentMap[poll.pubkey.toString()]
            : [];
        }

        setPolls(sortedPolls);

        console.log(polls);

      } catch (error: any) {
        console.log('ERROR while getting polls! ', error);
        notify({ type: 'error', message: 'Error while getting polls', description: error.message });
        return;
      }
    };

    const createPollSubject = async (title: string, pollKey: web3.PublicKey) => {
      try {
        const anchorProvider = getProvider();
        if (!anchorProvider) {
          throw new Error('Could not get the anchor provider');
        }
        const voteProgram = getVoteProgram(anchorProvider);

        const [ pollSubject_pubKey ] = getPollSubjectAddress(title, anchorProvider.publicKey, pollKey, voteProgram.programId);

        await voteProgram.methods.initializePollSubject(title)
          .accountsStrict(
            {
              pollAuthority: anchorProvider.publicKey,
              pollSubject: pollSubject_pubKey,
              poll: pollKey,
              systemProgram: web3.SystemProgram.programId
            }
          ).rpc()

        await getPolls();

      } catch (error: any) {
        console.log('ERROR while creating a poll subject! ', error);
        notify({ type: 'error', message: 'Error while creating a poll subject', description: error.message });
        return;
      }
    }

    const addComment = async (title: string, content: string, parentPoll: web3.PublicKey) => {
      try {
        const anchorProvider = getProvider();
        if (!anchorProvider) {
          throw new Error('Could not get the anchor provider');
        }
        const voteProgram = getVoteProgram(anchorProvider);

        const [ comment_pubKey ] = getCommentAddress(title, anchorProvider.publicKey, parentPoll, voteProgram.programId);

        await voteProgram.methods.commentPoll(title, content)
          .accountsStrict(
            {
              commentAuthor: anchorProvider.publicKey,
              comment: comment_pubKey,
              poll: parentPoll,
              systemProgram: web3.SystemProgram.programId
            }
          ).rpc()

        await getPolls();

      } catch (error: any) {
        console.log('ERROR while adding a comment! ', error);
        notify({ type: 'error', message: 'Error while adding a comment', description: error.message });
        return;
      }
    }

    const addVote = async (pollKey: web3.PublicKey, pollSubjectKey: web3.PublicKey) => {
      try {
        const anchorProvider = getProvider();
        if (!anchorProvider) {
          throw new Error('Could not get the anchor provider');
        }
        const voteProgram = getVoteProgram(anchorProvider);

        const [ vote_pubKey ] = getVoteAddress(anchorProvider.publicKey, pollKey, voteProgram.programId);

        await voteProgram.methods.vote()
          .accountsStrict(
            {
              voteAuthor: anchorProvider.publicKey,
              vote: vote_pubKey,
              pollSubject: pollSubjectKey,
              poll: pollKey,
              systemProgram: web3.SystemProgram.programId
            }
          ).rpc()

        await getPolls();

      } catch (error: any) {
        console.log('ERROR while adding a vote! ', error);
        notify({ type: 'error', message: 'Error while adding a vote', description: error.message });
        return;
      }
    }

    const removeComment = async (commentKey: web3.PublicKey) => {
      try {
        const anchorProvider = getProvider();
        if (!anchorProvider) {
          throw new Error('Could not get the anchor provider');
        }
        const voteProgram = getVoteProgram(anchorProvider);

        await voteProgram.methods.commentRemove()
          .accountsStrict(
            {
              commentAuthor: anchorProvider.publicKey,
              comment: commentKey
            }
          ).rpc()

        await getPolls();

      } catch (error: any) {
        console.log('ERROR while removing a comment! ', error);
        notify({ type: 'error', message: 'Error while removing a comment', description: error.message });
        return;
      }
    }
    
    return (
      <div className="flex justify-center items-center flex-col w-72rem">
        <div className="relative group items-center w-fit">
          <div className="m-1 -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-lg">
            { !pollInputsShown && <>
              <button
                  className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
                  onClick={(e) => setPollInputsShown(true)} disabled={!publicKey}
              >
                  <div className="hidden group-disabled:block">
                      Wallet not connected
                  </div>
                  <span className="block group-disabled:hidden" > 
                      Create Poll
                  </span>
              </button>
              <button
                  className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
                  onClick={(e) => getPolls()} disabled={!publicKey}
              >
                  <div className="hidden group-disabled:block">
                      Wallet not connected
                  </div>
                  <span className="block group-disabled:hidden" > 
                      Fetch Polls
                  </span>
              </button></>
            }
            { pollInputsShown && <>
              <div className="m-1 -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-lg">
              <input
                className="w-60 m-2 input input-bordered input-primary"
                type="text"
                placeholder="Poll Topic"
                onChange={(e) => setPollTopic(e.target.value)}
              />
              <input
                className="w-60 m-2 input input-bordered input-primary"
                type="text"
                placeholder="Poll Description"
                onChange={(e) => setPollDescription(e.target.value)}
              />
              <button
                className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
                onClick={(e) => createPoll(pollTopic, pollDescription)}
              >
                <div className='block'>
                  Submit Poll
                </div>
              </button>
              <button
                className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
                onClick={(e) => setPollInputsShown(false)}
              >
                <div className='block'>
                  Cancel
                </div>
              </button></div></>
            }
          </div>
        </div>
        {polls.length > 0 &&
          <div className="relative group items-center w-fit">
            {polls.map((poll) => (
              <PollItem
                key={poll.pubkey.toString()}
                poll={poll}
                publicKey={publicKey}
                createPollSubject={createPollSubject}
                addComment={addComment}
                addVote={addVote}
                removeComment={removeComment}
              />
            ))}
          </div>
        }
      </div>
    );
};
