import { Resolver } from "./resolver";

const resolver = new Resolver();
const result = resolver.updateApiAIEntities();
result
    .then(results => {
        results.forEach(result => {
            console.log(result);
        });
    })
    .catch(e => {
        console.error(JSON.stringify(e, null, 2));
        process.exit(1);
    });
