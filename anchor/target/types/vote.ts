/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/vote.json`.
 */
export type Vote = {
  "address": "HNWtHRMh7LEjcsKZrQW7JKgTBWKWDZLVuUu9YG2LdQB1",
  "metadata": {
    "name": "vote",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "commentPoll",
      "discriminator": [
        42,
        73,
        251,
        159,
        116,
        91,
        233,
        188
      ],
      "accounts": [
        {
          "name": "commentAuthor",
          "writable": true,
          "signer": true
        },
        {
          "name": "comment",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  67,
                  79,
                  77,
                  77,
                  69,
                  78,
                  84,
                  95,
                  83,
                  69,
                  69,
                  68
                ]
              },
              {
                "kind": "account",
                "path": "commentAuthor"
              },
              {
                "kind": "arg",
                "path": "commentTitle"
              },
              {
                "kind": "account",
                "path": "poll"
              }
            ]
          }
        },
        {
          "name": "poll",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "poll.topic [.. poll.topic_length as usize]",
                "account": "poll"
              },
              {
                "kind": "const",
                "value": [
                  80,
                  79,
                  76,
                  76,
                  95,
                  83,
                  69,
                  69,
                  68
                ]
              },
              {
                "kind": "account",
                "path": "poll.poll_author",
                "account": "poll"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "commentTitle",
          "type": "string"
        },
        {
          "name": "commentContent",
          "type": "string"
        }
      ]
    },
    {
      "name": "commentRemove",
      "discriminator": [
        10,
        190,
        215,
        145,
        65,
        59,
        112,
        197
      ],
      "accounts": [
        {
          "name": "commentAuthor",
          "writable": true,
          "signer": true
        },
        {
          "name": "comment",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  67,
                  79,
                  77,
                  77,
                  69,
                  78,
                  84,
                  95,
                  83,
                  69,
                  69,
                  68
                ]
              },
              {
                "kind": "account",
                "path": "commentAuthor"
              },
              {
                "kind": "account",
                "path": "comment.title [.. comment.title_length as usize]",
                "account": "comment"
              },
              {
                "kind": "account",
                "path": "comment.parent_poll",
                "account": "comment"
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "pollAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "poll",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "topic"
              },
              {
                "kind": "const",
                "value": [
                  80,
                  79,
                  76,
                  76,
                  95,
                  83,
                  69,
                  69,
                  68
                ]
              },
              {
                "kind": "account",
                "path": "pollAuthority"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "topic",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        }
      ]
    },
    {
      "name": "initializePollSubject",
      "discriminator": [
        105,
        15,
        34,
        251,
        118,
        111,
        86,
        29
      ],
      "accounts": [
        {
          "name": "pollAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "pollSubject",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "title"
              },
              {
                "kind": "const",
                "value": [
                  80,
                  79,
                  76,
                  76,
                  95,
                  83,
                  85,
                  66,
                  74,
                  69,
                  67,
                  84,
                  95,
                  83,
                  69,
                  69,
                  68
                ]
              },
              {
                "kind": "account",
                "path": "poll"
              },
              {
                "kind": "account",
                "path": "pollAuthority"
              }
            ]
          }
        },
        {
          "name": "poll",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "poll.topic [.. poll.topic_length as usize]",
                "account": "poll"
              },
              {
                "kind": "const",
                "value": [
                  80,
                  79,
                  76,
                  76,
                  95,
                  83,
                  69,
                  69,
                  68
                ]
              },
              {
                "kind": "account",
                "path": "poll.poll_author",
                "account": "poll"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        }
      ]
    },
    {
      "name": "vote",
      "discriminator": [
        227,
        110,
        155,
        23,
        136,
        126,
        172,
        25
      ],
      "accounts": [
        {
          "name": "voteAuthor",
          "writable": true,
          "signer": true
        },
        {
          "name": "vote",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  86,
                  79,
                  84,
                  69,
                  95,
                  83,
                  69,
                  69,
                  68
                ]
              },
              {
                "kind": "account",
                "path": "voteAuthor"
              },
              {
                "kind": "account",
                "path": "poll"
              }
            ]
          }
        },
        {
          "name": "pollSubject",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "poll_subject.title [.. poll_subject.title_length as usize]",
                "account": "pollSubject"
              },
              {
                "kind": "const",
                "value": [
                  80,
                  79,
                  76,
                  76,
                  95,
                  83,
                  85,
                  66,
                  74,
                  69,
                  67,
                  84,
                  95,
                  83,
                  69,
                  69,
                  68
                ]
              },
              {
                "kind": "account",
                "path": "poll"
              },
              {
                "kind": "account",
                "path": "poll.poll_author",
                "account": "poll"
              }
            ]
          }
        },
        {
          "name": "poll",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "poll.topic [.. poll.topic_length as usize]",
                "account": "poll"
              },
              {
                "kind": "const",
                "value": [
                  80,
                  79,
                  76,
                  76,
                  95,
                  83,
                  69,
                  69,
                  68
                ]
              },
              {
                "kind": "account",
                "path": "poll.poll_author",
                "account": "poll"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "comment",
      "discriminator": [
        150,
        135,
        96,
        244,
        55,
        199,
        50,
        65
      ]
    },
    {
      "name": "poll",
      "discriminator": [
        110,
        234,
        167,
        188,
        231,
        136,
        153,
        111
      ]
    },
    {
      "name": "pollSubject",
      "discriminator": [
        206,
        157,
        101,
        14,
        29,
        103,
        127,
        89
      ]
    },
    {
      "name": "vote",
      "discriminator": [
        96,
        91,
        104,
        57,
        145,
        35,
        172,
        155
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "topicTooLong",
      "msg": "Cannot initialize, topic too long"
    },
    {
      "code": 6001,
      "name": "descriptionTooLong",
      "msg": "Cannot initialize, description too long"
    },
    {
      "code": 6002,
      "name": "titleTooLong",
      "msg": "Cannot initialize, title too long"
    },
    {
      "code": 6003,
      "name": "invalidPollAuthority",
      "msg": "Invalid Poll Authority - only poll author can add a poll subject"
    },
    {
      "code": 6004,
      "name": "maxVotesReached",
      "msg": "Maximum number of Votes Reached"
    },
    {
      "code": 6005,
      "name": "minVotesReached",
      "msg": "Minimum number of Votes Reached"
    },
    {
      "code": 6006,
      "name": "commentTooLong",
      "msg": "Comment too Long"
    }
  ],
  "types": [
    {
      "name": "comment",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "commentAuthor",
            "type": "pubkey"
          },
          {
            "name": "parentPoll",
            "type": "pubkey"
          },
          {
            "name": "title",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "titleLength",
            "type": "u8"
          },
          {
            "name": "content",
            "type": {
              "array": [
                "u8",
                500
              ]
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "poll",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pollAuthor",
            "type": "pubkey"
          },
          {
            "name": "topic",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "topicLength",
            "type": "u8"
          },
          {
            "name": "description",
            "type": {
              "array": [
                "u8",
                500
              ]
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "pollSubject",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "parentPoll",
            "type": "pubkey"
          },
          {
            "name": "title",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "titleLength",
            "type": "u8"
          },
          {
            "name": "votes",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "vote",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "voteAuthor",
            "type": "pubkey"
          },
          {
            "name": "parentPollSubject",
            "type": "pubkey"
          },
          {
            "name": "parentPoll",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
