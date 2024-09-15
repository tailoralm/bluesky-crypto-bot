import axios from "axios";
import {ICryptoGetPrice} from "../../interfaces/cryptos.interface";

export default class BlueskyService {
  BASE_URL: string;

  constructor(private readonly identifier: string, private readonly password: string) {
    this.BASE_URL = "https://bsky.social/xrpc";
  }
    async authenticateBlueSky() {
      try {
        const response = await axios.post(
            `${this.BASE_URL}/com.atproto.server.createSession`,
            {
            identifier: this.identifier,
            password: this.password,
            }
        );
        return response.data.accessJwt;
      } catch (error) {
        throw new Error(`Error authenticating with BlueSky(${this.identifier}): ${error.message}`);
      }
    }

    async postBlueSky(message: ICryptoGetPrice) {
      if (process.env.IS_DEV) return console.log(message);
      try {
        const token = await this.authenticateBlueSky();
        const facets = this.createHashtagFacets(message.postText);
        const postResponse = await axios.post(
            `${this.BASE_URL}/com.atproto.repo.createRecord`,
            {
                collection: "app.bsky.feed.post",
                repo: this.identifier,
                record: {
                    $type: "app.bsky.feed.post",
                    text: message.postText,
                    facets,
                    createdAt: new Date().toISOString(),
                },
            },
                {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log(`BlueSky post with hashtags successful for ${this.identifier}`);
        return postResponse.data;
      } catch (error) {
        throw new Error(`Error posting to BlueSky(${this.identifier}): ${error.message}`);
      }
    }

    createHashtagFacets(message: string) {
      console.log(message);
      const hashtagRegex = /#\w+/g;
      const matches = [...message.matchAll(hashtagRegex)];

      console.log(matches);

      return matches.map((match) => ({
        index: {
            byteStart: match.index,
            byteEnd: match.index + match[0].length,
        },
        features: [
            {
            $type: "app.bsky.richtext.facet#tag",
            tag: match[0].substring(1),
            },
        ],
      }));
    }

}
