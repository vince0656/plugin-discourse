import { IAgentRuntime, Memory, Provider, State, elizaLogger } from "@elizaos/core";

import { validateDiscourseConfig } from "../environment";
import { DiscourseAPI } from "../api/DiscourseAPI";

// Provider that focuses on getting the latest posts from a Discourse instance and formatting them for the agent
const discoursePostsProvider: Provider = {
    get: async (
        runtime: IAgentRuntime,
        _message: Memory,
        _state?: State,
    ): Promise<string | null> => {
        try {
            // Extract and validate the Discourse configuration from the runtime context
            const config = await validateDiscourseConfig(runtime);
            const client = new DiscourseAPI(config.DISCOURSE_INSTANCE_URL);

            // Make the API call to get the latest posts
            const posts = await client.getLatestPosts(config.DISCOURSE_POSTS_LIMIT ?? 5);

            // Log the number of posts found
            elizaLogger.info(`Found ${posts.length} posts from ${config.DISCOURSE_INSTANCE_URL}`);

            // Return the formatted post data as a string
            return client.formatLatestPostsData(posts);
        } catch (error) {
            elizaLogger.error("Error fetching posts from the Discourse instance - report this to the user and get the dev on the line", error);
            return null;
        }
    },
};

// Module exports
export { discoursePostsProvider };
