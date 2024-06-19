/**
 * The following example flow:
 * - initialize SDK
 * - tokenize input on two chosen models
 * - compare how input is split into tokens between two models
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

async function tokenizeInputAndCompare() {

    // Specify two models
    const model1 = 'google/flan-ul2'
    const model2 = 'meta-llama/llama-3-8b-instruct'

    // Specify input data
    const input = "You should be able to notice a difference between how the models are splitting the input into tokens."

    // Tokenize input data on 1st model
    const textTokenzationParameters1 = {
        input: input,
        modelId: model1,
        spaceId: '<SPACE_ID>',
        parameters: {
            return_tokens: true
        }
    }
    const tokenize1 = await watsonxAIService.textTokenization(textTokenzationParameters1)
    tokens1 = tokenize1.result.result.tokens
    console.log("\n\n***** TOKENS FROM 1ST MODEL *****");
    console.log(tokens1);

    // Tokenize input data on 2nd model
    const textTokenzationParameters2 = {
        input: input,
        modelId: model2,
        spaceId: '<SPACE_ID>',
        parameters: {
            return_tokens: true
        }
    }
    const tokenize2 = await watsonxAIService.textTokenization(textTokenzationParameters2)
    tokens2 = tokenize2.result.result.tokens
    console.log("\n\n***** TOKENS FROM 2ND MODEL *****");
    console.log(tokens2);

}

// Execute example function
tokenizeInputAndCompare()
