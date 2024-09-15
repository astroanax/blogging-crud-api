import { Command } from 'https://deno.land/x/cliffy@v1.0.0-rc.4/command/mod.ts';
import { Input } from 'https://deno.land/x/cliffy@v1.0.0-rc.4/prompt/mod.ts';

const HOST = 'http://localhost:12345';

let auth;
try {
    // Read the content of the file
    auth = JSON.parse(await Deno.readTextFile('jwt.json'));
} catch (error) {
    console.error('Error reading file:', error);
}

const blogsCommand = await new Command()
    .name('blogs')
    .description('add, edit, view or delete blogs')
    .command('create')
    .action(async () => {
        console.log(auth);
        const title = await Input.prompt({
            type: 'input',
            name: 'title',
            message: 'Enter the title of the blog'
        });

        const content = await Input.prompt({
            type: 'input',
            name: 'content',
            message: 'Enter the content of the blog'
        });

        const data = { title: title, content: content };
        const response = await fetch(HOST + '/blogs/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth.jwt
            },
            body: JSON.stringify(data)
        });
        console.log(response.status, response.statusText);
    })
    .command('delete')
    .name('delete')
    .description('delete a blog by its id')
    .option('-i, --id=<id>', 'the blog id')
    .action(async (id: string) => {
	    console.log(id.id);
        const response = await fetch(HOST + '/blogs/' + id.id, {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + auth.jwt
            }
        });
        console.log(response.status, response.statusText);
    })
    .command('get')
    .name('get')
    .description('get a blog by its id')
    .option('-i, --id=<id>', 'the blog id')
    .action(async (id: string) => {
	    console.log(id.id);
        const response = await fetch(HOST + '/blogs/' + id.id, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + auth.jwt
            }
        });
        console.log(response.status, response.statusText);
	const bodyJson = await response.json()
        console.log("Title:", bodyJson.title);
        console.log("Content:", bodyJson.content);
    });

await new Command()
    .name('bloggingapi-cli')
    .description('a cli to manage your blogging account')
    .version('v1.0.0')
    .command('login')
    .action(async () => {
        const username = await Input.prompt({
            type: 'input',
            name: 'username',
            message: 'Enter your username:'
        });

        const password = await Input.prompt({
            type: 'password',
            name: 'password',
            message: 'Enter your password:',
            mask: '*'
        });
        const data = { username: username, password: password };
        const response = await fetch(HOST + '/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const resJson = await response.json();
        console.log(resJson);

        const filePath = 'jwt.json';
        try {
            await Deno.writeTextFile(filePath, JSON.stringify(resJson));
            console.log(`saved jwt at ${filePath}`);
        } catch (error) {
            console.error('error saving jwt:', error);
        }
    })
    .command('blogs', blogsCommand)
    .parse();
