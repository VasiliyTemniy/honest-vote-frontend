import { PublicKey } from '@solana/web3.js';
import { format } from 'date-fns';
import { utils } from '@coral-xyz/anchor';
import { VoteIDL } from '@honest-vote-platform/anchor';
import { notify } from './notifications';

const POLL_SEED = "POLL_SEED";
const POLL_SUBJECT_SEED = "POLL_SUBJECT_SEED";
const VOTE_SEED = "VOTE_SEED";
const COMMENT_SEED = "COMMENT_SEED";

// Concatenates classes into a single className string
const cn = (...args: string[]) => args.join(' ');

const formatDate = (date: string) => format(new Date(date), 'MM/dd/yyyy h:mm:ss');

/**
 * Formats number as currency string.
 *
 * @param number Number to format.
 */
const numberToCurrencyString = (number: number) =>
    number.toLocaleString('en-US');

/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
const clamp = (current: number, min: number, max: number) => Math.min(Math.max(current, min), max);

function getCommentAddress(comment_title: string, author: PublicKey, parent_poll: PublicKey, programID: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [
      utils.bytes.utf8.encode(COMMENT_SEED),
      author.toBuffer(),
      utils.bytes.utf8.encode(comment_title),
      parent_poll.toBuffer(),
    ], programID);
}

function getPollAddress(topic: string, author: PublicKey, programID: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [
      utils.bytes.utf8.encode(topic),
      utils.bytes.utf8.encode(POLL_SEED),
      author.toBuffer()
    ], programID);
}

function getVoteAddress(author: PublicKey, poll: PublicKey, programID: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [
      utils.bytes.utf8.encode(VOTE_SEED),
      author.toBuffer(),
      poll.toBuffer(),
    ], programID);
}

function getPollSubjectAddress(title: string, author: PublicKey, poll: PublicKey, programID: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [
      utils.bytes.utf8.encode(title),
      utils.bytes.utf8.encode(POLL_SUBJECT_SEED),
      poll.toBuffer(),
      author.toBuffer()
    ], programID);
}

const discriminatorMap = VoteIDL.accounts.reduce((acc: { [key: string]: string }, account) => {
  const hash = account.discriminator.reduce((acc, val) => acc + val.toString(16), '0x');
  acc[hash] = account.name
  return acc;
}, {});

const decodeTheUInt8 = (solanaCriptyCrapty: number[]): string => {
  try {
    const decoder = new TextDecoder();
    return decoder.decode(new Uint8Array(solanaCriptyCrapty.filter(x => x !== 0)));
  } catch (error: any) {
    console.log('ERROR while decoding the uint8! ', error);
    notify({ type: 'error', message: 'Error while decoding the uint8', description: error.message });
    return '';
  }
}

export {
    POLL_SEED,
    POLL_SUBJECT_SEED,
    VOTE_SEED,
    COMMENT_SEED,
    getCommentAddress,
    getPollAddress,
    getVoteAddress,
    getPollSubjectAddress,
    cn,
    formatDate,
    numberToCurrencyString,
    clamp,
    discriminatorMap,
    decodeTheUInt8
};
