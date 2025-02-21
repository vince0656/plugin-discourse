import axios, { type AxiosInstance } from "axios";
import { Post } from "../types/Post";

export class DiscourseAPI {
    instance: AxiosInstance;

    constructor(instanceUrl: string) {
        // Removing any trailing slash on the instance URL
        const trimmedInstanceUrl = instanceUrl.replace(
            /\/$/,
            "",
        );

        // Creating the axios instance with the base URL injected
        this.instance = axios.create({ baseURL: trimmedInstanceUrl });
    }

    /**
     * Fetches the latest posts from the Discourse instance
     * @param limit Optional maximum number of posts to return
     * @returns Array of Post objects containing the latest posts
     * @throws Error if no posts are found or if the API request fails
     */
    async getLatestPosts(limit?: number): Promise<Post[]> {
        const response = await this.instance.get("/posts", {
            headers: {
                accept: "application/json",
            },
        });

        // Validate the posts response
        const posts = response.data;
        if (
            !posts.latest_posts ||
            !posts.latest_posts.length ||
            posts.latest_posts.length === 0
        ) {
            throw new Error("No post data found");
        }

        if (limit && posts.latest_posts.length > limit) {
            return posts.latest_posts.slice(0, limit);
        }

        return posts.latest_posts;
    }

    /**
     * Formats an array of Discourse posts into a readable string format
     * @param posts Array of Post objects to format
     * @returns Formatted string containing post details
     * @throws Error if posts array is invalid, empty or contains invalid post objects
     */
    formatLatestPostsData(posts: Post[]): string {
        if (!Array.isArray(posts)) {
            throw new Error('Posts must be an array');
        }

        if (posts.length === 0) {
            throw new Error('Posts array is empty');
        }

        return posts
            .map((post) => {
                if (!post || typeof post !== 'object') {
                    throw new Error('Invalid post object');
                }

                if (!post.id || !post.created_at || !post.username || !post.raw) {
                    throw new Error('Post is missing required fields');
                }

                return `Post ID: ${post.id}\nCreated At: ${post.created_at}\nUsername: ${post.username}\nRaw: ${post.raw}\n\n`;
            })
            .join("");
    }

}