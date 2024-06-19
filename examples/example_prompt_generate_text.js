/**
 * The following example flow:
 * - initialize SDK
 * - store prompt in space
 * - get stored prompt
 * - deploy stored prompt
 * - generate text based on deployed prompt
 */

/**
 * Use 'import ...' statement if you want to use the sample in the module
 * and comment 'const watsonxAI...' statement
 * 
**/

const { WatsonXAI } = require('@ibm-cloud/watsonx-ai');

// Service instance
let watsonxAIService;

process.env.IBM_CREDENTIALS_FILE = './auth/watsonx_ai_ml_vml_v1.env';
watsonxAIService = WatsonXAI.newInstance({
    version: '2024-05-31',
    serviceUrl: 'https://us-south.ml.cloud.ibm.com',

});


// Define parameters for text generation
const textGenRequestParametersModel = {
    max_new_tokens: 100,
    };

// Define parameters for created prompt structure
const promptData = {
    instruction: "Translate text from English to Spanish.",
    input_prefix: "ENGLISH",
    output_prefix: "SPANISH"
}

// Define parameters for created prompt content
const promptContentParams = {
    data: promptData,
    input: [["{input}", ""]],
    model_id: 'ibm/granite-20b-multilingual',
    model_parameters: textGenRequestParametersModel
}

// Define parameters for prompt creation request
const promptParameters = {
    name: "WXAI SDK Example Prompt",
    description: "Example prompt created from watsonx-ai-node-sdk library",
    spaceId: '<SPACE_ID>',
    prompt: promptContentParams,
    promptVariables: {
        "input": {
            "defaultValue": "This is my computer."
        }
    }
}

async function generateTextFromSavedPrompt() {

    // Store prompt
    const savePrompt = await watsonxAIService.postPrompt(promptParameters)
    const createdPromptId = savePrompt.result.id
    console.log("\n\n ***** PROMPT SAVED *****");
    console.log("Prompt ID: %s", createdPromptId)

    // Get stored prompt
    const getPrompt = await watsonxAIService.getPrompt({
        promptId: createdPromptId,
        spaceId: '<SPACE_ID>'
    })
    console.log("\n\n***** PROMPT CONTENT *****");
    console.log(JSON.stringify(getPrompt.result, null, 2));

    // Deploy stored prompt
    const createDeploy = await watsonxAIService.createDeployment({
        name: "Prompt deployment from WXAI SDK",
        baseModelId: promptContentParams.model_id,
        promptTemplate: {id: createdPromptId},
        spaceId: 'd45219e5-c0dc-4a09-ba8b-f92e8382f536',
        online: {}
    })
    console.log(JSON.stringify(createDeploy.result, null, 2));
    const createdDeployId = createDeploy.result.metadata.id
    console.log("\n\n ***** PROMPT DEPLOYED *****");
    console.log("Prompt ID: %s", createdDeployId)
    
    // Infer deployed prompt
    let modelInput = "It's sunny outside."
    const inferDeployedPrompt = await watsonxAIService.deploymentsTextGeneration({
        idOrName: createdDeployId,
        parameters: {
            prompt_variables: {
                "input": modelInput
            }
        }
    })
    console.log("\n\n***** TEXT INPUT INTO MODEL *****");
    console.log(modelInput)
    console.log("\n\n***** TEXT RESPONSE FROM MODEL *****");
    console.log(inferDeployedPrompt.result.results[0].generated_text);

}

// Execute example function
generateTextFromSavedPrompt()
