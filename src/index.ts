import type { Plugin } from "@elizaos/core";
import { discoursePostsProvider } from "./providers/discoursePosts";

export const discoursePlugin: Plugin = {
    name: "discourse",
    description: "Discourse Plugin for Eliza fetching posts from a Discourse instance",
    actions: [],
    evaluators: [],
    providers: [discoursePostsProvider],
};

export default discoursePlugin;
