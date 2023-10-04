// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Locals {}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
}

interface CodeSnippetInput {
	contestName: string
	codingPlatform: string
	problemId: string
	code: string
}

interface CodeSnippet {
	contestName: string
	codingPlatform: string
	problemId: string
	code: string
	starred: boolean
	// userCreated : User, createdOn: string
}

//this file  is for typescript support in svelte files  (not needed for js files) 
