import { KnowledgeBase } from "./knowledgeBase";

const knowledgeBase = new KnowledgeBase();
const result = knowledgeBase.updateApiAIEntities();
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
