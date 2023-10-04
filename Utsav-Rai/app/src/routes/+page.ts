import type { PageLoad } from "./$types";

export const load = (() => {
    // you can get this data from ANY SOURCE
    // fetch call here
    // graphql client
    // manually change this object here whenever you want

    return {
        srcCode: [
            {
				contestName: "CodeForces",
				codingPlatform: "",
				problemId: "A",
				code: `<div>This is a div</div>`,
				favorite: false
			},
			{
				contestName: "Cool code snippet",
				codingPlatform: "typescript",
				problemId: "B",
				code: `console.log("Subscribe");`,
				favorite: false
			}
        ]
    }
}) satisfies PageLoad; // PageLoad -> PageData (in our frontend)