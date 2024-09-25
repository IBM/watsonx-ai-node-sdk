/**
 * The following example flow:
 * - initialize SDK
 * - list available models
 * - infer one of available models
 */

/**
 * Use 'import ...' statement if you want to use the sample in the module
 * and comment 'const watsonxAI...' statement
 * 
**/

const { WatsonXAI } = require('@ibm-cloud/watsonx-ai');

process.env.IBM_CREDENTIALS_FILE = './auth/watsonx_ai_ml_vml_v1.env';

// Service instance
const watsonxAIService = WatsonXAI.newInstance({
    version: '2024-05-31',
    serviceUrl: 'https://us-south.ml.cloud.ibm.com',

});


// Define parameters for text generation
const textGenRequestParametersModel = {
    max_new_tokens: 100,
};

// Define model list filter
const listModelParams = {
    filters: "lifecycle_available"
}

async function listModelsAndGenerateText() {
    
    // Get available models
    const listModels = await watsonxAIService.listFoundationModelSpecs(listModelParams)
    const modelList = listModels.result.resources.map(model => model.model_id);
    console.log("\n\n***** LIST OF AVAILABLE MODELS *****");
    console.log(modelList);

    // Infer one of available models
    let genParams = {
        input: 'Generate a short greeting for project kick-off meeting.',
        modelId: 'google/flan-ul2',
        spaceId: '<SPACE_ID>',
        parameters: textGenRequestParametersModel,
    };
    const textGeneration = await watsonxAIService.generateText(genParams)
    console.log("\n\n***** TEXT INPUT INTO MODEL *****");
    console.log(genParams.input)
    console.log("\n\n***** TEXT RESPONSE FROM MODEL *****");
    console.log(textGeneration.result.results[0].generated_text);

}

// Execute example function
listModelsAndGenerateText()
