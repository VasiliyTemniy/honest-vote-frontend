import type { NextPage } from "next";
import Head from "next/head";
import { VoteAppView } from "../views";

const VoteApp: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Scaffold</title>
        <meta
          name="description"
          content="Basic Functionality"
        />
      </Head>
      <VoteAppView />
    </div>
  );
};

export default VoteApp;
